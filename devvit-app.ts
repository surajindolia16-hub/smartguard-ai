import { Devvit } from '@devvit/public-api';

Devvit.addTrigger({
  event: "PostSubmit",

  async handler(event, context) {
    const post = event.post;

    const text = `${post?.title || ""} ${post?.selftext || ""}`;

    // Send to backend moderation engine
    const response = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        postId: post?.id,
        subreddit: post?.subreddit?.name
      })
    });

    const result = await response.json();

    // If toxic → auto flag (Devvit action)
    if (result.label === "TOXIC") {
      await context.reddit.remove(post.id);
    }

    // If review → do nothing (send to mod queue)
    return result;
  }
});