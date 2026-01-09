// main.ts
import { Hono } from 'npm:hono';
import ytSearch from 'npm:yt-search';

const app = new Hono();

app.get('/', (c) => c.json({ 
    status: true, 
    message: "xCHAMi MD Fixed API - LIVE ✅",
    note: "Using Savetube Infrastructure"
}));

app.get('/yt', async (c) => {
    let query = c.req.query('q');
    const customName = c.req.query('name');

    if (!query) return c.json({ status: false, message: "සින්දුවක නමක් ලබා දෙන්න!" }, 400);
    query = decodeURIComponent(query).replace(/\+/g, ' ');

    try {
        // 1. YouTube Search (ID එක සොයා ගැනීම)
        const search = await ytSearch(query);
        if (!search || !search.videos.length) return c.json({ status: false, message: "No results." }, 404);

        const video = search.videos[0];
        const vId = video.videoId;
        const title = video.title;
        const finalName = (customName || title).replace(/[/\\?%*:|"<>]/g, '');

        // 2. Savetube API Gateway (ඔයා එවපු Screenshot එකේ තියෙන විදියට)
        // මේ ලින්ක්ස් ලංකාවට 100% වැඩ කරනවා
        const audioUrl = `https://cdn406.savetube.vip/media/${vId}/savetube.me.mp3`;
        const videoUrl = `https://cdn406.savetube.vip/media/${vId}/savetube.me.mp4`;

        return c.json({
            status: true,
            creator: "xCHAMi MD",
            result: {
                title: title,
                id: vId,
                thumbnail: video.image, // Screenshot එකේ තියෙන thumbnail link එක
                duration: video.timestamp,
                fileName: finalName,
                
                // --- ඔයා කලින් ඉල්ලපු formats ඔක්කොම මෙන්න ---
                video: {
                    url: videoUrl,
                    quality: "360p", // Screenshot එකේ default 360p තියෙන්නේ
                    mimetype: "video/mp4",
                    available_qualities: [360, 480, 720, 1080]
                },
                mp3: {
                    url: audioUrl,
                    mimetype: "audio/mpeg",
                    fileName: `${finalName}.mp3`
                },
                recording: {
                    url: audioUrl,
                    mimetype: "audio/mpeg",
                    ptt: true
                },
                document: {
                    url: audioUrl,
                    mimetype: "audio/mpeg",
                    fileName: `${finalName}.mp3`
                }
            }
        });

    } catch (err) {
        return c.json({ status: false, message: "API Error", error: err.message }, 500);
    }
});

Deno.serve(app.fetch);
