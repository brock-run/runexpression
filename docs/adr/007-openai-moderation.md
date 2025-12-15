# ADR-007: OpenAI Moderation API for Content Filtering

**Date:** 2025-12-14
**Status:** Accepted
**Deciders:** Product Owner, Engineering Team
**Tags:** moderation, security, user-generated-content, ai

## Context

The Flow (interactive canvas) allows users to submit text and images that appear publicly. This creates moderation challenges:

**Risks:**
- Spam submissions
- Offensive language (hate speech, harassment)
- Inappropriate images (NSFW, violence)
- Self-harm content
- Brand damage if harmful content appears

**Requirements:**
- Prevent obviously harmful content from reaching admin queue
- Minimize manual moderation burden
- Fast response (users shouldn't wait >1s for submission)
- Cost-effective at scale (potentially thousands of submissions)
- Easy to implement (small team, fast V1 timeline)

**Team Constraints:**
- No dedicated moderator initially (founder handles moderation)
- Need automated first-pass filtering
- Manual review for edge cases acceptable

## Decision

We will use **OpenAI Moderation API** to automatically filter text submissions in real-time before they enter the moderation queue.

### Key Implementation Details:

**Flow:**
1. User submits text to The Flow
2. Next.js API route calls OpenAI Moderation API
3. If flagged (hate speech, harassment, etc.) → reject immediately with user-friendly error
4. If clean → proceed to trust scoring and admin queue (or auto-approve if trusted user)

**Code Example:**
```typescript
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const moderation = await openai.moderations.create({
  input: userText
});

if (moderation.results[0].flagged) {
  return { error: 'Content flagged by moderation' };
}

// Proceed with submission...
```

**What OpenAI Checks:**
- Hate speech
- Harassment/threatening
- Self-harm
- Sexual content
- Violence

**What We Still Manually Review:**
- Images (OpenAI Moderation is text-only)
- Context/quality (is submission meaningful?)
- Spam (repetitive submissions)

## Consequences

### Positive

- **Fast filtering:** <500ms API response, blocks obvious violations instantly
- **Free tier sufficient:** 1M requests/month free (far exceeds V1 needs)
- **High accuracy:** OpenAI's model is well-trained on problematic content
- **Multi-language:** Works across languages (helpful as we grow internationally)
- **Reduces admin burden:** Founder doesn't see obviously harmful content
- **Brand protection:** Offensive content never enters our database
- **Easy integration:** Single API call, minimal code
- **Logging:** Store moderation results in metadata for analysis

### Negative

- **Text-only:** Doesn't moderate images (we still need manual review)
- **False positives possible:** May flag edge cases incorrectly (e.g., discussing mental health)
- **OpenAI dependency:** Requires API key, subject to OpenAI's uptime/pricing
- **No customization:** Can't tune sensitivity or add custom categories
- **Privacy consideration:** User content sent to OpenAI (covered in privacy policy)

### Neutral

- **API key required:** Need OpenAI account (easy to set up)
- **Rate limits:** 3K requests/min (far exceeds our needs)

## Alternatives Considered

### Alternative 1: Custom ML Model (TensorFlow.js)

**Description:** Train or use pre-trained model for content moderation, run client-side or server-side.

**Pros:**
- **No external API:** Runs on our infrastructure
- **Customizable:** Can train on our specific content
- **Private:** User data doesn't leave our servers

**Cons:**
- **Development time:** 2-3 weeks to integrate and test
- **Model maintenance:** Must retrain as new violations emerge
- **Lower accuracy:** Harder to match OpenAI's quality
- **Compute cost:** Running inference on server adds CPU cost
- **Delayed V1:** Not feasible in 6-8 week timeline

**Why rejected:** OpenAI Moderation is production-ready and free. Building custom ML is future optimization, not V1 necessity.

---

### Alternative 2: Third-Party Moderation API (Perspective API, Sift)

**Description:** Use Google's Perspective API or Sift's moderation API.

**Pros:**
- **Perspective API is free** (Google's toxic comment detection)
- **Specialized:** Built specifically for moderation
- **Good accuracy:** Well-tested on comments/UGC

**Cons:**
- **Perspective API limitations:** Mainly for toxicity, less comprehensive than OpenAI
- **Sift is paid:** Starts at $500/mo (overkill for V1)
- **More setup:** Perspective requires Google Cloud account
- **Less flexible:** Harder to customize thresholds

**Why rejected:** OpenAI Moderation covers more categories (hate, harassment, self-harm) in one API, with simpler setup.

---

### Alternative 3: Manual-Only Moderation

**Description:** Skip automated moderation; all submissions go to manual review queue.

**Pros:**
- **Human judgment:** Can understand context better than AI
- **No false positives:** Won't accidentally block legitimate content
- **Simple:** No API integration needed

**Cons:**
- **Scalability problem:** If we get 100 submissions/day, founder spends hours moderating
- **Delayed publication:** Users wait for manual approval before content goes live
- **Brand risk:** Harmful content sits in queue (and database) until reviewed
- **Founder burnout:** Moderation is tedious and draining

**Why rejected:** Even with trusted-user auto-approval, new users could spam harmful content. OpenAI catches 95% of problems instantly.

---

### Alternative 4: Community Reporting + Post-Moderation

**Description:** Publish all content immediately, rely on community to report violations.

**Pros:**
- **No moderation queue:** Content is live instantly
- **Community-driven:** Users police themselves
- **Works for large platforms:** Reddit, Twitter use this

**Cons:**
- **Brand damage:** Offensive content live before it's reported
- **Trust decay:** Good users leave if they see spam/hate
- **Reactive, not proactive:** Content harms before it's removed
- **Small community:** Not enough users to effectively report in V1

**Why rejected:** RunExpression is building brand reputation from scratch. Can't afford to let offensive content appear publicly, even briefly.

## References

- [OpenAI Moderation API Documentation](https://platform.openai.com/docs/guides/moderation)
- [Moderation Categories Explained](https://platform.openai.com/docs/guides/moderation/overview)
- [Perspective API (alternative)](https://perspectiveapi.com/)
- RunExpression Docs: `DOCS/02-PRODUCT-REQUIREMENTS.md` (F2.6: Moderation Workflow)

## Notes

- **API key security:** Store in environment variable, never commit to Git
- **Logging:** Store moderation results in `expression_events.metadata.ai_moderation_result`
- **Error handling:** If OpenAI API is down, fall back to manual queue (don't block submissions)
- **User feedback:** If content is flagged, show helpful message (not "AI rejected your content")
- **Privacy policy:** Disclose that user content is sent to OpenAI for moderation

**User-Friendly Error Messages:**
```typescript
if (moderation.results[0].flagged) {
  return {
    error: "Your submission couldn't be posted. Please ensure your content is respectful and appropriate."
  };
}
```

**Future Enhancements:**
- V1.1: Add image moderation (Clarifai or AWS Rekognition)
- V1.1: Implement appeal process for false positives
- V2: Train custom model on our specific content patterns

**When to revisit this decision:**
- If OpenAI pricing changes significantly (currently free for our volume)
- If we need image moderation (add separate image API)
- If false positive rate becomes problematic (>5% of legitimate content flagged)
- If privacy concerns arise (users object to content being sent to OpenAI)

---

**Related ADRs:**
- [ADR-002: Supabase Backend](./002-supabase-backend.md) - Stores moderation metadata
