// main.ts
import { Hono } from 'npm:hono';
import ytSearch from 'npm:yt-search';

const app = new Hono();

// සර්වර් එක වැඩද බලන්න (Home Page)
app.get('/', (c) => c.json({ status: true, message: "xCHAMi MD Bypass PRO Online 🛡️" }));

app.get('/yt', async (c) => {
    let query = c.req.query('q');
    const customName = c.req.query('name');

    if (!query) return c.json({ status: false, message: "Query required!" }, 400);
    query = decodeURIComponent(query).replace(/\+/g, ' ');

    try {
        // 1. YouTube Search (ඉක්මනින් Video එක සොයාගැනීම)
        const search = await ytSearch(query);
        if (!search.videos.length) return c.json({ status: false, message: "No results." }, 404);
        
        const video = search.videos[0];
        const videoId = video.videoId;
        const title = video.title;

        // 2. Invidious Instance Rotation (DNS Errors මගහැරීමට ස්ථාවර සර්වර්ස් 3ක්)
        // මේ සර්වර්ස් ලෝකයේ ඕනෑම තැනකට වැඩ කරනවා.
        const instances = [
            `https://invidious.flokinet.to/api/v1/videos/${videoId}`,
            `https://iv.melmac.space/api/v1/videos/${videoId}`,
            `https://invidious.privacydev.net/api/v1/videos/${videoId}`
        ];

        let videoData = null;
        let errorMsg = "";

        // එක සර්වර් එකක් බැරි වුනොත් අනිකට මාරු වෙනවා (Auto-fix)
        for (const url of instances) {
            try {
                const res = await fetch(url);
                if (res.ok) {
                    videoData = await res.json();
                    break; 
                }
            } catch (e) {
                errorMsg = e.message;
                continue;
            }
        }

        if (!videoData) throw new Error("All instances failed: " + errorMsg);

        // 3. Audio සහ Video ලිංක් වෙන් කරගැනීම
        // Invidious වල audio_formats සහ formatStreams වෙන වෙනම එනවා.
        const audioFile = videoData.adaptiveFormats.find(f => f.type.includes('audio/webm') || f.type.includes('audio/mp4'));
        const videoFile = videoData.formatStreams.find(f => f.quality === '720p') || videoData.formatStreams[0];

        const finalName = customName || title;

        return c.json({
            status: true,
            creator: "xCHAMi MD",
            result: {
                title: title,
                id: videoId,
                thumbnail: video.thumbnail,
                duration: video.timestamp,
                fileName: finalName,
                video: {
                    url: videoFile.url,
                    quality: videoFile.qualityLabel || "360p"
                },
                mp3: {
                    url: audioFile.url,
                    mimetype: "audio/mpeg"
                },
                recording: {
                    url: audioFile.url,
                    ptt: true
                },
                document: {
                    url: audioFile.url,
                    fileName: `${finalName}.mp3`
                }
            }
        });

    } catch (err) {
        console.error("API Error:", err.message);
        return c.json({ 
            status: false, 
            message: "YouTube Blocking is too high. Try again later.",
            error: err.message 
        }, 500);
    }
});

Deno.serve(app.fetch);
