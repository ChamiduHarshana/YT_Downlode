// main.ts
import { Hono } from 'npm:hono';
import ytSearch from 'npm:yt-search';

const app = new Hono();

app.get('/', (c) => c.json({ 
    status: true, 
    message: "xCHAMi MD Bypass API is Online! 🛡️",
    instruction: "Use /yt?q=song+name to download."
}));

app.get('/yt', async (c) => {
    const query = c.req.query('q');
    const customName = c.req.query('name');

    if (!query) return c.json({ status: false, message: "Query required!" }, 400);

    try {
        // 1. YouTube එකේ සින්දුව හෝ වීඩියෝව සෙවීම
        const search = await ytSearch(query);
        if (!search.videos.length) return c.json({ status: false, message: "No results found." }, 404);
        
        const video = search.videos[0];
        const videoId = video.videoId;
        const title = video.title;
        const thumbnail = video.thumbnail;

        // 2. YouTube Blocking bypass කරන logic එක (Using a stable conversion helper)
        // අපි මෙතනදී පාවිච්චි කරන්නේ පසිද්ධ YouTube conversion API එකක backend එකක්
        const apiResponse = await fetch(`https://api.zenon.pw/api/v1/yt/download?id=${videoId}`);
        const apiData = await apiResponse.json();

        if (!apiData || !apiData.status) {
            // Fallback: තවත් backend එකක් උත්සාහ කිරීම
            throw new Error("Primary bypass method failed.");
        }

        const finalName = customName || title;

        return c.json({
            status: true,
            creator: "xCHAMi MD",
            result: {
                title: title,
                id: videoId,
                thumbnail: thumbnail,
                fileName: finalName,
                // Video & Audio links (Converted & Stabilized)
                video: {
                    url: apiData.video_url || apiData.download_url,
                    quality: "720p",
                    caption: `🎥 ${title}`
                },
                mp3: {
                    url: apiData.audio_url || apiData.download_url,
                    mimetype: "audio/mpeg",
                    fileName: `${finalName}.mp3`
                },
                recording: {
                    url: apiData.audio_url || apiData.download_url,
                    ptt: true
                },
                document: {
                    url: apiData.audio_url || apiData.download_url,
                    mimetype: "audio/mpeg",
                    fileName: `${finalName}.mp3`
                }
            }
        });

    } catch (err) {
        console.error("Bypass Error:", err.message);
        return c.json({ 
            status: false, 
            message: "All bypass methods failed. YouTube high security.",
            error: err.message 
        }, 500);
    }
});

Deno.serve(app.fetch);
