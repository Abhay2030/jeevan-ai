/**
 * Command Center routes layout — Ink theme (SRS §8.2)
 * Routes: /command/dashboard, /command/live-map, /command/incidents,
 *         /command/resources, /command/facilities, /command/predictions,
 *         /command/optimization, /command/simulation, /command/analytics
 */
export default function CommandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-theme="ink" className="flex flex-1 flex-col min-h-screen">
      {children}
    </div>
  );
}
