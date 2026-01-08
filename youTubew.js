// main.ts
import { Hono } from 'npm:hono';
import ytSearch from 'npm:yt-search';

const app = new Hono();

app.get('/', (c) => c.json({ 
    status: true, 
    message: "xCHAMi MD Secure API v9 - LIVE ✅",
    security: "SSL Certified & Private Connection"
}));

app.get('/yt', async (c) => {
    let query = c.req.query('q');
    const customName = c.req.query('name');

    if (!query) return c.json({ status: false, message: "Query required!" }, 400);
    query = decodeURIComponent(query).replace(/\+/g, ' ');

    try {
        // 1. YouTube Search
        const search = await ytSearch(query);
        if (!search || !search.videos.length) return c.json({ status: false, message: "No results." }, 404);

        const vId = search.videos[0].videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${vId}`;
        const title = search.videos[0].title;
        const finalName = customName || title;

        // 2. Cobalt Official API Logic (Security bypass + Secure Connection)
        // මේක පාවිච්චි කරන්නේ ඔවුන්ගේම servers නිසා "Privacy Warning" එන්නේ නැහැ.
        const cobaltUrl = "https://api.cobalt.tools/api/json";

        return c.json({
            status: true,
            creator: "xCHAMi MD",
            result: {
                title: title,
                id: vId,
                thumbnail: `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
                duration: search.videos[0].timestamp,
                fileName: finalName,
                // Direct Downloader API (ඔයාගේ Bot එකෙන් මේ ලින්ක් එකට Request එකක් යවන්න)
                video: {
                    url: `https://cobalt.tools/api/json`, // මේක POST request එකක් විදියට Bot එකේ පාවිච්චි කරන්න
                    direct: `https://cobalt.tools/api/json`, 
                    quality: "720p",
                    note: "Use POST request with video URL to get direct link"
                },
                mp3: {
                    url: `https://cobalt.tools/api/json`,
                    mimetype: "audio/mpeg",
                    fileName: `${finalName}.mp3`
                },
                // --- BOT එකට ලේසි වෙන්න ලේසිම Bypass Link එක ---
                download: {
                    audio: `https://api.vkrfork.com/api/yt?url=${videoUrl}`,
                    video: `https://api.vkrfork.com/api/yt?url=${videoUrl}`
                }
            }
        });

    } catch (err) {
        return c.json({ status: false, message: "Secure Connection Error", error: err.message }, 500);
    }
});

Deno.serve(app.fetch);
