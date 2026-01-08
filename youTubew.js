// main.ts
import { Hono } from 'npm:hono';
import ytdl from 'npm:@distube/ytdl-core'; 
import ytSearch from 'npm:yt-search';

const app = new Hono();

// ඉතා වැදගත්: ඔයාගේ YouTube Cookies මෙතනට දාන්න (JSON string එකක් විදියට)
// Cookies නැතුව වැඩ නොකරයි නම් පමණක් මෙය පාවිච්චි කරන්න
const COOKIES = [[
{
    "domain": ".youtube.com",
    "expirationDate": 1799982472.402142,
    "hostOnly": false,
    "httpOnly": false,
    "name": "__Secure-1PAPISID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "_5xsd9fRPIHJNyxZ/A6OH_-PJRZXUJjSZ7",
    "id": 1
},
{
    "domain": ".youtube.com",
    "expirationDate": 1799982472.403975,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-1PSID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "g.a0004QgMMvAFElBkXVwQOI5yqASA2ROjyoP9H8NNzg4aOFXIqUndGbDU6mqiS2vKaTRwYalxKQACgYKARASARYSFQHGX2Miq68lPq8yzKzOAfxqsXWR2xoVAUF8yKoK_LuLld7HNrkeu16rXH7m0076",
    "id": 2
},
{
    "domain": ".youtube.com",
    "expirationDate": 1799420936.069014,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-1PSIDCC",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "AKEyXzU_o8DhXE_ZUTTYceuuPk3CQ2oYEE2y3vjVhsVi5MaUgIhwdTFUjr_W7dBwmnTALiTy5hk",
    "id": 3
},
{
    "domain": ".youtube.com",
    "expirationDate": 1799420934.786971,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-1PSIDTS",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "sidts-CjIBflaCdYIdff9HpNT0US7HjcX0bVFu5RoqgCplP22PUpkGaCGwMwn6-i18Vxt5LlUQkxAA",
    "id": 4
},
{
    "domain": ".youtube.com",
    "expirationDate": 1799982472.402318,
    "hostOnly": false,
    "httpOnly": false,
    "name": "__Secure-3PAPISID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "_5xsd9fRPIHJNyxZ/A6OH_-PJRZXUJjSZ7",
    "id": 5
},
{
    "domain": ".youtube.com",
    "expirationDate": 1799982472.404163,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "g.a0004QgMMvAFElBkXVwQOI5yqASA2ROjyoP9H8NNzg4aOFXIqUndRDGSXS4WEsNT4HG0w3RXNQACgYKAeASARYSFQHGX2Mi96LdGBKk9vd44E4EJwIPPRoVAUF8yKrNi_vpZwsoaEqyW70TFxo30076",
    "id": 6
},
{
    "domain": ".youtube.com",
    "expirationDate": 1799420936.06938,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSIDCC",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "AKEyXzVtD3J28MoWfAtSxx1ZHlzD37ehT3DXM2NclnxzIV4sCwPMvC9z2GX8O2QonGdXFFaawtc",
    "id": 7
},
{
    "domain": ".youtube.com",
    "expirationDate": 1799420934.787449,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSIDTS",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "sidts-CjIBflaCdYIdff9HpNT0US7HjcX0bVFu5RoqgCplP22PUpkGaCGwMwn6-i18Vxt5LlUQkxAA",
    "id": 8
},
{
    "domain": ".youtube.com",
    "expirationDate": 1799982472.401618,
    "hostOnly": false,
    "httpOnly": false,
    "name": "APISID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "EEhLzBuvE5cxwifb/AAT5JpHx2mOws1VtJ",
    "id": 9
},
{
    "domain": ".youtube.com",
    "expirationDate": 1767885528,
    "hostOnly": false,
    "httpOnly": false,
    "name": "CONSISTENCY",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "APeVyi-WNXWRnN2NN8_VhukNxKzAbAkE86bdB26xM1jMeotA2oKFMz4lR_fUFqvmEv_LGYezaPKYSrsCqAY6Fay9iUs-8yBEMKKk3CWZmPBEtRAQk7yzn7ASHy5qR7e6X_LFbKFiTtGQPc4YhwM3OYYn",
    "id": 10
},
{
    "domain": ".youtube.com",
    "expirationDate": 1799982472.400878,
    "hostOnly": false,
    "httpOnly": true,
    "name": "HSID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "AdvpyOVQnbyWfugvQ",
    "id": 11
},
{
    "domain": ".youtube.com",
    "expirationDate": 1783444013.82078,
    "hostOnly": false,
    "httpOnly": true,
    "name": "LOGIN_INFO",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "AFmmF2swRgIhAJsOxcfz3wr5AGcSa5Tfbgq_F1HLf969nGuKil4-R2w9AiEAjHCQlutI2t-bou28nNWfHrfDwCefAq-rC88oHK4CUnc:QUQ3MjNmd2hsek5TLUQwTm0yWjdIaS13Rk5GeFdXX3NXNS1oMmFNREdpTTBIMFlacUctc29iZlRWQXF0NktXRjA4UjlHMVFlZUZHNkYzanVzckZQY0xFNU5waWwyNnhHVmlvQWx0Y0pYRm9leXZJbV9XYy00S1o0WHZOWGoyb1Zjb2k3MkhJTy1zWFNycUQ1WUJtR25Icks2bEtEYWhHM1Bn",
    "id": 12
},
{
    "domain": ".youtube.com",
    "expirationDate": 1802444927.591704,
    "hostOnly": false,
    "httpOnly": false,
    "name": "PREF",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "tz=Asia.Colombo&f7=140&f6=40000000&f5=20000",
    "id": 13
},
{
    "domain": ".youtube.com",
    "expirationDate": 1799982472.401859,
    "hostOnly": false,
    "httpOnly": false,
    "name": "SAPISID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "_5xsd9fRPIHJNyxZ/A6OH_-PJRZXUJjSZ7",
    "id": 14
},
{
    "domain": ".youtube.com",
    "expirationDate": 1799982472.403762,
    "hostOnly": false,
    "httpOnly": false,
    "name": "SID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "g.a0004QgMMvAFElBkXVwQOI5yqASA2ROjyoP9H8NNzg4aOFXIqUndJ5YfbMURbQ7icLBFVmLXPwACgYKAf4SARYSFQHGX2Mi5YCahdnS0ujMsaL8GEj-6xoVAUF8yKpbM8-AdA59rtZxdTqKVCwn0076",
    "id": 15
},
{
    "domain": ".youtube.com",
    "expirationDate": 1799420936.067879,
    "hostOnly": false,
    "httpOnly": false,
    "name": "SIDCC",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "AKEyXzVbSCQnH5rEuHfE-No_sfrT6OT5jilqIRDY6KGlu4YWi94B_wIiso6Eh5nGIZym1eK0TA",
    "id": 16
},
{
    "domain": ".youtube.com",
    "expirationDate": 1799982472.401234,
    "hostOnly": false,
    "httpOnly": true,
    "name": "SSID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "Af9W8uDMpQyjNG00H",
    "id": 17
}
]]; // ඔයාගේ Cookies JSON එක මෙතන දාන්න

app.get('/', (c) => c.json({ status: true, message: "xCHAMi MD Ultra-Stable API Online 🚀" }));

app.get('/yt', async (c) => {
  const query = c.req.query('q');
  if (!query) return c.json({ status: false, message: "Query is required." }, 400);

  try {
    let videoUrl = query;
    if (!ytdl.validateURL(query)) {
      const search = await ytSearch(query);
      if (!search.videos.length) throw new Error("No results found.");
      videoUrl = search.videos[0].url;
    }

    // Extraction Options
    const options = {
      requestOptions: {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Cookie": COOKIES.length > 0 ? JSON.stringify(COOKIES) : "" // Cookies ඇත්නම් පමණක් යවයි
        }
      }
    };

    const info = await ytdl.getInfo(videoUrl, options);
    
    // formats තෝරාගැනීමේදී වඩාත් සරල ක්‍රමයක් භාවිතා කිරීම (Anti-Block)
    const audio = ytdl.filterFormats(info.formats, 'audioonly').sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0))[0];
    const video = ytdl.filterFormats(info.formats, 'audioandvideo').sort((a, b) => (b.width || 0) - (a.width || 0))[0];

    if (!audio) throw new Error("Audio extraction failed.");

    return c.json({
      status: true,
      creator: "xCHAMi MD",
      result: {
        title: info.videoDetails.title,
        thumbnail: info.videoDetails.thumbnails.pop()?.url,
        video: { url: video?.url || "No direct video link", quality: video?.qualityLabel || "720p" },
        mp3: { url: audio.url, mimetype: "audio/mpeg" },
        recording: { url: audio.url, ptt: true },
        document: { url: audio.url, fileName: `${info.videoDetails.title}.mp3` }
      }
    });

  } catch (err) {
    console.error("Critical Error:", err.message);
    return c.json({ 
      status: false, 
      message: "YouTube is blocking this request.", 
      error: err.message,
      tip: "Please provide valid YouTube Cookies to bypass this block."
    }, 500);
  }
});

Deno.serve(app.fetch);
