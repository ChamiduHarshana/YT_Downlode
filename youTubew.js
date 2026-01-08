// main.ts
import { Hono } from 'npm:hono';
import ytSearch from 'npm:yt-search';

const app = new Hono();

app.get('/', (c) => c.json({ 
    status: true, 
    message: "xCHAMi MD Ultimate API v6 - Online 🚀",
    note: "DNS Issues Fixed!"
}));

app.get('/yt', async (c) => {
    let query = c.req.query('q');
    const customName = c.req.query('name');

    if (!query) return c.json({ status: false, message: "Query is required." }, 400);
    query = decodeURIComponent(query).replace(/\+/g, ' ');

    try {
        // 1. YouTube Search (Deno වල සැමවිටම වැඩ කරයි)
        const search = await ytSearch(query);
        if (!search || !search.videos.length) return c.json({ status: false, message: "No results." }, 404);

        const video = search.videos[0];
        const vId = video.videoId;
        const title = video.title;
        const finalName = customName || title;

        // 2. High-Speed Global CDN Links
        // මේ ලින්ක්ස් DNS errors මගහරින අතර ඉතා වේගවත්ය.
        // අපි මෙතනදී පාවිච්චි කරන්නේ ලෝකයේ ස්ථාවරම Downloader සර්වර්ස්.

        return c.json({
            status: true,
            creator: "xCHAMi MD",
            result: {
                title: title,
                id: vId,
                thumbnail: video.thumbnail,
                duration: video.timestamp,
                fileName: finalName,
                // Video Links (MP4 - 720p/360p)
                video: {
                    url: `https://sh.y2mate.is/download?v=${vId}&type=video`,
                    direct: `https://loader.to/api/button/?url=https://www.youtube.com/watch?v=${vId}&f=720`,
                    quality: "720p"
                },
                // Audio Links (MP3 - 128kbps)
                mp3: {
                    url: `https://sh.y2mate.is/download?v=${vId}&type=mp3`,
                    direct: `https://loader.to/api/button/?url=https://www.youtube.com/watch?v=${vId}&f=mp3`,
                    mimetype: "audio/mpeg",
                    fileName: `${finalName}.mp3`
                },
                // WhatsApp Recording (PTT)
                recording: {
                    url: `https://sh.y2mate.is/download?v=${vId}&type=mp3`,
                    ptt: true
                },
                // Document
                document: {
                    url: `https://sh.y2mate.is/download?v=${vId}&type=mp3`,
                    fileName: `${finalName}.mp3`
                }
            }
        });

    } catch (err) {
        return c.json({ status: false, message: "API Busy", error: err.message }, 500);
    }
});

Deno.serve(app.fetch);
