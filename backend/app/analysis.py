from typing import Dict, Any, List
from app.models import (
    LandedCostEconomics, TwentyFactorScoreBreakdown,
    PriceLadderTier, EstimatedSalesRevenue
)

def calculate_master_landed_economics(
    retail_price: float,
    supplier_unit: float = 6.00,
    shipping_cost: float = 3.50,
    packaging: float = 1.50,
    personalization: float = 1.00
) -> LandedCostEconomics:
    ad_cpa = round(retail_price * 0.14, 2)
    return_buffer = round(retail_price * 0.025, 2)

    transaction_fee = round(retail_price * 0.065, 2)
    payment_fee = round((retail_price * 0.03) + 0.25, 2)
    listing_fee = 0.20
    total_platform_fees = round(transaction_fee + payment_fee + listing_fee, 2)

    total_landed = round(
        supplier_unit + shipping_cost + packaging + personalization + total_platform_fees + ad_cpa + return_buffer, 2
    )
    gross_profit = round(retail_price - (supplier_unit + shipping_cost + packaging + personalization), 2)
    gross_margin_pct = round((gross_profit / retail_price) * 100, 1) if retail_price > 0 else 0.0

    net_profit = round(retail_price - total_landed, 2)
    net_margin_pct = round((net_profit / retail_price) * 100, 1) if retail_price > 0 else 0.0

    fixed_costs = supplier_unit + shipping_cost + packaging + personalization + ad_cpa + return_buffer + 0.45
    breakeven_price = round(fixed_costs / (1.0 - 0.095), 2)
    breakeven_roas = round(retail_price / ad_cpa, 2) if ad_cpa > 0 else 0.0

    max_cpa = max(0.0, net_profit + ad_cpa)
    max_cpc = round(max_cpa * 0.028, 2)

    return LandedCostEconomics(
        recommended_retail_price=retail_price,
        supplier_unit_cost=supplier_unit,
        inbound_shipping_cost=shipping_cost,
        custom_packaging_cost=packaging,
        personalization_labor_cost=personalization,
        etsy_transaction_fee=transaction_fee,
        etsy_payment_fee=payment_fee,
        etsy_listing_fee=listing_fee,
        ad_cpa_budget=ad_cpa,
        return_refund_buffer=return_buffer,
        total_landed_cost=total_landed,
        gross_profit=gross_profit,
        gross_margin_pct=gross_margin_pct,
        net_profit_before_tax=net_profit,
        net_margin_pct=net_margin_pct,
        breakeven_selling_price=breakeven_price,
        breakeven_roas=breakeven_roas,
        max_acceptable_cpa=max_cpa,
        max_acceptable_cpc=max_cpc
    )

def generate_price_ladder(base_cost: float, shipping: float) -> List[PriceLadderTier]:
    tiers = [
        {"strategy": "Budget / Velocity", "markup": 2.6, "positioning": "High-volume discount entry"},
        {"strategy": "Recommended Optimum", "markup": 3.6, "positioning": "Best balance of conversion & margin"},
        {"strategy": "Premium Gift", "markup": 4.5, "positioning": "Gift packaging & express dispatch"},
        {"strategy": "Luxury Keepsake", "markup": 5.8, "positioning": "Full customization with heirloom materials"}
    ]
    ladder = []
    for t in tiers:
        p = round((base_cost + shipping) * t["markup"], 2)
        econ = calculate_master_landed_economics(p, base_cost, shipping)
        ladder.append(PriceLadderTier(
            strategy=t["strategy"],
            price=p,
            gross_margin_pct=econ.gross_margin_pct,
            net_margin_pct=econ.net_margin_pct,
            positioning=t["positioning"]
        ))
    return ladder

def compute_sales_estimates(raw_listings: List[Dict[str, Any]], median_price: float) -> EstimatedSalesRevenue:
    total_reviews = sum(l.get("reviews_count", 0) for l in raw_listings)
    avg_reviews = total_reviews / max(1, len(raw_listings)) if raw_listings else 65
    
    est_monthly_units = int(max(40, min(750, (avg_reviews * 0.15) + 30)))
    est_monthly_rev = round(est_monthly_units * median_price, 2)
    est_annual_rev = round(est_monthly_rev * 12, 2)
    est_market_size = round(est_monthly_rev * 4.8, 2)
    market_share = round((est_monthly_rev / max(1, est_market_size)) * 100, 1)

    return EstimatedSalesRevenue(
        est_monthly_units=est_monthly_units,
        est_monthly_revenue=est_monthly_rev,
        est_annual_revenue=est_annual_rev,
        est_market_size_monthly=est_market_size,
        est_market_share_potential=market_share,
        competitor_revenue_dispersion="Top 3 sellers capture 55% of niche search volume"
    )

def compute_twenty_factor_scoring(factors: Dict[str, float], net_margin: float) -> TwentyFactorScoreBreakdown:
    d_strength = factors.get("demand_strength", 86)
    b_intent = factors.get("buyer_intent", 90)
    e_opp = factors.get("etsy_opportunity", 84)
    p_margin = min(100.0, max(0.0, net_margin * 2.2))
    rev_pot = factors.get("revenue_potential", 85)
    t_momentum = factors.get("trend_momentum", 88)
    comp_density = factors.get("competition_density", 76)
    comp_gap = factors.get("competitive_gap", 88)
    p_diff = factors.get("product_differentiation", 90)
    kw_opp = factors.get("keyword_opportunity", 84)
    s_qual = factors.get("supplier_quality", 88)
    ship_log = factors.get("shipping_logistics", 88)
    pers_pot = factors.get("personalization_potential", 92)
    gift_pot = factors.get("gift_potential", 94)
    season = factors.get("seasonality_index", 85)
    bundle_pot = factors.get("bundle_upsell_potential", 86)
    rev_sent = factors.get("review_sentiment", 86)
    op_comp = factors.get("operational_complexity", 90)
    ip_comp = factors.get("ip_compliance_risk", 96)
    ret_risk = factors.get("return_defect_risk", 94)

    overall = (
        (d_strength * 0.10) + (b_intent * 0.05) + (e_opp * 0.08) + (p_margin * 0.10) +
        (rev_pot * 0.07) + (t_momentum * 0.07) + (comp_density * 0.07) + (comp_gap * 0.07) +
        (p_diff * 0.06) + (kw_opp * 0.05) + (s_qual * 0.04) + (ship_log * 0.04) +
        (pers_pot * 0.04) + (gift_pot * 0.03) + (season * 0.03) + (bundle_pot * 0.02) +
        (rev_sent * 0.02) + (op_comp * 0.02) + (ip_comp * 0.02) + (ret_risk * 0.02)
    )

    return TwentyFactorScoreBreakdown(
        demand_strength=round(d_strength, 1),
        buyer_intent=round(b_intent, 1),
        etsy_opportunity=round(e_opp, 1),
        profit_margin=round(p_margin, 1),
        revenue_potential=round(rev_pot, 1),
        trend_momentum=round(t_momentum, 1),
        competition_density=round(comp_density, 1),
        competitive_gap=round(comp_gap, 1),
        product_differentiation=round(p_diff, 1),
        keyword_opportunity=round(kw_opp, 1),
        supplier_quality=round(s_qual, 1),
        shipping_logistics=round(ship_log, 1),
        personalization_potential=round(pers_pot, 1),
        gift_potential=round(gift_pot, 1),
        seasonality_index=round(season, 1),
        bundle_upsell_potential=round(bundle_pot, 1),
        review_sentiment=round(rev_sent, 1),
        operational_complexity=round(op_comp, 1),
        ip_compliance_risk=round(ip_comp, 1),
        return_defect_risk=round(ret_risk, 1),
        overall_winning_score=round(overall, 1)
    )