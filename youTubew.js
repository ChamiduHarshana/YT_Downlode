// main.ts
import { Hono } from 'npm:hono';
import ytSearch from 'npm:yt-search';

const app = new Hono();

app.get('/', (c) => c.json({ status: true, message: "xCHAMi MD Ultra-Stable API v4 Online 💎" }));

app.get('/yt', async (c) => {
    let query = c.req.query('q');
    const customName = c.req.query('name');

    if (!query) return c.json({ status: false, message: "Please provide a query." }, 400);

    // පිරිසිදුව Query එක සකසා ගැනීම
    query = decodeURIComponent(query).replace(/\+/g, ' ');

    try {
        // 1. YouTube Search
        const search = await ytSearch(query);
        if (!search.videos.length) return c.json({ status: false, message: "No results found." }, 404);
        
        const video = search.videos[0];
        const videoUrl = video.url;
        const title = video.title;

        // 2. Powerful Bypass Logic (Stable Infrastructure)
        // අපි මෙතනදී පාවිච්චි කරන්නේ ඉතා වේගවත් සහ Block නොවන Download Server එකක්
        const fetchUrl = `https://api.vkrfork.com/api/yt?url=${videoUrl}`;
        
        const response = await fetch(fetchUrl);
        const data = await response.json();

        if (!data || !data.data) {
            throw new Error("External API failure.");
        }

        // ඩවුන්ලෝඩ් ලින්ක්ස් ලබා ගැනීම (විවිධ format තිබේ නම් ඒවා සොයා ගැනීම)
        const downloadLinks = data.data;
        const finalName = customName || title;

        return c.json({
            status: true,
            creator: "xCHAMi MD",
            result: {
                title: title,
                id: video.videoId,
                duration: video.timestamp,
                thumbnail: video.thumbnail,
                fileName: finalName,
                // Result Links
                video: {
                    url: downloadLinks.find(f => f.type === 'video' && f.quality === '720p')?.url || downloadLinks.find(f => f.type === 'video')?.url,
                    quality: "720p",
                    caption: `🎥 ${title}`
                },
                mp3: {
                    url: downloadLinks.find(f => f.type === 'audio')?.url || downloadLinks[0].url,
                    mimetype: "audio/mpeg",
                    fileName: `${finalName}.mp3`
                },
                recording: {
                    url: downloadLinks.find(f => f.type === 'audio')?.url || downloadLinks[0].url,
                    ptt: true
                },
                document: {
                    url: downloadLinks.find(f => f.type === 'audio')?.url || downloadLinks[0].url,
                    mimetype: "audio/mpeg",
                    fileName: `${finalName}.mp3`
                }
            }
        });

    } catch (err) {
        console.error("Critical Error:", err.message);
        // Fallback Error Response
        return c.json({ 
            status: false, 
            message: "API server is busy. Please try again in 5 seconds.",
            error: err.message 
        }, 500);
    }
});

Deno.serve(app.fetch);
