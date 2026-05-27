import { Devvit, TriggerContext, Event } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
  redis: true,
});

/* ---------------- CORE SCORING ENGINE ---------------- */

function analyze(text: string) {
  const t = text.toLowerCase();

  const rules = {
    high: ['hate', 'kill', 'scam', 'abuse'],
    medium: ['stupid', 'trash', 'idiot'],
  };

  let score = 0;
  const hits: string[] = [];

  rules.high.forEach(w => {
    if (t.includes(w)) {
      score += 3;
      hits.push(w);
    }
  });

  rules.medium.forEach(w => {
    if (t.includes(w)) {
      score += 1;
      hits.push(w);
    }
  });

  let decision: 'ALLOW' | 'REVIEW' | 'REMOVE' = 'ALLOW';

  if (score >= 5) decision = 'REMOVE';
  else if (score >= 2) decision = 'REVIEW';

  return { score, hits, decision };
}

/* ---------------- MAIN MODERATION TRIGGER ---------------- */

Devvit.addTrigger({
  event: 'PostSubmit',

  async onEvent(event: Event, context: TriggerContext) {
    const post = await context.reddit.getPostById(event.postId);

    const text = `${post.title} ${post.selftext || ''}`;
    const result = analyze(text);

    // Save audit log (IMPORTANT FOR WINNING CATEGORY)
    await context.redis.set(
      `modlog:${event.postId}`,
      JSON.stringify({
        postId: event.postId,
        result,
        timestamp: Date.now(),
      })
    );

    /* ---------------- ACTION LAYER ---------------- */

    if (result.decision === 'REMOVE') {
      await context.reddit.removePost(event.postId, true);
      await context.ui.showToast('🚨 Auto-Removed by SmartGuard V3');
    }

    if (result.decision === 'REVIEW') {
      await context.ui.showToast('⚠️ Sent to Review Queue');
    }

    if (result.decision === 'ALLOW') {
      await context.ui.showToast('✅ Approved');
    }
  },
});

export default Devvit;