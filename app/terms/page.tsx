export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-slate-300 text-sm space-y-6">
      <h1 className="text-3xl font-bold text-white tracking-tight">Terms of Service & Refund Policy</h1>
      <p className="text-xs text-slate-500">Last updated: 2026</p>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">1. Service Delivery</h2>
        <p>NotionEngine converts user-provided Notion block configurations into readable REST API endpoints with high-speed global caching.</p>

        <h2 className="text-lg font-semibold text-white">2. Rate Limits & Fair Usage</h2>
        <p>Pro subscriptions include up to 120 API requests/minute. Automated scraping, abuse, or unauthorized reverse-engineering will trigger automated key deactivation without notice.</p>

        <h2 className="text-lg font-semibold text-white">3. Refund Guarantee</h2>
        <p>We provide a 7-day unconditional refund on Monthly and Annual recurring licenses if the service is non-functional with your Notion setup. Single sprint passes (10-Day) are non-refundable once API requests are recorded.</p>

        <h2 className="text-lg font-semibold text-white">4. Payment Merchant</h2>
        <p>Payments are conducted by Lemon Squeezy, LLC (Merchant of Record). Inquiries regarding chargebacks and receipts are securely routed through Lemon Squeezy order management.</p>
      </div>
    </main>
  );
}