'use server'
import { ElevenLabsClient, ElevenLabs } from 'elevenlabs'
import { Readable } from 'stream'

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
const VOICE_ID = process.env.VOICE_ID || ''

const elevenlabs = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY
})

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = []
  for await (const chunk of stream) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

export const createAudioFileFromText = async (
  text: string
): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const audio = await elevenlabs.textToSpeech.convert(VOICE_ID, {
        optimize_streaming_latency: ElevenLabs.OptimizeStreamingLatency.Zero,
        output_format: ElevenLabs.OutputFormat.Mp32205032,
        text,
        voice_settings: {
          stability: 0.95,
          similarity_boost: 1.0
        }
      })

      const audioBuffer = await streamToBuffer(audio)
      const audioBase64 = audioBuffer.toString('base64')
      resolve(audioBase64)
    } catch (error) {
      reject(error)
    }
  })
}
