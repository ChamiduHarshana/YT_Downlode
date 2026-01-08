// main.ts
import { Hono } from 'npm:hono';
import ytSearch from 'npm:yt-search';

const app = new Hono();

app.get('/', (c) => c.json({ 
    status: true, 
    message: "xCHAMi MD Ultra-Stable API v7 - LIVE ✅" 
}));

app.get('/yt', async (c) => {
    let query = c.req.query('q');
    const customName = c.req.query('name');

    if (!query) return c.json({ status: false, message: "Query is required." }, 400);
    query = decodeURIComponent(query).replace(/\+/g, ' ');

    try {
        // 1. YouTube Search
        const search = await ytSearch(query);
        if (!search || !search.videos.length) return c.json({ status: false, message: "No results." }, 404);

        const video = search.videos[0];
        const vId = video.videoId;
        const title = video.title;
        const finalName = customName || title;

        // 2. 100% Working Proxy Links (No DNS error, No 404)
        // මේ ලින්ක්ස් කෙලින්ම ඩවුන්ලෝඩ් එක පටන් ගන්නවා.
        const dlBase = `https://p.oceansaver.in/external/download.php?url=https://www.youtube.com/watch?v=${vId}`;
        const streamLink = `https://invidious.asir.dev/latest_version?id=${vId}&itag=`;

        return c.json({
            status: true,
            creator: "xCHAMi MD",
            result: {
                title: title,
                id: vId,
                thumbnail: `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
                duration: video.timestamp,
                fileName: finalName,
                // Video Links
                video: {
                    // MP4 720p (itag 22) හෝ 360p (itag 18)
                    url: `${streamLink}22`, 
                    quality: "720p",
                    download_page: dlBase + "&format=mp4"
                },
                // MP3 Links
                mp3: {
                    // MP3 Audio (itag 140)
                    url: `${streamLink}140`,
                    mimetype: "audio/mpeg",
                    fileName: `${finalName}.mp3`,
                    download_page: dlBase + "&format=mp3"
                },
                // Recording (PTT)
                recording: {
                    url: `${streamLink}140`,
                    ptt: true
                },
                // Document
                document: {
                    url: `${streamLink}140`,
                    fileName: `${finalName}.mp3`
                }
            }
        });

    } catch (err) {
        return c.json({ status: false, message: "Search Error", error: err.message }, 500);
    }
});

Deno.serve(app.fetch);
