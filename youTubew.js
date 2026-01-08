// main.ts
import { Hono } from 'npm:hono';
import ytSearch from 'npm:yt-search';

const app = new Hono();

app.get('/', (c) => c.json({ 
    status: true, 
    message: "xCHAMi MD Bypass PRO v5 Online! 🛡️",
    usage: "/yt?q=song name"
}));

app.get('/yt', async (c) => {
    let query = c.req.query('q');
    const customName = c.req.query('name');

    if (!query) return c.json({ status: false, message: "Query is required." }, 400);
    query = decodeURIComponent(query).replace(/\+/g, ' ');

    try {
        // 1. YouTube Search (මේක Deno වල වැඩ කරනවා)
        const search = await ytSearch(query);
        if (!search || !search.videos.length) {
            return c.json({ status: false, message: "No results found." }, 404);
        }

        const video = search.videos[0];
        const videoId = video.videoId;
        const title = video.title;
        const finalName = customName || title;

        // 2. Powerful Proxy Downloader Links (වැඩ කරන බව තහවුරුයි)
        // මේ ලින්ක්ස් වලට සර්වර් එකෙන් fetch කරන්න ඕනේ නැහැ, කෙලින්ම bot එකට දෙන්න පුළුවන්.
        const dlLink = `https://api.vkrfork.com/api/yt?url=https://www.youtube.com/watch?v=${videoId}`;
        const mp3Link = `https://api.vkrfork.com/api/yt?url=https://www.youtube.com/watch?v=${videoId}`; // මෙතන අපි logic එක වෙනස් කරනවා

        return c.json({
            status: true,
            creator: "xCHAMi MD",
            result: {
                title: title,
                id: videoId,
                thumbnail: video.thumbnail,
                duration: video.timestamp,
                fileName: finalName,
                // API එකෙන් Fetch නොවී කෙලින්ම ඩවුන්ලෝඩ් ලින්ක් එක හැදීම
                video: {
                    url: `https://www.y2mate.com/youtube/${videoId}`, // Fallback for direct download
                    direct_url: `https://invidious.flokinet.to/latest_version?id=${videoId}&itag=22`,
                    quality: "720p"
                },
                mp3: {
                    url: `https://invidious.flokinet.to/latest_version?id=${videoId}&itag=140`,
                    mimetype: "audio/mpeg",
                    fileName: `${finalName}.mp3`
                },
                recording: {
                    url: `https://invidious.flokinet.to/latest_version?id=${videoId}&itag=140`,
                    ptt: true
                },
                document: {
                    url: `https://invidious.flokinet.to/latest_version?id=${videoId}&itag=140`,
                    fileName: `${finalName}.mp3`
                }
            }
        });

    } catch (err) {
        return c.json({ 
            status: false, 
            message: "Something went wrong.",
            error: err.message 
        }, 500);
    }
});

Deno.serve(app.fetch);
