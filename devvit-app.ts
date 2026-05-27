import { Devvit } from "@devvit/public-api";

/* ========== AI ENGINE ========== */
function analyze(text: string) {
  const t = text.toLowerCase();

  const toxic = ["hate", "kill", "stupid", "racist"];
  const mild = ["bad", "trash", "useless"];

  let score = 0;
  const hits: string[] = [];

  toxic.forEach(w => {
    if (t.includes(w)) {
      score += 3;
      hits.push(w);
    }
  });

  mild.forEach(w => {
    if (t.includes(w)) {
      score += 1;
      hits.push(w);
    }
  });

  if (t.includes("not bad")) score -= 1;

  let label = "SAFE";
  if (score >= 4) label = "TOXIC";
  else if (score > 0) label = "REVIEW";

  return {
    label,
    score,
    confidence: Math.min(0.97, 0.6 + score * 0.1),
    hits
  };
}

/* ========== MODERATION ACTION ========== */
Devvit.addMenuItem({
  label: "SmartGuard Analyze",
  location: "post",

  onPress: async (event, context) => {
    const post = event.target;
    const text = `${post.title} ${post.selftext || ""}`;

    const result = analyze(text);

    const id = Date.now().toString();

    await context.redis.set(`log:${id}`, JSON.stringify(result));

    if (result.label === "TOXIC") {
      await context.reddit.remove(post.id);
      context.ui.showToast("🚫 Removed by SmartGuard");
    }

    if (result.label === "REVIEW") {
      let q = JSON.parse(await context.redis.get("queue") || "[]");
      q.push(id);
      await context.redis.set("queue", JSON.stringify(q));

      context.ui.showToast("⚠ Sent to Review Queue");
    }

    if (result.label === "SAFE") {
      context.ui.showToast("✅ Approved");
    }
  }
});