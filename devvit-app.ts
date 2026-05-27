import { Devvit } from '@devvit/public-api';

Devvit.addMenuItem({
  label: "SmartGuard Review",
  location: "post",

  onPress: async (event, context) => {
    const post = event.target;
    const text = `${post.title} ${post.selftext}`;

    const res = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const json = await res.json();
    const result = json.data;

    if (result.label === "TOXIC") {
      await context.reddit.remove(post.id);
      context.ui.showToast("Removed");
    } else if (result.label === "REVIEW") {
      context.ui.showToast("Sent to queue");
    } else {
      context.ui.showToast("Safe");
    }
  }
});