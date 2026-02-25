import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "OMDB_API_KEY 누락 (Vercel env 설정 필요)" });
    }

    const body =
      typeof req.body === "string"
        ? (req.body.trim() ? JSON.parse(req.body) : {})
        : (req.body ?? {});

    const { title, page = 1, id } = body as { title?: string; page?: number; id?: string };

    if (!id && !title) {
      return res.status(400).json({ success: false, message: "title 또는 id가 필요합니다." });
    }

    const url = id
      ? `https://www.omdbapi.com/?apikey=${apiKey}&i=${encodeURIComponent(id)}&plot=full`
      : `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(title!)}&page=${page}`;

    const r = await fetch(url);

    const text = await r.text();
    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      return res.status(502).json({ success: false, message: "OMDB 응답이 JSON이 아님", raw: text });
    }

    return res.status(200).json(json);
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e?.message ?? "unknown error" });
  }
}