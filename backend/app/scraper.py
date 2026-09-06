import re
import random
import httpx
from bs4 import BeautifulSoup
from typing import List, Dict, Any, Tuple

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15"
]

def get_headers() -> Dict[str, str]:
    return {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "DNT": "1"
    }

async def fetch_etsy_suggestions(keyword: str) -> List[str]:
    suggest_url = f"https://www.etsy.com/api/v3/ajax/public/neu/specs/search-suggest?query={keyword.replace(' ', '+')}"
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            res = await client.get(suggest_url, headers=get_headers())
            if res.status_code == 200:
                data = res.json()
                results = data.get("output", {}).get("results", [])
                queries = [item.get("query") for item in results if item.get("query")]
                if queries:
                    return queries
    except Exception:
        pass
    return [keyword, f"{keyword} personalized", f"{keyword} gift", f"{keyword} custom", f"{keyword} handmade"]

async def scrape_etsy_search(keyword: str, page: int = 1) -> Tuple[List[Dict[str, Any]], int]:
    url = f"https://www.etsy.com/search?q={keyword.replace(' ', '+')}&ref=pagination&page={page}"
    listings = []

    try:
        async with httpx.AsyncClient(timeout=5.0, follow_redirects=True) as client:
            res = await client.get(url, headers=get_headers())
            if res.status_code != 200:
                return listings, res.status_code

            soup = BeautifulSoup(res.text, "html.parser")
            items = soup.select("div.v2-listing-card, li.wt-list-unstyled div.listing-link, [data-listing-id]")

            for item in items:
                title_el = item.select_one("h3.wt-text-truncate, h3, .v2-listing-card__title")
                price_el = item.select_one("span.currency-value, .lc-price .currency-value")
                rating_el = item.select_one("input[name='rating'], span.screen-reader-only")
                reviews_el = item.select_one("span.wt-text-caption, span.wt-badge--status-02, .v2-listing-card__rating")
                shop_el = item.select_one("p.wt-text-caption, .v2-listing-card__shop")
                link_el = item.select_one("a.listing-link, a[href*='/listing/']")
                img_el = item.select_one("img")

                if not title_el or not price_el:
                    continue

                title = title_el.get_text(strip=True)
                raw_price = price_el.get_text(strip=True).replace(",", "")
                try:
                    price = float(re.findall(r"\d+\.?\d*", raw_price)[0])
                except (IndexError, ValueError):
                    continue

                reviews_count = 0
                if reviews_el:
                    rev_text = reviews_el.get_text(strip=True).replace(",", "")
                    rev_matches = re.findall(r"\((\d+)\)|\b(\d+)\b", rev_text)
                    if rev_matches:
                        flattened = [m for sub in rev_matches for m in sub if m]
                        if flattened:
                            reviews_count = int(flattened[-1])

                rating = 5.0
                if rating_el:
                    val_match = re.findall(r"\d+\.?\d*", rating_el.get("value") or rating_el.get_text(strip=True))
                    if val_match:
                        rating = min(5.0, max(1.0, float(val_match[0])))

                shop_name = shop_el.get_text(strip=True) if shop_el else "Etsy Artisan"
                is_bestseller = bool(item.select_one(".wt-badge--bestseller, span:-soup-contains('Bestseller')"))
                is_free_shipping = bool(item.select_one("span:-soup-contains('FREE shipping')"))

                href = link_el.get("href", "") if link_el else ""
                if href.startswith("/"):
                    href = f"https://www.etsy.com{href}"

                listings.append({
                    "listing_id": item.get("data-listing-id"),
                    "title": title,
                    "price": price,
                    "currency": "USD",
                    "rating": rating,
                    "reviews_count": reviews_count,
                    "shop_name": shop_name,
                    "is_bestseller": is_bestseller,
                    "is_free_shipping": is_free_shipping,
                    "listing_url": href,
                    "image_url": img_el.get("src") or img_el.get("data-src") if img_el else None
                })

            return listings, 200
    except Exception:
        return listings, 500