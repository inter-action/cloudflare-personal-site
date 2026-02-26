export async function onRequest(context: any) {
  const response = await context.next();
  const origin = context.request.headers.get('Origin') || '';
  const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');

  if (isLocalhost) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  }

  return response;
}
