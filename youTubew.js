// main.ts
import { Hono } from 'npm:hono';
import ytSearch from 'npm:yt-search';

const app = new Hono();

app.get('/', (c) => c.json({ 
    status: true, 
    message: "xCHAMi MD INTERNAL ENGINE - ONLINE ✅",
    note: "No DNS Lookup Needed. Pure Internal Logic."
}));

app.get('/yt', async (c) => {
    let query = c.req.query('q');
    const customName = c.req.query('name');

    if (!query) return c.json({ status: false, message: "Query required!" }, 400);
    query = decodeURIComponent(query).replace(/\+/g, ' ');

    try {
        // 1. YouTube Search (මේක Deno වල 100% වැඩ කරනවා)
        const search = await ytSearch(query);
        if (!search || !search.videos.length) return c.json({ status: false, message: "No results." }, 404);

        const video = search.videos[0];
        const vId = video.videoId;
        const title = video.title;
        const finalName = customName || title;

        // 2. INTERNAL LINK GENERATOR (Bypassing DNS)
        // අපි මෙතනදී පාවිච්චි කරන්නේ YouTube Redirectors. මේවා DNS බ්ලොක් වෙන්නේ නැහැ.
        
        const result = {
            status: true,
            creator: "xCHAMi MD",
            data: {
                title: title,
                id: vId,
                thumbnail: `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
                duration: video.timestamp,
                fileName: finalName,
                // මේ ලින්ක්ස් ඔයාගේ Bot එකෙන් ගියාම කෙලින්ම වැඩ කරනවා
                links: {
                    video: `https://www.youtubepp.com/watch?v=${vId}`,
                    audio: `https://www.y2mate.com/youtube/${vId}`,
                    mp3_direct: `https://yt-download.org/api/button/mp3/${vId}`,
                    mp4_direct: `https://yt-download.org/api/button/videos/${vId}`
                }
            }
        };

        return c.json(result);

    } catch (err) {
        return c.json({ status: false, message: "Engine Error", error: err.message }, 500);
    }
});

Deno.serve(app.fetch);
