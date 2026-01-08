// main.ts
import { Hono } from 'npm:hono';
import ytSearch from 'npm:yt-search';

const app = new Hono();

app.get('/', (c) => c.json({ status: true, message: "xCHAMi MD High-Speed API Online! ⚡" }));

app.get('/yt', async (c) => {
    let query = c.req.query('q');
    const customName = c.req.query('name');

    if (!query) return c.json({ status: false, message: "Query is required." }, 400);
    query = decodeURIComponent(query).replace(/\+/g, ' ');

    try {
        const search = await ytSearch(query);
        if (!search || !search.videos.length) return c.json({ status: false, message: "No results." }, 404);

        const video = search.videos[0];
        const vId = video.videoId;
        const title = video.title;
        const finalName = customName || title;

        // --- NEW HIGH SPEED DOWNLOAD LOGIC ---
        // අපි මෙතනදී පාවිච්චි කරන්නේ ඉතා වේගවත් REST API සේවාවක්
        // මේ ලින්ක්ස් කිසිම වෙලාවක Timeout වෙන්නේ නැහැ.
        
        return c.json({
            status: true,
            creator: "xCHAMi MD",
            result: {
                title: title,
                id: vId,
                thumbnail: video.thumbnail,
                duration: video.timestamp,
                fileName: finalName,
                // 1. Video Download (720p Direct)
                video: {
                    url: `https://api.vevioz.com/api/button/videos/${vId}`, 
                    direct: `https://qumhit.com/download/${vId}/mp4/720`,
                    quality: "720p"
                },
                // 2. Audio Download (MP3 128kbps High Speed)
                mp3: {
                    url: `https://api.vevioz.com/api/button/mp3/${vId}`,
                    direct: `https://qumhit.com/download/${vId}/mp3/128`,
                    mimetype: "audio/mpeg",
                    fileName: `${finalName}.mp3`
                },
                // 3. Recording/Voice Note
                recording: {
                    url: `https://qumhit.com/download/${vId}/mp3/128`,
                    ptt: true
                },
                // 4. Document
                document: {
                    url: `https://qumhit.com/download/${vId}/mp3/128`,
                    fileName: `${finalName}.mp3`
                }
            }
        });

    } catch (err) {
        return c.json({ status: false, message: "Server Busy", error: err.message }, 500);
    }
});

Deno.serve(app.fetch);
