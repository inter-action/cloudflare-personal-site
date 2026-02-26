export function onRequestGet(context: any) {
  return new Response(
    JSON.stringify({
      message: 'Hello from Cloudflare Workers!',
      timestamp: new Date().toISOString(),
      region: context.request.headers.get('cf-ray') ? 'edge' : 'local',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
}
