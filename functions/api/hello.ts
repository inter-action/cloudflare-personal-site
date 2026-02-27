import type { PagesFunction, Response as CfResponse } from '@cloudflare/workers-types';

interface Env {}

export const onRequestGet: PagesFunction<Env> = (context) => {
  return new Response(
    JSON.stringify({
      message: 'Hello from Cloudflare Workers!',
      timestamp: new Date().toISOString(),
      region: context.request.headers.get('cf-ray') ? 'edge' : 'local',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  ) as unknown as CfResponse;
};
