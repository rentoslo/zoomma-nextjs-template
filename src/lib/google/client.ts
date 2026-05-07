import 'server-only'
import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Retorna um cliente Google Gemini configurado com a API Key do ambiente.
 * Use apenas em API Routes e Server Components.
 *
 * Modelos disponíveis:
 * - gemini-2.0-flash   → rápido e econômico (recomendado para maioria dos casos)
 * - gemini-2.5-pro     → máxima qualidade e raciocínio
 * - gemini-1.5-flash   → versão anterior, estável
 *
 * Exemplo de uso:
 *   const genai = getGemini()
 *   const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash' })
 *   const result = await model.generateContent('Sua pergunta aqui')
 *   const text = result.response.text()
 */
export function getGemini() {
  return new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
}
