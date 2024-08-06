import Prometheus, { collectDefaultMetrics } from 'prom-client';

export const dynamic = 'force-dynamic';

collectDefaultMetrics({
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], // These are the default buckets.
});

export async function GET() {
  const metrics = await Prometheus.register.metrics();

  return new Response(metrics, {
    headers: {
      'Content-Type': Prometheus.register.contentType,
    },
  });
}
