import 'server-only'

const BASE_URL = 'https://api.runcomfy.net'

function getHeaders() {
  return {
    'Authorization': `Bearer ${process.env.RUNCOMFY_TOKEN!}`,
    'Content-Type': 'application/json',
  }
}

/**
 * Submete um workflow ComfyUI para execução.
 * Retorna o request_id para acompanhar o status.
 *
 * Exemplo de uso:
 *   const { request_id } = await submitWorkflow('endpoint-id', { prompt: {...} })
 */
export async function submitWorkflow(endpointId: string, payload: object) {
  const res = await fetch(`${BASE_URL}/serverless/${endpointId}/run`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`RunComfy submit error: ${res.status} ${await res.text()}`)
  return res.json() as Promise<{ request_id: string }>
}

/**
 * Verifica o status de um job pelo request_id.
 * Status possíveis: "pending" | "running" | "completed" | "failed"
 */
export async function getJobStatus(endpointId: string, requestId: string) {
  const res = await fetch(`${BASE_URL}/serverless/${endpointId}/status/${requestId}`, {
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error(`RunComfy status error: ${res.status} ${await res.text()}`)
  return res.json() as Promise<{ status: string; output?: unknown; error?: string }>
}

/**
 * Submete um workflow e aguarda a conclusão (polling automático).
 * Lança erro se o job falhar ou ultrapassar o timeout.
 *
 * @param endpointId  ID do endpoint serverless no RunComfy
 * @param payload     Payload do workflow ComfyUI
 * @param intervalMs  Intervalo de polling em ms (padrão: 2000)
 * @param timeoutMs   Timeout máximo em ms (padrão: 300000 = 5 min)
 */
export async function runWorkflow(
  endpointId: string,
  payload: object,
  intervalMs = 2000,
  timeoutMs = 300_000
) {
  const { request_id } = await submitWorkflow(endpointId, payload)

  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, intervalMs))

    const job = await getJobStatus(endpointId, request_id)

    if (job.status === 'completed') return job.output
    if (job.status === 'failed') throw new Error(`RunComfy job failed: ${job.error}`)
  }

  throw new Error(`RunComfy job timed out after ${timeoutMs / 1000}s (request_id: ${request_id})`)
}
