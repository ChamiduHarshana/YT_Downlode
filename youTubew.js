// main.ts
import { Hono } from 'npm:hono';
import ytSearch from 'npm:yt-search';

const app = new Hono();

app.get('/', (c) => c.json({ 
    status: true, 
    message: "xCHAMi MD Fixed API v11 - LIVE ✅",
    note: "All external API fetches removed. Direct Gateway Enabled."
}));

app.get('/yt', async (c) => {
    let query = c.req.query('q');
    const customName = c.req.query('name');

    if (!query) return c.json({ status: false, message: "Query required!" }, 400);
    query = decodeURIComponent(query).replace(/\+/g, ' ');

    try {
        // 1. YouTube Search (මේක Deno වල සැමවිටම වැඩ කරයි)
        const search = await ytSearch(query);
        if (!search || !search.videos.length) return c.json({ status: false, message: "No results." }, 404);

        const video = search.videos[0];
        const vId = video.videoId;
        const title = video.title;
        const finalName = customName || title;

        // 2. Direct Redirect Logic
        // අපි මෙතනදී කරන්නේ URL එකක් Fetch කරන්නේ නැතිව, වැඩ කරන URL එකක් Generate කරන එක විතරයි.
        // එවිට DNS lookup එක වෙන්නේ Deno එකේ නෙවෙයි, Bot එකේ හෝ Browser එකේ.
        
        // ලෝකයේ තියෙන ස්ථාවරම Instances කිහිපයක්
        const instances = ["inv.tux.digital", "invidious.asir.dev", "iv.melmac.space"];
        const randomInstance = instances[Math.floor(Math.random() * instances.length)];

        const streamUrl = `https://${randomInstance}/latest_version?id=${vId}&itag=`;

        return c.json({
            status: true,
            creator: "xCHAMi MD",
            result: {
                title: title,
                id: vId,
                thumbnail: `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
                duration: video.timestamp,
                fileName: finalName,
                // Video Links (High Quality)
                video: {
                    url: `${streamUrl}22`, // 720p
                    quality: "720p"
                },
                // MP3 Links (High Quality Audio)
                mp3: {
                    url: `${streamUrl}140`, // Original Audio
                    mimetype: "audio/mpeg",
                    fileName: `${finalName}.mp3`
                },
                recording: {
                    url: `${streamUrl}140`,
                    ptt: true
                },
                document: {
                    url: `${streamUrl}140`,
                    fileName: `${finalName}.mp3`
                },
                // External Web Downloaders (Backup)
                external: {
                    y2mate: `https://www.youtubepp.com/watch?v=${vId}`,
                    ssyoutube: `https://www.ssyoutube.com/watch?v=${vId}`
                }
            }
        });

    } catch (err) {
        return c.json({ status: false, message: "System Error", error: err.message }, 500);
    }
});

Deno.serve(app.fetch);
