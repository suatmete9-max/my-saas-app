"use client";

import { useState, useEffect } from "react";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [pageId, setPageId] = useState("3c8eb4df13cc80059700f7ea0db308c2");
  const [loading, setLoading] = useState(false);
  const [notionData, setNotionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [urlCopied, setUrlCopied] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);
  const [jsonCopied, setJsonCopied] = useState(false);

  const userEmail = isSignedIn && user?.primaryEmailAddress?.emailAddress 
    ? user.primaryEmailAddress.emailAddress 
    : "suatmete9@gmail.com";

  const userInitial = userEmail.charAt(0).toUpperCase() || "B";

  const [userPlan, setUserPlan] = useState({
    name: "Free Sandbox",
    apiKey: "DEMO_KEY_sandbox_test",
    isPro: false,
    freeLeft: 3,
  });

  const pricingPlans = [
    {
      id: "1day",
      badge: "QUICK TEST",
      name: "1 Day Pass",
      price: "$1",
      duration: "Full access for 1 Day",
      features: ["Instant JSON API Key", "Unlimited Endpoints", "Edge Global Cache"],
      btnText: "BUY NOW",
      borderClass: "border-[#00bcd4]/35 shadow-[0_0_20px_rgba(0,188,212,0.15)]",
      badgeClass: "bg-[#00bcd4]/15 text-[#4dd0e1] border-[#00bcd4]/40",
      priceClass: "text-[#00e5ff] drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]",
      btnClass: "bg-[#00bcd4] hover:bg-[#26c6da] text-black shadow-[0_0_15px_rgba(0,188,212,0.4)]",
      link: "https://notion-api-engine.lemonsqueezy.com/checkout/buy/99623721-d577-47c8-b0ea-fed625e08e6f",
    },
    {
      id: "10day",
      badge: "STARTER",
      name: "10 Days Pass",
      price: "$10",
      duration: "Full access for 10 Days",
      features: ["Instant JSON API Key", "Unlimited Endpoints", "Edge Global Cache"],
      btnText: "BUY NOW",
      borderClass: "border-[#00e676]/35 shadow-[0_0_20px_rgba(0,230,118,0.15)]",
      badgeClass: "bg-[#00e676]/15 text-[#69f0ae] border-[#00e676]/40",
      priceClass: "text-[#00e676] drop-shadow-[0_0_12px_rgba(0,230,118,0.4)]",
      btnClass: "bg-[#00e676] hover:bg-[#69f0ae] text-black shadow-[0_0_15px_rgba(0,230,118,0.4)]",
      link: "https://notion-api-engine.lemonsqueezy.com/checkout/buy/2458b927-265f-4303-a5c2-1eb8cab49328",
    },
    {
      id: "monthly",
      badge: "MOST POPULAR",
      name: "Monthly Pro",
      price: "$19",
      duration: "Full access for 1 Month",
      features: ["Instant JSON API Key", "Unlimited Endpoints", "Edge Global Cache"],
      btnText: "BUY NOW",
      borderClass: "border-[#d500f9]/80 shadow-[0_0_35px_rgba(213,0,249,0.35)] scale-[1.03] z-10",
      badgeClass: "bg-[#d500f9]/25 text-[#f06292] border-[#d500f9]/60 font-bold",
      priceClass: "text-[#f50057] drop-shadow-[0_0_18px_rgba(245,0,87,0.5)]",
      btnClass: "bg-gradient-to-r from-[#d500f9] to-[#7c4dff] hover:opacity-95 text-white shadow-[0_0_20px_rgba(213,0,249,0.5)]",
      link: "https://notion-api-engine.lemonsqueezy.com/checkout/buy/7fc670da-7119-4663-ab28-4a12447f612a",
    },
    {
      id: "quarterly",
      badge: "BEST VALUE",
      name: "Quarterly Pro",
      price: "$49",
      duration: "Full access for 3 Months",
      features: ["Instant JSON API Key", "Unlimited Endpoints", "Edge Global Cache"],
      btnText: "BUY NOW",
      borderClass: "border-[#ffab00]/40 shadow-[0_0_20px_rgba(255,171,0,0.15)]",
      badgeClass: "bg-[#ffab00]/15 text-[#ffd54f] border-[#ffab00]/40",
      priceClass: "text-[#ffab00] drop-shadow-[0_0_12px_rgba(255,171,0,0.4)]",
      btnClass: "bg-[#ffab00] hover:bg-[#ffc107] text-black shadow-[0_0_15px_rgba(255,171,0,0.4)]",
      link: "https://notion-api-engine.lemonsqueezy.com/checkout/buy/a8c9588e-27ae-4505-90c8-4b9bea1fa37f",
    },
    {
      id: "yearly",
      badge: "VIP ENTERPRISE",
      name: "Yearly Pro",
      price: "$100",
      duration: "Full access for 1 Year",
      features: ["Instant JSON API Key", "Unlimited Endpoints", "Edge Global Cache"],
      btnText: "BUY NOW",
      borderClass: "border-[#ff1744]/40 shadow-[0_0_20px_rgba(255,23,68,0.15)]",
      badgeClass: "bg-[#ff1744]/15 text-[#ff8a80] border-[#ff1744]/40 font-bold",
      priceClass: "text-[#ff1744] drop-shadow-[0_0_12px_rgba(255,23,68,0.4)]",
      btnClass: "bg-[#ff1744] hover:bg-[#ff5252] text-white shadow-[0_0_15px_rgba(255,23,68,0.4)]",
      link: "https://notion-api-engine.lemonsqueezy.com/checkout/buy/46871f9e-b885-4160-9779-5976532df643",
    },
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      const generatedProKey = "LIVE_PRO_KEY_" + Math.random().toString(36).substring(2, 10).toUpperCase();
      setUserPlan({
        name: "Pro Active",
        apiKey: generatedProKey,
        isPro: true,
        freeLeft: 9999,
      });
    }
  }, []);

  const handleFetchJson = async () => {
    if (!pageId.trim()) {
      alert("Please enter a Notion Page ID!");
      return;
    }

    setLoading(true);
    setError(null);
    setNotionData(null);

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": userPlan.apiKey,
        },
        body: JSON.stringify({
          pageId: pageId.trim(),
          apiKey: userPlan.apiKey,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setNotionData(data);
      } else {
        setError(data.error || "Failed to fetch JSON response from Notion");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch API data");
    } finally {
      setLoading(false);
    }
  };

  const dynamicApiUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/convert?pageId=${pageId.trim()}&apiKey=${userPlan.apiKey}`
    : "";

  return (
    <main className="min-h-screen text-white flex flex-col items-center justify-between px-4 py-8 sm:px-12 bg-[#070110] relative overflow-hidden font-sans">
      
      {/* Exact Aurora background atmosphere matching Screenshot 1164 */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,30,190,0.3),rgba(255,255,255,0))] pointer-events-none -z-20"></div>
      <div className="fixed top-12 left-1/4 w-[500px] h-[350px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed top-1/3 right-1/4 w-[500px] h-[400px] bg-purple-700/20 rounded-full blur-[160px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-10 left-1/3 w-[600px] h-[350px] bg-rose-700/10 rounded-full blur-[160px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-5xl space-y-8 z-10 mx-auto my-auto">
        
        {/* HERO TITLE */}
        <div className="text-center space-y-2 pt-2">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-[#40c4ff] via-[#b388ff] to-[#ff80ab] bg-clip-text text-transparent">
            Notion to Live JSON API Engine
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-medium">
            Convert Notion databases into ultra-low latency JSON endpoints instantly.
          </p>
        </div>

        {/* AUTH BOX */}
        <div className="max-w-xl mx-auto bg-[#10081d]/90 border border-purple-900/40 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Authenticated Account:</p>
              <p className="text-xs font-semibold text-blue-400">{userEmail}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="px-3.5 py-1 text-[11px] font-bold rounded-full bg-[#ffab00]/15 text-[#ffd54f] border border-[#ffab00]/30">
                {userPlan.name}
              </span>
              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <div className="w-7 h-7 rounded-full bg-[#00bcd4] text-black font-extrabold flex items-center justify-center text-xs shadow-md cursor-pointer hover:opacity-90">
                    {userInitial}
                  </div>
                </SignInButton>
              ) : (
                <SignOutButton>
                  <div className="w-7 h-7 rounded-full bg-[#00bcd4] text-black font-extrabold flex items-center justify-center text-xs shadow-md cursor-pointer hover:opacity-90" title="Click to Sign Out">
                    {userInitial}
                  </div>
                </SignOutButton>
              )}
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              <span>YOUR ASSIGNED API KEY:</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(userPlan.apiKey);
                  setKeyCopied(true);
                  setTimeout(() => setKeyCopied(false), 2000);
                }}
                className="hover:text-white transition lowercase font-medium tracking-normal text-xs"
              >
                {keyCopied ? "copied!" : "Copy"}
              </button>
            </div>
            <input
              type="text"
              readOnly
              value={userPlan.apiKey}
              className="w-full bg-[#08020e] border border-purple-900/40 rounded-lg px-3 py-2 text-xs font-mono text-[#00e676] focus:outline-none"
            />
          </div>
        </div>

        {/* DEMO NOTION API REQUEST */}
        <div className="max-w-4xl mx-auto bg-[#10081d]/90 border border-purple-900/40 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-[#ffc107] flex items-center gap-1.5">
              🟡 Demo Notion API Request
            </h2>
            <span className="text-[11px] text-gray-400">
              Testing Sandbox ({userPlan.freeLeft} free left)
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={pageId}
              onChange={(e) => setPageId(e.target.value)}
              placeholder="3c8eb4df13cc80059700f7ea0db308c2"
              className="w-full bg-[#08020e] border border-purple-900/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleFetchJson}
              disabled={loading}
              className="px-7 py-2.5 bg-[#1976d2] hover:bg-[#1565c0] text-white font-bold rounded-xl text-xs whitespace-nowrap transition disabled:opacity-50 shadow-md"
            >
              {loading ? "Fetching..." : "Fetch JSON"}
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              YOUR DYNAMIC API ENDPOINT URL:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={dynamicApiUrl}
                className="w-full bg-[#08020e] border border-purple-900/50 rounded-xl px-3 py-2 text-xs font-mono text-[#40c4ff] focus:outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(dynamicApiUrl);
                  setUrlCopied(true);
                  setTimeout(() => setUrlCopied(false), 2000);
                }}
                className="px-4 py-2 bg-[#1b0e30] hover:bg-[#251342] border border-purple-800/40 text-xs font-semibold rounded-xl whitespace-nowrap transition"
              >
                {urlCopied ? "Copied! ✅" : "Copy URL"}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/60 border border-red-600/70 text-red-200 text-xs rounded-xl">
              {error}
            </div>
          )}

          {notionData && (
            <div className="bg-[#08020e] border border-[#00e676]/40 rounded-xl p-4 space-y-2 mt-2">
              <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                <span className="text-[11px] font-mono text-[#00e676] font-bold">RESPONSE DATA (JSON)</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(notionData, null, 2));
                    setJsonCopied(true);
                    setTimeout(() => setJsonCopied(false), 2000);
                  }}
                  className="text-xs px-2.5 py-1 bg-[#00e676]/10 border border-[#00e676] text-[#00e676] rounded font-mono hover:bg-[#00e676]/20 transition"
                >
                  {jsonCopied ? "Copied! ✅" : "📋 Copy JSON"}
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <pre className="text-xs font-mono text-[#00e676]">{JSON.stringify(notionData, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        {/* PRICING HEADER */}
        <div className="text-center space-y-1 pt-6">
          <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#40c4ff] via-[#b388ff] to-[#ff80ab] bg-clip-text text-transparent">
            Select Your Pro Access Plan
          </h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
            INSTANT ACTIVATION • HIGH PERFORMANCE LIVE ENDPOINTS • SECURE CHECKOUT
          </p>
        </div>

        {/* 5 PRICING PLANS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch pb-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-[#10081d]/90 border ${plan.borderClass} rounded-2xl p-5 flex flex-col justify-between text-center backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="space-y-3">
                <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${plan.badgeClass}`}>
                  {plan.badge}
                </span>

                <h3 className="text-sm font-bold text-gray-200">{plan.name}</h3>

                <div>
                  <p className={`text-4xl font-black ${plan.priceClass}`}>{plan.price}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{plan.duration}</p>
                </div>

                <div className="h-px bg-white/10 w-full my-2"></div>

                <ul className="text-[11px] text-gray-300 space-y-1.5 text-left pl-1">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-[#00e676] font-bold">✓</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={plan.link}
                target="_blank"
                rel="noreferrer"
                className={`mt-6 w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider block transition ${plan.btnClass}`}
              >
                {plan.btnText}
              </a>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <footer className="text-center text-[11px] text-gray-500 pt-2 pb-4 space-y-1">
          <div className="flex justify-center gap-4 text-gray-400 text-[11px]">
            <a href="#" className="hover:underline">Terms of Service & Refund Policy</a>
            <span>•</span>
            <a href="mailto:developerappwebsite@gmail.com" className="hover:underline">Developer Support</a>
          </div>
          <p>© 2026 NotionEngine Inc. Built for technical teams and SaaS founders.</p>
        </footer>

      </div>
    </main>
  );
}