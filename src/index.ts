import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { YoutubeTranscript } from "youtube-transcript";

const app = new Hono();

app.get("/", async (c) => {
  return c.json({ message: "hey" });
});

app.get("/transcript/:videoId", async (c) => {
  const videoId = c.req.param("videoId");
  if (!videoId) {
    return c.json({
      error: 'The "videoId" parameter is required and must be a string.',
    });
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    if (!transcript || transcript.length === 0) {
      return c.json({
        error: "No transcript found for the given video ID.",
      });
    }

    return c.json({
      youtubeId: videoId,
      transcript,
    });
  } catch (error: any) {
    console.log(error);
    return c.json({
      error: `An unexpected error occurred. ${error?.message}`,
    });
  }
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
