import type { VercelRequest, VercelResponse } from '@vercel/node'

const { APIKEY } = process.env

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!APIKEY) {
      return res.status(500).json({ error: 'Missing APIKEY in environment variables' })
    }

    // body가 string일 수도, object일 수도
    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body || '{}')
        : (req.body ?? {})

    const { title, page = 1, id } = body as { title?: string; page?: number; id?: string }

    if (!id && !title) {
      return res.status(400).json({ error: 'Either "id" or "title" is required' })
    }

    const url = id
      ? `https://www.omdbapi.com/?apikey=${APIKEY}&i=${encodeURIComponent(id)}&plot=full`
      : `https://www.omdbapi.com/?apikey=${APIKEY}&s=${encodeURIComponent(title!)}&page=${Number(page)}`

    const r = await fetch(url)

    // OMDb가 200이라도 Error 메시지 줄 수 있음
    const json = await r.json()

    return res.status(200).json(json)
  } catch (err: any) {
    return res.status(500).json({
      error: 'Serverless function crashed',
      message: err?.message ?? String(err),
    })
  }
}