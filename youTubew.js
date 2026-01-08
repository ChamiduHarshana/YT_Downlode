// main.ts
import { Hono } from 'npm:hono';
import ytdl from 'npm:@distube/ytdl-core'; 

const app = new Hono();

// Status Route
app.get('/', (c) => {
  return c.json({
    status: true,
    message: "xCHAMi MD Advanced YT API is Running! 🔥",
    methods: ["Video", "MP3", "Recording", "Document"]
  });
});

// Main API Endpoint
app.get('/yt', async (c) => {
  // 1. URL සහ Name ලබා ගැනීම
  const url = c.req.query('url');
  const customName = c.req.query('name'); // ඔයා දෙන නම

  if (!url || !ytdl.validateURL(url)) {
    return c.json({ status: false, message: "Invalid YouTube URL." }, 400);
  }

  try {
    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        }
      }
    });

    // විස්තර ලබා ගැනීම
    const title = info.videoDetails.title;
    const finalName = customName || title; // නමක් දුන්නේ නැත්නම් original video title එක ගන්නවා
    const thumbnail = info.videoDetails.thumbnails.pop()?.url;
    
    // Links ලබා ගැනීම
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
    const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });

    // Response එක ලස්සනට Format කරලා හදමු
    const result = {
      status: true,
      creator: "xCHAMi MD",
      result: {
        title: title,
        fileName: finalName, // Bot එකට යවන්න ඕන නම
        thumbnail: thumbnail,
        
        // 1. Video Downloader
        video: {
          type: "video",
          url: videoFormat.url,
          quality: videoFormat.qualityLabel,
          caption: `🎥 ${finalName}.mp4`
        },

        // 2. MP3 Downloader (Audio File)
        mp3: {
          type: "audio",
          url: audioFormat.url,
          mimetype: "audio/mpeg",
          fileName: `${finalName}.mp3`
        },

        // 3. Audio Recording (Voice Note/PTT)
        recording: {
          type: "ptt",
          url: audioFormat.url,
          ptt: true 
        },

        // 4. Document Downloader (File එකක් විදියට)
        document: {
          type: "document",
          url: audioFormat.url, // Audio එකම document එකක් විදියට
          mimetype: "audio/mpeg",
          fileName: `${finalName}.mp3` 
        }
      }
    };

    return c.json(result);

  } catch (error) {
    console.error("API Error:", error);
    return c.json({ status: false, message: "YouTube Error or Blocked.", error: error.message }, 500);
  }
});

Deno.serve(app.fetch);
