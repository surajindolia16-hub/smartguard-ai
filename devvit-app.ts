import { Devvit } from '@devvit/public-api';

Devvit.addTrigger({
  event: "PostSubmit",
  async handler(event, context) {
    const text = event.post?.selftext || "";

    await fetch("http://your-backend/api/ingest", {
      method: "POST",
      body: JSON.stringify({ text })
    });
  }
});