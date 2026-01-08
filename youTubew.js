// main.ts
import { Hono } from 'npm:hono';
import ytSearch from 'npm:yt-search';

const app = new Hono();

app.get('/', (c) => c.json({ status: true, message: "xCHAMi MD Auto-Switch API v8 Online! 🛡️" }));

app.get('/yt', async (c) => {
    let query = c.req.query('q');
    const customName = c.req.query('name');

    if (!query) return c.json({ status: false, message: "Query is required." }, 400);
    query = decodeURIComponent(query).replace(/\+/g, ' ');

    try {
        const search = await ytSearch(query);
        if (!search || !search.videos.length) return c.json({ status: false, message: "No results." }, 404);

        const vId = search.videos[0].videoId;
        const title = search.videos[0].title;
        const finalName = customName || title;

        // 🛡️ වැඩ කරන Instances කිහිපයක් (එකක් බැරි වුණොත් අනිකට යයි)
        const activeInstances = [
            "https://inv.tux.digital",
            "https://invidious.nerdvpn.de",
            "https://iv.melmac.space",
            "https://invidious.no-logs.com"
        ];

        // සර්වර් එකක් random තෝරා ගැනීම (Load balancing)
        const base = activeInstances[Math.floor(Math.random() * activeInstances.length)];
        const streamLink = `${base}/latest_version?id=${vId}&itag=`;

        return c.json({
            status: true,
            creator: "xCHAMi MD",
            result: {
                title: title,
                id: vId,
                thumbnail: `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
                duration: search.videos[0].timestamp,
                fileName: finalName,
                // Video Links
                video: {
                    url: `${streamLink}22`, // 720p
                    fallback: `${streamLink}18`, // 360p
                    quality: "720p"
                },
                // MP3 Links
                mp3: {
                    url: `${streamLink}140`, // Original Audio
                    mimetype: "audio/mpeg",
                    fileName: `${finalName}.mp3`
                },
                recording: {
                    url: `${streamLink}140`,
                    ptt: true
                },
                document: {
                    url: `${streamLink}140`,
                    fileName: `${finalName}.mp3`
                }
            }
        });

    } catch (err) {
        return c.json({ status: false, message: "API Switcher Error", error: err.message }, 500);
    }
});

Deno.serve(app.fetch);
