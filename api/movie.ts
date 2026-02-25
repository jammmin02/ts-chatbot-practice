import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    node: process.version,
    hasAPIKEY: !!process.env.APIKEY,
    bodyType: typeof req.body,
    body: req.body,
  })
}