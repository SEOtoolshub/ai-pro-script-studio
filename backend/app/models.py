from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class HuntRequest(BaseModel):
    keyword: str = Field(..., min_length=2, max_length=120)
    target_price_band: Optional[str] = Field("auto")
    max_pages: int = Field(1, ge=1, le=5)

class CompetitorListing(BaseModel):
    listing_id: Optional[str] = None
    title: str
    price: float
    currency: str = "USD"
    rating: float
    reviews_count: int
    shop_name: str
    is_bestseller: bool = False
    is_free_shipping: bool = False
    listing_url: str
    image_url: Optional[str] = None
    est_monthly_sales: int = 0
    est_monthly_revenue: float = 0.0

class KeywordMetrics(BaseModel):
    keyword: str
    search_demand: int
    competition: int
    buyer_intent: str
    long_tail_score: int
    trend_direction: str
    seasonality: str
    keyword_opportunity_score: float
    recommended_placement: str

class GoogleTrendsMetrics(BaseModel):
    source: str
    interest_index: int
    growth_trajectory: str
    trend_momentum_score: int
    seven_day_trend: str
    thirty_day_trend: str
    ninety_day_trend: str
    twelve_month_trend: str
    trend_classification: str
    peak_gifting_seasons: List[str]
    related_breakout_queries: List[str]
    google_trends_explore_url: str
    launch_lead_time_weeks: int

class EstimatedSalesRevenue(BaseModel):
    est_monthly_units: int
    est_monthly_revenue: float
    est_annual_revenue: float
    est_market_size_monthly: float
    est_market_share_potential: float
    competitor_revenue_dispersion: str

class CompetitorGapAnalysis(BaseModel):
    avg_photos_count: int
    video_penetration_pct: int
    gift_packaging_penetration_pct: int
    color_variations_avg: int
    competitive_gap_score: int
    actionable_gaps: List[str]
    visual_gaps: List[str]

class ReviewVoiceOfCustomer(BaseModel):
    customer_likes: List[str]
    customer_dislikes: List[str]
    repeated_complaints: List[str]
    desired_improvements: List[str]
    core_purchase_motivations: List[str]
    customer_wants_summary: str
    winning_usp_concept: str

class ProductBundleEcosystem(BaseModel):
    core_product_name: str
    core_product_price: float
    recommended_add_ons: List[Dict[str, Any]]
    recommended_bundle_name: str
    recommended_bundle_price: float
    estimated_aov: float
    bundle_gross_margin_pct: float
    cross_sell_opportunities: List[str]

class DropshipVendorQA(BaseModel):
    tier_role: str
    supplier_region: str
    platform_name: str
    vendor_name: str
    unit_cost: float
    moq: int = 1
    shipping_cost: float
    lead_time_days: str
    qa_audit_score: int
    qa_verified_badges: List[str]
    custom_branding_options: str
    fulfillment_sync_type: str
    rating: float
    risk_level: str
    direct_vendor_url: str

class LocalWebsiteCompetitor(BaseModel):
    brand_name: str
    website_url: str
    retail_price: float
    platform_type: str
    offer_hook: str
    estimated_monthly_traffic: str
    brand_strengths: List[str]
    brand_weaknesses: List[str]

class PriceLadderTier(BaseModel):
    strategy: str
    price: float
    gross_margin_pct: float
    net_margin_pct: float
    positioning: str

class LandedCostEconomics(BaseModel):
    recommended_retail_price: float
    supplier_unit_cost: float
    inbound_shipping_cost: float
    custom_packaging_cost: float
    personalization_labor_cost: float
    etsy_transaction_fee: float
    etsy_payment_fee: float
    etsy_listing_fee: float
    ad_cpa_budget: float
    return_refund_buffer: float
    total_landed_cost: float
    gross_profit: float
    gross_margin_pct: float
    net_profit_before_tax: float
    net_margin_pct: float
    breakeven_selling_price: float
    breakeven_roas: float
    max_acceptable_cpa: float
    max_acceptable_cpc: float

class TitleOptimizationSuite(BaseModel):
    seo_focused: str
    conversion_focused: str
    balanced: str

class ListingCreativePackage(BaseModel):
    title_options: TitleOptimizationSuite
    thirteen_tags: List[str]
    short_pitch: str
    full_description: str
    product_attributes: List[str]
    faq_items: List[Dict[str, str]]
    thumbnail_concept_brief: str
    ten_image_shot_list: List[str]
    video_concept_brief: str

class RiskComplianceAudit(BaseModel):
    trademark_copyright_risk: str
    product_safety_compliance: str
    etsy_policy_reseller_risk: str
    risk_score: int
    compliance_verdict: str

class TwentyFactorScoreBreakdown(BaseModel):
    demand_strength: float
    buyer_intent: float
    etsy_opportunity: float
    profit_margin: float
    revenue_potential: float
    trend_momentum: float
    competition_density: float
    competitive_gap: float
    product_differentiation: float
    keyword_opportunity: float
    supplier_quality: float
    shipping_logistics: float
    personalization_potential: float
    gift_potential: float
    seasonality_index: float
    bundle_upsell_potential: float
    review_sentiment: float
    operational_complexity: float
    ip_compliance_risk: float
    return_defect_risk: float
    overall_winning_score: float

class LaunchBusinessPlan(BaseModel):
    initial_test_quantity: int
    recommended_launch_price: float
    initial_ad_daily_budget: float
    target_cpa: float
    target_conversion_rate_pct: float
    fourteen_day_milestone_target: str
    sixty_day_scale_target: str
    monitoring_classification: str

class WinningProductOpportunity(BaseModel):
    id: str
    rank: int
    product_name: str
    niche_category: str
    micro_niche: str
    target_customer_profile: str
    overall_winning_score: float
    data_confidence_score: int
    master_verdict: str
    why_product_will_win: List[str]
    why_product_could_fail: List[str]
    scoring_breakdown: TwentyFactorScoreBreakdown
    keyword_intelligence: List[KeywordMetrics]
    google_trends: GoogleTrendsMetrics
    sales_revenue_estimates: EstimatedSalesRevenue
    competitor_gap_engine: CompetitorGapAnalysis
    review_mining_voc: ReviewVoiceOfCustomer
    differentiation_concepts: List[str]
    bundle_ecosystem: ProductBundleEcosystem
    price_ladder: List[PriceLadderTier]
    economics: LandedCostEconomics
    qa_dropship_vendors: List[DropshipVendorQA]
    local_website_competitors: List[LocalWebsiteCompetitor]
    listing_package: ListingCreativePackage
    risk_compliance: RiskComplianceAudit
    launch_plan: LaunchBusinessPlan
    top_competitors: List[CompetitorListing]

class MultiProductHunterResponse(BaseModel):
    seed_keyword: str
    market_overview: str
    total_products_discovered: int
    google_trends_summary: Dict[str, Any]
    winning_products: List[WinningProductOpportunity]
    top_winner_id: str