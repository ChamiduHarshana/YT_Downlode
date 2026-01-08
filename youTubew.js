// main.ts
import { Hono } from 'npm:hono';
import ytSearch from 'npm:yt-search';

const app = new Hono();

// DNS Error එක නැති බව තහවුරු කිරීමට Home route එක
app.get('/', (c) => c.json({ 
    status: true, 
    message: "xCHAMi MD Fixed API is Online! ✅",
    note: "DNS Fetching disabled for maximum stability."
}));

app.get('/yt', async (c) => {
    let query = c.req.query('q');
    const customName = c.req.query('name');

    if (!query) return c.json({ status: false, message: "Query is required." }, 400);
    
    // URL Encoding fix
    query = decodeURIComponent(query).replace(/\+/g, ' ');

    try {
        // 1. YouTube Search (මේක Deno සර්වර් එකේ අනිවාර්යයෙන් වැඩ කරයි)
        const search = await ytSearch(query);
        if (!search || !search.videos.length) {
            return c.json({ status: false, message: "No results found." }, 404);
        }

        const video = search.videos[0];
        const vId = video.videoId;
        const title = video.title;
        const finalName = customName || title;

        // 2. මෙතනදී අපි කරන්නේ සර්වර් එක ඇතුළේ Fetch කරන්නේ නැතුව, 
        // ඩවුන්ලෝඩ් එක සිද්ධ කරන වෙබ් අඩවියට අදාළ ලින්ක් එක සකස් කර දීම පමණයි.
        // එවිට DNS lookup එක සිද්ධ වෙන්නේ Bot එකේ හෝ Browser එකේ මිස Deno එකේ නොවේ.

        return c.json({
            status: true,
            creator: "xCHAMi MD",
            result: {
                title: title,
                id: vId,
                thumbnail: `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
                duration: video.timestamp,
                fileName: finalName,
                // ඩවුන්ලෝඩ් ලින්ක්ස් (මේවා DNS Error වලින් තොරයි)
                video: {
                    url: `https://y2mate.nu/en/download/?url=https://www.youtube.com/watch?v=${vId}`,
                    quality: "720p"
                },
                mp3: {
                    // කෙලින්ම MP3 ගන්න පුළුවන් stable සේවාවක්
                    url: `https://tomp3.cc/youtube/${vId}`,
                    mimetype: "audio/mpeg",
                    fileName: `${finalName}.mp3`
                },
                recording: {
                    url: `https://www.youtubepp.com/watch?v=${vId}`,
                    ptt: true
                },
                document: {
                    url: `https://www.youtubepp.com/watch?v=${vId}`,
                    fileName: `${finalName}.mp3`
                }
            }
        });

    } catch (err) {
        return c.json({ 
            status: false, 
            message: "Search Error", 
            error: err.message 
        }, 500);
    }
});

Deno.serve(app.fetch);
