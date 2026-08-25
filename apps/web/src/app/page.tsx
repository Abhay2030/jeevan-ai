export default function HomePage() {
  return (
    <div data-theme="paper" className="flex flex-1 flex-col">
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center space-y-6 px-6">
          <h1 className="text-5xl font-bold tracking-tight text-ink-900">
            JEEVAN <span className="text-primary-600">AI</span>
          </h1>
          <p className="text-xl text-ink-400 max-w-lg mx-auto font-body">
            Public Health Intelligence &amp; Emergency Decision-Support Platform
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/emergency"
              className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-alert-600 text-white font-display font-semibold text-lg hover:bg-alert-700 transition-colors focus-visible:outline-primary-500"
              style={{ minWidth: "var(--size-touch-sos)", minHeight: "var(--size-touch-sos)" }}
            >
              Get Emergency Help
            </a>
            <a
              href="/login"
              className="inline-flex items-center justify-center h-14 px-8 rounded-full border-2 border-primary-600 text-primary-700 font-display font-semibold text-lg hover:bg-primary-50 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
