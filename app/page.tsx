"use client";

import { useState, useEffect } from "react";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

interface UserPlan {
  name: string;
  price: string;
  expiresAt: string;
  apiKey: string;
  isPro: boolean;
}

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const isLoggedIn = Boolean(isSignedIn);
  const email = user?.primaryEmailAddress?.emailAddress || "";

  const [pageId, setPageId] = useState("3c8eb4df13cc80059700f7ea0db308c2");
  const [loading, setLoading] = useState(false);
  const [notionData, setNotionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [urlCopied, setUrlCopied] = useState(false);
  const [jsonCopied, setJsonCopied] = useState(false);
  const [snippetCopied, setSnippetCopied] = useState(false);
  const [selectedSnippetTab, setSelectedSnippetTab] = useState<"curl" | "javascript" | "python">("curl");

  const [fetchCount, setFetchCount] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  const [userPlan, setUserPlan] = useState<UserPlan>({
    name: "Free Demo Plan",
    price: "$0",
    expiresAt: "Lifetime (Limited)",
    apiKey: "DEMO_KEY_xyz123_test_only",
    isPro: false,
  });

  const pricingPlans = [
    { 
      id: "1day", 
      name: "1 Day Pass", 
      price: "$1", 
      duration: "1 Day", 
      days: 1, 
      tag: "QUICK TEST",
      bgClass: "bg-gradient-to-b from-cyan-950/70 via-slate-900/90 to-black/90 border-cyan-500/50 shadow-cyan-900/40 hover:border-cyan-400 hover:shadow-cyan-500/30",
      btnClass: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold shadow-cyan-500/40",
      priceClass: "text-cyan-400",
      badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      link: "https://notion-api-engine.lemonsqueezy.com/checkout/buy/99623721-d577-47c8-b0ea-fed625e08e6f" 
    },
    { 
      id: "10day", 
      name: "10 Days Pass", 
      price: "$10", 
      duration: "10 Days", 
      days: 10, 
      tag: "STARTER",
      bgClass: "bg-gradient-to-b from-emerald-950/70 via-slate-900/90 to-black/90 border-emerald-500/50 shadow-emerald-900/40 hover:border-emerald-400 hover:shadow-emerald-500/30",
      btnClass: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-extrabold shadow-emerald-500/40",
      priceClass: "text-emerald-400",
      badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      link: "https://notion-api-engine.lemonsqueezy.com/checkout/buy/2458b927-265f-4303-a5c2-1eb8cab49328" 
    },
    { 
      id: "monthly", 
      name: "Monthly Pro", 
      price: "$19", 
      duration: "1 Month", 
      days: 30, 
      tag: "MOST POPULAR",
      bgClass: "bg-gradient-to-b from-purple-950/90 via-indigo-950/80 to-black/95 border-purple-400/80 shadow-purple-900/60 ring-2 ring-purple-500/40 hover:border-purple-300 hover:shadow-purple-500/50 scale-105 z-10",
      btnClass: "bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 hover:from-purple-400 hover:to-pink-500 text-white font-extrabold shadow-purple-500/50 animate-pulse",
      priceClass: "text-purple-300 drop-shadow-[0_0_15px_rgba(216,180,254,0.6)]",
      badgeClass: "bg-purple-500/30 text-purple-200 border-purple-400 font-black",
      link: "https://notion-api-engine.lemonsqueezy.com/checkout/buy/7fc670da-7119-4663-ab28-4a12447f612a" 
    },
    { 
      id: "quarterly", 
      name: "Quarterly Pro", 
      price: "$49", 
      duration: "3 Months", 
      days: 90, 
      tag: "BEST VALUE",
      bgClass: "bg-gradient-to-b from-amber-950/70 via-orange-950/60 to-black/90 border-amber-500/50 shadow-amber-900/40 hover:border-amber-400 hover:shadow-amber-500/30",
      btnClass: "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold shadow-amber-500/40",
      priceClass: "text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]",
      badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      link: "https://notion-api-engine.lemonsqueezy.com/checkout/buy/a8c9588e-27ae-4505-90c8-4b9bea1fa37f" 
    },
    { 
      id: "yearly", 
      name: "Yearly Pro", 
      price: "$100", 
      duration: "1 Year", 
      days: 365, 
      tag: "VIP ENTERPRISE",
      bgClass: "bg-gradient-to-b from-rose-950/80 via-red-950/70 to-black/95 border-rose-500/60 shadow-rose-950/50 hover:border-rose-400 hover:shadow-rose-500/40 ring-1 ring-rose-500/30",
      btnClass: "bg-gradient-to-r from-rose-500 via-red-600 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-black shadow-rose-500/50",
      priceClass: "text-rose-400 drop-shadow-[0_0_15px_rgba(251,113,133,0.6)]",
      badgeClass: "bg-rose-500/25 text-rose-300 border-rose-500/50 font-black",
      link: "https://notion-api-engine.lemonsqueezy.com/checkout/buy/46871f9e-b885-4160-9779-5976532df643" 
    },
  ];

  useEffect(() => {
    const savedPlan = localStorage.getItem("user_plan");
    if (savedPlan) {
      setUserPlan(JSON.parse(savedPlan));
    }

    const query = new URLSearchParams(window.location.search);
    const paymentStatus = query.get("payment");
    const planId = query.get("plan");

    if (paymentStatus === "success" && planId) {
      const selectedPlan = pricingPlans.find((p) => p.id === planId) || pricingPlans[2];
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + selectedPlan.days);
      const liveKey = "LIVE_PRO_KEY_" + Math.random().toString(36).substring(2, 12).toUpperCase();

      const updatedPlan = {
        name: `${selectedPlan.name} (Active)`,
        price: selectedPlan.price,
        expiresAt: expiryDate.toDateString(),
        apiKey: liveKey,
        isPro: true,
      };
      setUserPlan(updatedPlan);
      localStorage.setItem("user_plan", JSON.stringify(updatedPlan));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleFetchNotion = async () => {
    if (!pageId.trim()) return alert("Please enter a Notion Page ID!");

    if (!userPlan.isPro && fetchCount >= 2) {
      setShowShareModal(true);
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
          "x-api-key": userPlan.apiKey 
        },
        body: JSON.stringify({ 
          pageId: pageId.trim(),
          apiKey: userPlan.apiKey
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotionData(data);
        if (!userPlan.isPro) {
          setFetchCount((prev) => prev + 1);
        }
      } else {
        setError(data.error || "Failed to fetch Notion data");
      }
    } catch (err: any) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShareOnSocial = () => {
    const text = encodeURIComponent("Just converted my Notion database into a high-speed live JSON API instantly using this tool! Check it out:");
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");

    setShowShareModal(false);
    setFetchCount(0);
    alert("?? Thank you for sharing! Your free limit has been unlocked.");
  };

  const generatedApiUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/api/convert?pageId=${pageId.trim()}&apiKey=${userPlan.apiKey}`
    : "";

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(generatedApiUrl);
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
  };

  const handleCopyJson = () => {
    if (!notionData) return;
    navigator.clipboard.writeText(JSON.stringify(notionData, null, 2));
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2000);
  };

  const snippetCodes = {
    curl: `curl -X GET "${generatedApiUrl}" \\\n  -H "x-api-key: ${userPlan.apiKey}"`,
    javascript: `// JavaScript (Fetch / Node.js)\nconst response = await fetch("${generatedApiUrl}", {\n  headers: {\n    "x-api-key": "${userPlan.apiKey}"\n  }\n});\nconst data = await response.json();\nconsole.log(data);`,
    python: `# Python (requests)\nimport requests\n\nurl = "${generatedApiUrl}"\nheaders = {"x-api-key": "${userPlan.apiKey}"}\n\nresponse = requests.get(url, headers=headers)\ndata = response.json()\nprint(data)`
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(snippetCodes[selectedSnippetTab]);
    setSnippetCopied(true);
    setTimeout(() => setSnippetCopied(false), 2000);
  };

  const handleBuyPlan = (plan: typeof pricingPlans[0]) => {
    if (!isLoggedIn) {
      alert("Please sign in first before purchasing!");
      return;
    }
    const redirectUrl = `${window.location.origin}?payment=success&plan=${plan.id}`;
    window.location.href = `${plan.link}?redirect_url=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <main className="min-h-screen text-white p-6 flex flex-col items-center justify-between relative overflow-hidden">
      
      <style jsx global>{`
        @keyframes geminiDeepFlow {
          0% { background-position: 0% 50%; }
          25% { background-position: 50% 100%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 0%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(60px, 40px) scale(1.15); }
        }

        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0px, 0px) scale(1.1); }
          50% { transform: translate(-50px, -60px) scale(0.95); }
        }

        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(40px, -50px) scale(1.2); }
        }

        .gemini-aurora-bg {
          background: linear-gradient(
            -45deg, 
            #0b0d17, 
            #1e1b4b, 
            #31104b, 
            #3b0764, 
            #064e3b, 
            #172554, 
            #450a0a, 
            #030712
          );
          background-size: 400% 400%;
          animation: geminiDeepFlow 16s ease-in-out infinite;
        }

        .ambient-orb-1 {
          animation: orbFloat1 9s ease-in-out infinite;
        }
        .ambient-orb-2 {
          animation: orbFloat2 11s ease-in-out infinite;
        }
        .ambient-orb-3 {
          animation: orbFloat3 13s ease-in-out infinite;
        }

        .grid-matrix {
          background-image: radial-gradient(rgba(255, 255, 255, 0.09) 1px, transparent 1px);
          background-size: 26px 26px;
        }
      `}</style>

      <div className="fixed inset-0 gemini-aurora-bg -z-30 pointer-events-none"></div>
      <div className="fixed inset-0 grid-matrix -z-20 pointer-events-none opacity-40"></div>

      <div className="fixed top-10 left-10 w-[420px] h-[420px] bg-gradient-to-br from-blue-600/35 via-indigo-500/25 to-transparent rounded-full blur-[130px] pointer-events-none -z-10 ambient-orb-1"></div>
      <div className="fixed top-1/3 right-10 w-[450px] h-[450px] bg-gradient-to-tr from-pink-600/30 via-purple-600/25 to-transparent rounded-full blur-[140px] pointer-events-none -z-10 ambient-orb-2"></div>
      <div className="fixed bottom-10 left-1/3 w-[500px] h-[500px] bg-gradient-to-r from-emerald-600/25 via-amber-500/20 to-teal-500/25 rounded-full blur-[150px] pointer-events-none -z-10 ambient-orb-3"></div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-900/95 border border-gray-700 p-6 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl backdrop-blur-md">
            <h3 className="text-2xl font-extrabold text-yellow-400">? Unlock Free Requests!</h3>
            <p className="text-gray-300 text-sm">
              You have reached your free demo limit. Share this tool on X (Twitter) to unlock more free requests instantly, or upgrade to Pro for unlimited access.
            </p>
            <div className="space-y-2 pt-2">
              <button
                onClick={handleShareOnSocial}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl transition text-sm flex items-center justify-center gap-2"
              >
                ?? Share on X (Twitter) & Unlock
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs rounded-xl transition"
              >
                Close / Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl w-full space-y-10 relative z-10 my-auto">
        
        {/* HEADER */}
        <div className="text-center space-y-3 py-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight flex flex-wrap justify-center gap-x-3 gap-y-2 drop-shadow-lg">
            <span className="text-blue-400 animate-pulse">Notion</span>
            <span className="text-purple-400 animate-pulse" style={{ animationDelay: "200ms" }}>to</span>
            <span className="text-pink-400 animate-pulse" style={{ animationDelay: "400ms" }}>Live</span>
            <span className="text-amber-400 animate-pulse" style={{ animationDelay: "600ms" }}>JSON</span>
            <span className="text-emerald-400 animate-pulse" style={{ animationDelay: "800ms" }}>API</span>
            <span className="text-cyan-400 animate-pulse" style={{ animationDelay: "1000ms" }}>Engine</span>
          </h1>

          <p className="text-base md:text-lg font-bold tracking-wide flex flex-wrap justify-center gap-x-2 gap-y-1 drop-shadow-md">
            <span className="text-cyan-400 animate-pulse">Convert</span>
            <span className="text-blue-400 animate-pulse" style={{ animationDelay: "150ms" }}>Notion</span>
            <span className="text-indigo-400 animate-pulse" style={{ animationDelay: "300ms" }}>databases</span>
            <span className="text-purple-400 animate-pulse" style={{ animationDelay: "450ms" }}>into</span>
            <span className="text-pink-400 animate-pulse" style={{ animationDelay: "600ms" }}>high-performance</span>
            <span className="text-amber-400 animate-pulse" style={{ animationDelay: "750ms" }}>JSON</span>
            <span className="text-emerald-400 animate-pulse" style={{ animationDelay: "900ms" }}>endpoints</span>
            <span className="text-teal-300 animate-pulse" style={{ animationDelay: "1050ms" }}>instantly.</span>
          </p>
        </div>

        {/* AUTH SECTION */}
        {!isLoggedIn ? (
          <div className="p-7 rounded-3xl border border-blue-500/40 bg-slate-900/80 text-center max-w-md mx-auto space-y-4 shadow-2xl backdrop-blur-2xl">
            <h2 className="text-2xl font-black text-blue-400">Account Sign In</h2>
            <p className="text-xs text-gray-400">Sign in to access your live JSON endpoints and keys</p>
            <SignInButton mode="modal">
              <button className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition shadow-md">
                Sign In with Clerk
              </button>
            </SignInButton>
          </div>
        ) : (
          <div className="bg-gray-900/70 p-6 rounded-2xl border border-gray-700/60 space-y-4 backdrop-blur-xl shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-700/60 pb-4 flex-wrap gap-2">
              <div>
                <p className="text-xs text-gray-400">Authenticated Account:</p>
                <p className="font-semibold text-blue-400">{email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-xs rounded-full font-bold ${userPlan.isPro ? "bg-green-500/20 text-green-400 border border-green-500" : "bg-yellow-500/20 text-yellow-400 border border-yellow-500"}`}>
                  {userPlan.name}
                </span>
                <SignOutButton>
                  <button 
                    onClick={() => {
                      localStorage.removeItem("user_plan");
                      setUserPlan({
                        name: "Free Demo Plan",
                        price: "$0",
                        expiresAt: "Lifetime (Limited)",
                        apiKey: "DEMO_KEY_xyz123_test_only",
                        isPro: false,
                      });
                    }}
                    className="text-xs px-3 py-1 bg-red-900/40 border border-red-700 text-red-400 rounded hover:bg-red-900/60 transition"
                  >
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-semibold">YOUR ASSIGNED API KEY:</label>
              <input
                type="text"
                readOnly
                value={userPlan.apiKey}
                className="w-full p-2 bg-gray-950/80 border border-gray-800 rounded font-mono text-xs text-green-400"
              />
            </div>
          </div>
        )}

        {/* API REQUEST PANEL */}
        <div className="bg-gray-900/70 p-6 rounded-2xl border border-gray-700/60 space-y-4 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              {userPlan.isPro ? (
                <span className="text-green-400 flex items-center gap-1">?? Live Notion API Request</span>
              ) : (
                <span className="text-yellow-400 flex items-center gap-1">?? Demo Notion API Request</span>
              )}
            </h2>
            <span className="text-xs text-gray-400">
              {userPlan.isPro ? "Production Endpoint Access" : `Testing Sandbox Mode (${Math.max(0, 2 - fetchCount)} free left)`}
            </span>
          </div>

          <div className="flex gap-2 flex-col sm:flex-row">
            <input
              type="text"
              placeholder="Enter 32-character Notion Page ID..."
              value={pageId}
              onChange={(e) => setPageId(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleFetchNotion}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition disabled:opacity-50 text-sm whitespace-nowrap shadow-md"
            >
              {loading ? "Fetching..." : "Fetch JSON"}
            </button>
          </div>

          <div className="space-y-1 pt-2">
            <label className="text-xs text-gray-400 font-semibold">YOUR DYNAMIC API ENDPOINT URL:</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={generatedApiUrl}
                className="w-full p-2.5 bg-gray-950/80 border border-gray-800 rounded font-mono text-xs text-blue-400"
              />
              <button
                onClick={handleCopyUrl}
                className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-xs font-semibold rounded border border-gray-700 whitespace-nowrap transition"
              >
                {urlCopied ? "Copied! ?" : "Copy URL"}
              </button>
            </div>
          </div>

          {error && <div className="p-3 bg-red-900/40 border border-red-500 text-red-200 rounded text-sm">{error}</div>}

          {notionData && (
            <div className="relative bg-gray-950/90 p-4 rounded-lg border border-gray-800 group shadow-inner">
              <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-3">
                <span className="text-xs text-gray-400 font-mono">RESPONSE JSON DATA</span>
                <button
                  onClick={handleCopyJson}
                  className="px-3 py-1 bg-green-900/40 hover:bg-green-800/60 border border-green-600 text-green-300 text-xs rounded transition flex items-center gap-1 font-semibold"
                >
                  {jsonCopied ? "Code Copied! ?" : "?? Copy JSON Code"}
                </button>
              </div>
              <div className="overflow-x-auto max-h-64">
                <pre className="text-xs text-green-400 font-mono">{JSON.stringify(notionData, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* CODE SNIPPETS */}
          <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-4 space-y-3 mt-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-300">
                  ? INSTANT INTEGRATION
                </span>
                <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
                  <button
                    onClick={() => setSelectedSnippetTab("curl")}
                    className={`px-2.5 py-1 rounded transition ${
                      selectedSnippetTab === "curl"
                        ? "bg-blue-600 text-white font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    cURL
                  </button>
                  <button
                    onClick={() => setSelectedSnippetTab("javascript")}
                    className={`px-2.5 py-1 rounded transition ${
                      selectedSnippetTab === "javascript"
                        ? "bg-blue-600 text-white font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Node.js
                  </button>
                  <button
                    onClick={() => setSelectedSnippetTab("python")}
                    className={`px-2.5 py-1 rounded transition ${
                      selectedSnippetTab === "python"
                        ? "bg-blue-600 text-white font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Python
                  </button>
                </div>
              </div>

              <button
                onClick={handleCopySnippet}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono rounded transition flex items-center gap-1.5"
              >
                {snippetCopied ? "Copied! ?" : "?? Copy Snippet"}
              </button>
            </div>

            <div className="overflow-x-auto">
              <pre className="text-xs font-mono text-cyan-300 whitespace-pre">
                {snippetCodes[selectedSnippetTab]}
              </pre>
            </div>
          </div>

        </div>

        {/* PRICING PLANS */}
        <div className="space-y-6 pt-4">
          <div className="text-center space-y-1">
            <h2 className="text-3xl font-black tracking-tight drop-shadow-md bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Select Your Pro Access Plan
            </h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
              Instant Activation • High Performance Live Endpoints • Secure Checkout
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 items-stretch">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`p-6 rounded-3xl border flex flex-col justify-between text-center transition-all duration-300 transform hover:-translate-y-2 shadow-2xl backdrop-blur-2xl ${plan.bgClass}`}
              >
                <div className="space-y-3">
                  <div className="inline-block">
                    <span className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border ${plan.badgeClass}`}>
                      {plan.tag}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-200 tracking-tight">
                    {plan.name}
                  </h3>

                  <div className="py-2">
                    <p className={`text-4xl font-black tracking-tighter ${plan.priceClass}`}>
                      {plan.price}
                    </p>
                    <p className="text-xs text-gray-400 font-medium mt-1">
                      Full access for {plan.duration}
                    </p>
                  </div>

                  <div className="h-px bg-white/10 w-full my-2"></div>

                  <ul className="text-[11px] text-gray-300 space-y-1.5 text-left pl-2">
                    <li className="flex items-center gap-1.5">
                      <span className="text-green-400">?</span> Instant JSON API Key
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-green-400">?</span> Unlimited Endpoints
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-green-400">?</span> Ultra Fast Latency
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handleBuyPlan(plan)}
                  className={`mt-6 w-full py-3 rounded-xl text-xs uppercase tracking-wider transition transform active:scale-95 shadow-lg ${plan.btnClass}`}
                >
                  Buy Now ?
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="w-full pt-16 pb-6 text-center relative z-10 flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-slate-950/70 border border-amber-500/40 backdrop-blur-xl shadow-lg hover:border-amber-400 transition">
          <span className="text-xs text-amber-300 font-semibold tracking-wide">Admin Support:</span>
          <a
            href="mailto:Supportt.Adminn@gmail.com"
            className="text-xs font-bold text-amber-400 hover:underline cursor-pointer"
          >
            Supportt.Adminn@gmail.com
          </a>
        </div>

        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-950/60 border border-slate-800/80 backdrop-blur-xl shadow-xl hover:border-slate-700 transition">
          <span className="text-xs text-gray-400 font-semibold tracking-wide">Developer Contact:</span>
          <a
            href="mailto:developerappwebsite@gmail.com"
            className="text-xs font-bold text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text hover:underline cursor-pointer"
          >
            developerappwebsite@gmail.com
          </a>
        </div>
      </footer>

    </main>
  );
}
