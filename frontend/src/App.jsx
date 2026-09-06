import React, { useState } from 'react';
import {
  Compass, Search, Sparkles, Tag, Package, AlertTriangle, CheckCircle2,
  TrendingUp, ShieldCheck, DollarSign, Layers, ExternalLink, Loader2,
  BarChart3, Users, Target, Activity, Lightbulb, Award, ArrowUpDown,
  ChevronRight, Truck, Globe, Zap, Box, Store, CheckCircle, LineChart
} from 'lucide-react';
import { huntProductMaster } from './services/api';

export default function App() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [activeTab, setActiveTab] = useState('portfolio');

  // Simulator State
  const [calcRetail, setCalcRetail] = useState(34.00);
  const [calcUnitCost, setCalcUnitCost] = useState(5.80);
  const [calcShipping, setCalcShipping] = useState(3.40);
  const [calcAdCpa, setCalcAdCpa] = useState(4.50);
  const [calcOrdersPerDay, setCalcOrdersPerDay] = useState(10);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await huntProductMaster(keyword.trim());
      setResponse(data);
      if (data.winning_products && data.winning_products.length > 0) {
        const topProd = data.winning_products[0];
        setSelectedProductId(topProd.id);
        setCalcRetail(topProd.economics.recommended_retail_price);
        setCalcUnitCost(topProd.economics.supplier_unit_cost);
        setCalcShipping(topProd.economics.inbound_shipping_cost);
        setCalcAdCpa(topProd.economics.ad_cpa_budget);
      }
      setActiveTab('portfolio');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = response?.winning_products?.find(p => p.id === selectedProductId) || response?.winning_products?.[0];

  const handleInspectProduct = (prod) => {
    setSelectedProductId(prod.id);
    setCalcRetail(prod.economics.recommended_retail_price);
    setCalcUnitCost(prod.economics.supplier_unit_cost);
    setCalcShipping(prod.economics.inbound_shipping_cost);
    setCalcAdCpa(prod.economics.ad_cpa_budget);
    setActiveTab('vendors');
  };

  // Simulator Calculations
  const calculatedPlatformFees = (calcRetail * 0.095) + 0.45;
  const calculatedTotalLanded = calcUnitCost + calcShipping + 2.50 + calcAdCpa + calculatedPlatformFees;
  const calculatedNetProfit = calcRetail - calculatedTotalLanded;
  const calculatedNetMargin = calcRetail > 0 ? ((calculatedNetProfit / calcRetail) * 100).toFixed(1) : 0;
  const dailyProfit = (calculatedNetProfit * calcOrdersPerDay).toFixed(2);
  const monthlyProfit = (calculatedNetProfit * calcOrdersPerDay * 30).toFixed(2);
  const monthlyRevenue = (calcRetail * calcOrdersPerDay * 30).toFixed(2);
  const breakevenRoas = calcAdCpa > 0 ? (calcRetail / calcAdCpa).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <Compass className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">Etsy Winning Product Intelligence Engine</h1>
                <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                  Google Trends + QA Dropship Vendors
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Google Trends Volume • Exact Product Dropshippers • Shopify DTC Competitor Scraping</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Enter seed keyword (e.g. leather, wedding, acrylic)..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Mining Intelligence...' : 'Execute Intelligence'}
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {error && (
          <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!response && !loading && (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
            <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">Discover 5-8 Winning Products with Google Trends & Verified Dropshippers</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Enter any niche to audit <strong>Google Trends Search Velocity</strong>, find <strong>Exact Product Dropshipping Vendors (MOQ=1)</strong>, and analyze <strong>Shopify DTC Brand Competitors</strong>.
            </p>
          </div>
        )}

        {response && selectedProduct && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Live Market Discovery</span>
                  <span className="text-xs text-indigo-300 font-mono">• Google Trends Momentum: {response.google_trends_summary?.interest_index || 85}/100</span>
                </div>
                <h2 className="text-lg font-bold text-white capitalize">{response.seed_keyword} Portfolio ({response.total_products_discovered} Products Discovered)</h2>
                <p className="text-xs text-slate-400 mt-0.5">{response.market_overview}</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400">Inspecting Candidate:</span>
                <span className="text-xs font-bold text-emerald-400">#{selectedProduct.rank} {selectedProduct.product_name}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-3">
              {[
                { id: 'portfolio', label: `🏆 Dropship Portfolio (${response.winning_products.length})` },
                { id: 'trends', label: '📈 Google Trends & Volume' },
                { id: 'vendors', label: `🚚 Exact Dropshipping Vendors (${selectedProduct.qa_dropship_vendors.length})` },
                { id: 'dtc', label: `🏬 DTC Website Competitors (${selectedProduct.local_website_competitors.length})` },
                { id: 'executive', label: '📋 Winner Dossier' },
                { id: 'scoring', label: '📊 20-Factor Scoring' },
                { id: 'gaps', label: '🎯 Competitor Gaps' },
                { id: 'voc', label: '💬 Voice of Customer' },
                { id: 'pricing', label: '💰 Price Ladder & Margins' },
                { id: 'listing', label: '✍️ SEO & Listing' },
                { id: 'simulator', label: '🧮 Profit Simulator' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeTab === t.id ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {activeTab === 'portfolio' && (
              <div className="space-y-4">
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/90 uppercase text-[10px] text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Rank</th>
                        <th className="p-3.5">Exact Winning Product</th>
                        <th className="p-3.5">Target Retail</th>
                        <th className="p-3.5">Dropship Cost</th>
                        <th className="p-3.5">Net Profit</th>
                        <th className="p-3.5">Net Margin</th>
                        <th className="p-3.5">Winner Score</th>
                        <th className="p-3.5">Google Trends</th>
                        <th className="p-3.5">Decision</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {response.winning_products.map((prod) => (
                        <tr
                          key={prod.id}
                          className={`hover:bg-slate-800/50 transition cursor-pointer ${selectedProductId === prod.id ? 'bg-slate-800/60 border-l-2 border-emerald-400' : ''}`}
                          onClick={() => handleInspectProduct(prod)}
                        >
                          <td className="p-3.5 font-bold">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                              prod.rank === 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                              prod.rank <= 3 ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              #{prod.rank}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-100">{prod.product_name}</div>
                            <div className="text-[11px] text-slate-400">{prod.niche_category} • {prod.micro_niche}</div>
                          </td>
                          <td className="p-3.5 font-bold text-slate-100">${prod.economics.recommended_retail_price.toFixed(2)}</td>
                          <td className="p-3.5 text-slate-400 font-mono">${(prod.economics.supplier_unit_cost + prod.economics.inbound_shipping_cost).toFixed(2)}</td>
                          <td className="p-3.5 font-bold text-emerald-400 font-mono">${prod.economics.net_profit_before_tax.toFixed(2)}</td>
                          <td className="p-3.5 font-semibold text-emerald-300">{prod.economics.net_margin_pct}%</td>
                          <td className="p-3.5">
                            <span className="font-black text-slate-100">{prod.overall_winning_score}</span>
                            <span className="text-[10px] text-slate-500">/100</span>
                          </td>
                          <td className="p-3.5 font-semibold text-indigo-300">{prod.google_trends.trend_classification}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-700/60">
                              {prod.master_verdict.split('—')[0]}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInspectProduct(prod);
                              }}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-slate-200 rounded text-[11px] font-semibold transition inline-flex items-center gap-1"
                            >
                              Inspect Vendors <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'trends' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-xs text-slate-400 uppercase font-medium">Google Interest Index</span>
                    <div className="text-3xl font-black text-emerald-400">{selectedProduct.google_trends.interest_index}/100</div>
                    <span className="text-xs text-slate-300">{selectedProduct.google_trends.growth_trajectory}</span>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-xs text-slate-400 uppercase font-medium">30-Day Trend Velocity</span>
                    <div className="text-3xl font-black text-indigo-400">{selectedProduct.google_trends.thirty_day_trend}</div>
                    <span className="text-xs text-slate-400">7-Day: {selectedProduct.google_trends.seven_day_trend}</span>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-xs text-slate-400 uppercase font-medium">12-Month Search Growth</span>
                    <div className="text-3xl font-black text-emerald-400">{selectedProduct.google_trends.twelve_month_trend}</div>
                    <span className="text-xs text-slate-400">90-Day: {selectedProduct.google_trends.ninety_day_trend}</span>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-xs text-slate-400 uppercase font-medium">Verification Engine</span>
                    <div className="text-sm font-bold text-white truncate">{selectedProduct.google_trends.source}</div>
                    <a
                      href={selectedProduct.google_trends.google_trends_explore_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1 mt-1"
                    >
                      Open Google Trends Page <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase">Google Autocomplete Breakout Queries for this Product</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.google_trends.related_breakout_queries.map((query, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-950 text-slate-200 border border-slate-800 rounded-lg text-xs font-mono">
                        🔎 {query}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vendors' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-400" />
                      Exact Dropshipping Vendors for: {selectedProduct.product_name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Verified <strong>MOQ = 1 Unit</strong>, Blind Dropshipping, and live direct deep search catalog links.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Blind Shipping QA
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProduct.qa_dropship_vendors.map((vendor, i) => (
                    <div key={i} className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            vendor.supplier_region.includes('Local')
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                              : 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60'
                          }`}>
                            {vendor.tier_role} • {vendor.supplier_region}
                          </span>
                          <h4 className="text-base font-bold text-slate-100 mt-2">{vendor.vendor_name}</h4>
                          <span className="text-xs text-slate-400">Platform: <strong className="text-slate-200">{vendor.platform_name}</strong></span>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] uppercase font-bold text-slate-400">QA Audit Score</div>
                          <div className="text-lg font-black text-emerald-400">{vendor.qa_audit_score}/100</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-slate-950 rounded-lg border border-slate-800">
                        <div>Dropship Unit Cost: <span className="text-slate-200 font-mono font-bold">${vendor.unit_cost.toFixed(2)}</span></div>
                        <div>Shipping to US/EU: <span className="text-slate-200 font-mono font-bold">${vendor.shipping_cost.toFixed(2)}</span></div>
                        <div>Delivery Lead Time: <span className="text-emerald-300 font-semibold">{vendor.lead_time_days}</span></div>
                        <div>MOQ: <span className="text-slate-200 font-mono">{vendor.moq} Unit (Dropship)</span></div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">QA Verified Checklist:</span>
                        <div className="flex flex-wrap gap-1">
                          {vendor.qa_verified_badges.map((badge, bIdx) => (
                            <span key={bIdx} className="px-2 py-0.5 bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 rounded text-[10px] flex items-center gap-1 font-medium">
                              <CheckCircle className="w-2.5 h-2.5 text-emerald-400" /> {badge}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-slate-400 pt-1">
                        <div><strong className="text-slate-300">Custom Branding:</strong> {vendor.custom_branding_options}</div>
                        <div><strong className="text-slate-300">Sync Pipeline:</strong> {vendor.fulfillment_sync_type}</div>
                      </div>

                      <a
                        href={vendor.direct_vendor_url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-slate-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        Search Exact Item on {vendor.platform_name} <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'dtc' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Store className="w-4 h-4 text-indigo-400" />
                      Shopify & Independent DTC Store Competitors (Outside Etsy)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Independent direct-to-consumer e-commerce brands selling this exact product via Google Search, Meta, and TikTok Ads.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-lg text-xs font-bold">
                    DTC Store Scraping
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProduct.local_website_competitors.map((comp, i) => (
                    <div key={i} className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded text-[10px] font-bold uppercase">
                            {comp.platform_type}
                          </span>
                          <h4 className="text-base font-bold text-slate-100 mt-2">{comp.brand_name}</h4>
                          <span className="text-xs text-slate-400">Est. Traffic: <strong className="text-slate-200">{comp.estimated_monthly_traffic}</strong></span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Retail Price</span>
                          <span className="text-xl font-black text-white font-mono">${comp.retail_price.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                        <span className="text-slate-400 font-bold block mb-0.5">Marketing Hook:</span>
                        <p className="text-emerald-300 font-semibold italic">"{comp.offer_hook}"</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                          <span className="text-indigo-400 font-bold block mb-1">Brand Strengths:</span>
                          <ul className="space-y-1 text-slate-300 list-disc list-inside">
                            {comp.brand_strengths.map((s, sIdx) => (
                              <li key={sIdx}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                          <span className="text-rose-400 font-bold block mb-1">Weaknesses to Exploit:</span>
                          <ul className="space-y-1 text-slate-300 list-disc list-inside">
                            {comp.brand_weaknesses.map((w, wIdx) => (
                              <li key={wIdx}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <a
                        href={comp.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        Search Store on Google <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'executive' && (
              <div className="space-y-6">
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-xs font-bold uppercase">
                      RANK #{selectedProduct.rank} WINNER DOSSIER
                    </span>
                    <h2 className="text-xl font-bold text-white mt-1">{selectedProduct.product_name}</h2>
                    <p className="text-xs text-slate-400">{selectedProduct.target_customer_profile}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Score</span>
                    <div className="text-2xl font-black text-emerald-400">{selectedProduct.overall_winning_score}/100</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      Why This Product Will Win
                    </div>
                    <ul className="text-xs text-slate-300 space-y-2">
                      {selectedProduct.why_product_will_win.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      Fulfillment Risk Mitigation
                    </div>
                    <ul className="text-xs text-slate-300 space-y-2">
                      {selectedProduct.why_product_could_fail.map((risk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'scoring' && (
              <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">20-Factor Model: {selectedProduct.product_name}</h3>
                  <span className="text-xs font-mono text-emerald-400 font-bold">{selectedProduct.scoring_breakdown.overall_winning_score}/100</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {[
                    { label: 'Demand Strength (10%)', score: selectedProduct.scoring_breakdown.demand_strength },
                    { label: 'Buyer Intent (5%)', score: selectedProduct.scoring_breakdown.buyer_intent },
                    { label: 'Etsy Opportunity (8%)', score: selectedProduct.scoring_breakdown.etsy_opportunity },
                    { label: 'Profit Margin (10%)', score: selectedProduct.scoring_breakdown.profit_margin },
                    { label: 'Revenue Potential (7%)', score: selectedProduct.scoring_breakdown.revenue_potential },
                    { label: 'Trend Momentum (7%)', score: selectedProduct.scoring_breakdown.trend_momentum },
                    { label: 'Competition Density (7%)', score: selectedProduct.scoring_breakdown.competition_density },
                    { label: 'Competitive Gap (7%)', score: selectedProduct.scoring_breakdown.competitive_gap },
                    { label: 'Product Differentiation (6%)', score: selectedProduct.scoring_breakdown.product_differentiation },
                    { label: 'Keyword Opportunity (5%)', score: selectedProduct.scoring_breakdown.keyword_opportunity },
                    { label: 'Supplier Quality (4%)', score: selectedProduct.scoring_breakdown.supplier_quality },
                    { label: 'Shipping & Logistics (4%)', score: selectedProduct.scoring_breakdown.shipping_logistics },
                    { label: 'Personalization Potential (4%)', score: selectedProduct.scoring_breakdown.personalization_potential },
                    { label: 'Gift Potential (3%)', score: selectedProduct.scoring_breakdown.gift_potential },
                    { label: 'Seasonality Index (3%)', score: selectedProduct.scoring_breakdown.seasonality_index },
                    { label: 'Bundle/Upsell Potential (2%)', score: selectedProduct.scoring_breakdown.bundle_upsell_potential },
                    { label: 'Review Sentiment (2%)', score: selectedProduct.scoring_breakdown.review_sentiment },
                    { label: 'Operational Simplicity (2%)', score: selectedProduct.scoring_breakdown.operational_complexity },
                    { label: 'IP / Compliance Safety (2%)', score: selectedProduct.scoring_breakdown.ip_compliance_risk },
                    { label: 'Low Defect/Return Risk (2%)', score: selectedProduct.scoring_breakdown.return_defect_risk }
                  ].map((item, i) => (
                    <div key={i} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-400">{item.score}</span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400" style={{ width: `${item.score}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'gaps' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
                    <span className="text-xs text-slate-400">Avg Photos</span>
                    <div className="text-2xl font-black text-white mt-1">{selectedProduct.competitor_gap_engine.avg_photos_count} / 10</div>
                  </div>
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
                    <span className="text-xs text-slate-400">Video Usage</span>
                    <div className="text-2xl font-black text-white mt-1">{selectedProduct.competitor_gap_engine.video_penetration_pct}%</div>
                  </div>
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
                    <span className="text-xs text-slate-400">Gift Packaging Offered</span>
                    <div className="text-2xl font-black text-white mt-1">{selectedProduct.competitor_gap_engine.gift_packaging_penetration_pct}%</div>
                  </div>
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
                    <span className="text-xs text-slate-400">Competitive Gap Score</span>
                    <div className="text-2xl font-black text-emerald-400 mt-1">{selectedProduct.competitor_gap_engine.competitive_gap_score}/100</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase">Actionable Product Gaps</h4>
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                      {selectedProduct.competitor_gap_engine.actionable_gaps.map((gap, i) => (
                        <li key={i}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-indigo-400 uppercase">Creative Visual Gaps</h4>
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                      {selectedProduct.competitor_gap_engine.visual_gaps.map((gap, i) => (
                        <li key={i}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'voc' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase">Customer Likes</h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    {selectedProduct.review_mining_voc.customer_likes.map((like, i) => (
                      <li key={i}>{like}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-rose-400 uppercase">Repeated Complaints</h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    {selectedProduct.review_mining_voc.repeated_complaints.map((comp, i) => (
                      <li key={i}>{comp}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase">Winning USP Statement</h4>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-emerald-300 font-semibold">
                    "{selectedProduct.review_mining_voc.winning_usp_concept}"
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {selectedProduct.price_ladder.map((ladder, i) => (
                    <div key={i} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase">{ladder.strategy}</span>
                      <div className="text-2xl font-black text-white">${ladder.price.toFixed(2)}</div>
                      <div className="text-xs text-emerald-400 font-semibold">Net Margin: {ladder.net_margin_pct}%</div>
                      <p className="text-[11px] text-slate-400">{ladder.positioning}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase">Dropship Bundle Add-Ons</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedProduct.bundle_ecosystem.recommended_add_ons.map((addon, i) => (
                      <div key={i} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs flex justify-between">
                        <span className="text-slate-200">{addon.name}</span>
                        <span className="font-bold text-emerald-400">+${addon.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'listing' && (
              <div className="space-y-6">
                <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase">Ready-to-Use Optimized Title</h4>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300">
                    {selectedProduct.listing_package.title_options.balanced}
                  </div>
                </div>

                <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase">13 High-Traffic Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.listing_package.thirteen_tags.map((t, i) => (
                      <span key={i} className="px-2.5 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded text-xs font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'simulator' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/40 p-6 rounded-xl border border-slate-800">
                <div className="lg:col-span-6 space-y-4">
                  <h3 className="text-xs uppercase font-bold text-slate-400">Launch Financial Simulator: {selectedProduct.product_name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-slate-300 block mb-1">Selling Price ($)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={calcRetail}
                        onChange={(e) => setCalcRetail(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1">Dropship Unit Cost ($)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={calcUnitCost}
                        onChange={(e) => setCalcUnitCost(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1">Dropship Shipping Fee ($)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={calcShipping}
                        onChange={(e) => setCalcShipping(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1">Ad CPA Target ($)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={calcAdCpa}
                        onChange={(e) => setCalcAdCpa(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Daily Order Target ({calcOrdersPerDay} orders/day)</label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={calcOrdersPerDay}
                      onChange={(e) => setCalcOrdersPerDay(Number(e.target.value))}
                      className="w-full accent-emerald-400"
                    />
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Total Landed Cost per Order:</span>
                      <span className="font-mono text-slate-200">${calculatedTotalLanded.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Net Profit per Order:</span>
                      <span className="font-mono text-emerald-400 font-bold">${calculatedNetProfit.toFixed(2)} ({calculatedNetMargin}%)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Breakeven ROAS:</span>
                      <span className="font-mono text-indigo-400 font-bold">{breakevenRoas}x</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Monthly Projected Revenue:</span>
                      <span className="font-mono text-white font-bold">${monthlyRevenue}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Monthly Projected Net Profit:</span>
                      <span className="font-mono text-emerald-400 font-bold text-sm">${monthlyProfit}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-xs text-slate-400">
                    Recommended Milestone: <span className="text-emerald-300 font-semibold">{selectedProduct.launch_plan.fourteen_day_milestone_target}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}