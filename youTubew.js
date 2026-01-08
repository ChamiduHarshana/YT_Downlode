// main.ts
import { Hono } from 'npm:hono';
import ytSearch from 'npm:yt-search';

const app = new Hono();

app.get('/', (c) => c.json({ 
    status: true, 
    message: "xCHAMi MD Bypass API (Space Supported) 🚀" 
}));

app.get('/yt', async (c) => {
    // 1. URL එකෙන් Query එක ලබා ගැනීම
    let query = c.req.query('q');
    const customName = c.req.query('name');

    if (!query) return c.json({ status: false, message: "Please provide a query (name or link)." }, 400);

    // 2. '+' ලකුණු තිබේ නම් ඒවා හිස්තැන් (spaces) බවට පත් කිරීම (Auto-Fix)
    query = decodeURIComponent(query).replace(/\+/g, ' ');

    try {
        // 3. YouTube Search
        const search = await ytSearch(query);
        if (!search.videos.length) return c.json({ status: false, message: "No videos found." }, 404);
        
        const video = search.videos[0];
        const videoUrl = video.url;
        const title = video.title;

        // 4. Cobalt API Logic (Bypass)
        const cobaltApi = "https://cobalt.tools/api/json";
        
        // Audio Request
        const audioRes = await fetch(cobaltApi, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: videoUrl, videoQuality: "720", downloadMode: "audio" })
        });
        const audioData = await audioRes.json();

        // Video Request
        const videoRes = await fetch(cobaltApi, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: videoUrl, videoQuality: "720", downloadMode: "video" })
        });
        const videoData = await videoRes.json();

        const finalName = customName || title;

        return c.json({
            status: true,
            creator: "xCHAMi MD",
            result: {
                title: title,
                id: video.videoId,
                thumbnail: video.thumbnail,
                fileName: finalName,
                video: {
                    url: videoData.url || audioData.url,
                    quality: "720p",
                    caption: `🎥 ${title}`
                },
                mp3: {
                    url: audioData.url || videoData.url,
                    mimetype: "audio/mpeg",
                    fileName: `${finalName}.mp3`
                },
                recording: {
                    url: audioData.url || videoData.url,
                    ptt: true
                },
                document: {
                    url: audioData.url || videoData.url,
                    mimetype: "audio/mpeg",
                    fileName: `${finalName}.mp3`
                }
            }
        });

    } catch (err) {
        return c.json({ 
            status: false, 
            message: "YouTube high security block.",
            error: err.message 
        }, 500);
    }
});

Deno.serve(app.fetch);
