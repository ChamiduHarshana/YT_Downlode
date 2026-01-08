// main.ts
import { Hono } from 'npm:hono';
import ytdl from 'npm:@distube/ytdl-core'; 
import ytSearch from 'npm:yt-search';

const app = new Hono();

// User Agents List - මේකෙන් YouTube එක අපේ API එක block කිරීම වලක්වනවා
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
];

const getRandUA = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

app.get('/', (c) => c.json({ status: true, message: "xCHAMi MD Auto-Repair API Online 🛠️" }));

app.get('/yt', async (c) => {
  const query = c.req.query('q');
  const customName = c.req.query('name');

  if (!query) return c.json({ status: false, message: "Query is required." }, 400);

  // Retry Logic - 3 වතාවක් try කරයි
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      let videoUrl = query;

      // 1. Search Logic
      if (!ytdl.validateURL(query)) {
        const search = await ytSearch(query);
        if (!search.videos.length) throw new Error("No results found on YouTube.");
        videoUrl = search.videos[0].url;
      }

      // 2. Data Extraction
      const info = await ytdl.getInfo(videoUrl, {
        requestOptions: {
          headers: {
            "User-Agent": getRandUA(),
            "Accept": "*/*",
            "Connection": "keep-alive"
          }
        }
      });

      const formats = info.formats;
      
      // 3. Audio Extraction (with fallback)
      let audio = ytdl.chooseFormat(formats, { quality: 'highestaudio', filter: 'audioonly' });
      if (!audio) audio = formats.find(f => f.hasAudio);

      // 4. Video Extraction (with fallback)
      let video = ytdl.chooseFormat(formats, { quality: 'highest', filter: 'audioandvideo' });
      if (!video) video = formats.find(f => f.hasVideo && f.hasAudio);

      if (!audio || !video) throw new Error("Could not extract playable links.");

      // සාර්ථක නම් Response එක යවන්න
      return c.json({
        status: true,
        creator: "xCHAMi MD",
        result: {
          title: info.videoDetails.title,
          thumbnail: info.videoDetails.thumbnails.pop()?.url,
          fileName: customName || info.videoDetails.title,
          video: { url: video.url, quality: video.qualityLabel },
          mp3: { url: audio.url, mimetype: "audio/mpeg" },
          recording: { url: audio.url, ptt: true },
          document: { url: audio.url, fileName: `${customName || info.videoDetails.title}.mp3` }
        }
      });

    } catch (err) {
      attempts++;
      console.error(`Attempt ${attempts} failed: ${err.message}`);
      
      // අවසන් වතාවටත් බැරි වුනොත් පමණක් Error එක යවන්න
      if (attempts >= maxAttempts) {
        return c.json({
          status: false,
          message: "YouTube error after multiple retries.",
          error: err.message,
          autoFix: "Try again in 1 minute."
        }, 500);
      }
      
      // පොඩි වෙලාවක් ඉඳලා ආයෙත් Try කරන්න (Delay)
      await new Promise(res => setTimeout(res, 1000));
    }
  }
});

Deno.serve(app.fetch);
