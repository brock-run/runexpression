# ADR-008: Client-Side Image Compression

**Date:** 2025-12-14
**Status:** Accepted
**Deciders:** Product Owner, Engineering Team
**Tags:** performance, images, user-experience, cost-optimization

## Context

The Flow and DWTC Clubhouse allow users to upload images:
- Flow: Post-run photos (shoes, trails, moments)
- Clubhouse: Race photos, group runs, events

**Image Upload Challenges:**
- Modern phone cameras produce 5-10MB images
- Users upload from mobile (slow cellular networks)
- Supabase Storage has 1GB free tier limit
- Large images slow page load times
- CDN bandwidth costs scale with file size

**Requirements:**
- Accept images from any device (iPhone, Android, DSLR)
- Display images quickly on The Flow wall (~50+ images)
- Minimize storage costs
- Fast upload experience (mobile users shouldn't wait 30+ seconds)
- Maintain acceptable image quality

**Example:**
- User uploads 8MP iPhone photo: ~6MB raw
- Displayed on wall at 600x400px
- Storing 6MB wastes 90% of storage (only need ~400KB)

## Decision

We will **compress images client-side** (in the browser) before uploading to Supabase Storage.

### Key Implementation Details:

**Library:** `compressorjs` (or `browser-image-compression`)

**Compression Settings:**
- **Max width:** 1920px (4K displays still look good)
- **Quality:** 0.8 (JPEG quality, good balance)
- **Format:** Convert to JPEG (even if uploaded PNG)
- **Target size:** ~400KB (down from 5-10MB)

**Code Example:**
```typescript
import Compressor from 'compressorjs';

new Compressor(file, {
  quality: 0.8,
  maxWidth: 1920,
  success(compressedFile) {
    // Upload to Supabase Storage
    await supabase.storage.from('uploads').upload(path, compressedFile);
  },
  error(err) {
    console.error('Compression failed:', err);
  }
});
```

**Workflow:**
1. User selects image file (5MB)
2. Browser compresses to ~400KB
3. Upload compressed version
4. Progress bar shows upload status
5. Store public URL in database

## Consequences

### Positive

- **10-20x storage savings:** 5MB → 400KB per image (huge cost reduction)
- **Faster uploads:** 400KB uploads in 1-2s vs 30s for 5MB on 3G
- **Better UX:** Users see progress bar complete quickly
- **Faster page loads:** Flow wall with 50 images loads in <2s vs 10s+
- **Free tier lasts longer:** 1GB Supabase Storage = 2500 images vs 200 without compression
- **Lower bandwidth costs:** CDN serves 20x less data
- **Works offline-first:** Compression happens locally, even on spotty connection

### Negative

- **Quality loss (minor):** 0.8 JPEG quality is good, but not lossless
- **Client-side processing:** Older phones may take 1-2s to compress (acceptable)
- **Browser dependency:** Requires JavaScript enabled (acceptable trade-off)
- **EXIF data stripped:** Metadata (GPS, camera info) removed (good for privacy, bad if wanted)

### Neutral

- **Disk space usage (temporary):** Compressed file held in memory briefly
- **Not needed for small images:** If user uploads 100KB image, compression may not help much

## Alternatives Considered

### Alternative 1: Server-Side Compression (via API Route)

**Description:** Accept raw upload, compress on server (Node.js with Sharp library).

**Pros:**
- **Reliable:** Server has consistent performance (no old phone problem)
- **More control:** Can create multiple sizes (thumbnail, medium, large)
- **Works without JS:** Graceful degradation for no-JS users

**Cons:**
- **Serverless cold starts:** First request slow (~2-5s to start function)
- **Upload full file first:** User uploads 5MB, then server compresses (wastes bandwidth)
- **Compute cost:** Serverless functions bill for execution time
- **Complexity:** Need to manage temp storage, streaming, errors
- **Slower UX:** User waits for upload THEN compression

**Why rejected:** Client-side compression happens *before* upload, saving bandwidth and time. Server-side is better for advanced use cases (multiple sizes), but overkill for V1.

---

### Alternative 2: Supabase Image Transformation API

**Description:** Upload original, use Supabase's built-in image transformation on-the-fly.

**Pros:**
- **No compression needed:** Store original, serve compressed via URL param
- **Multiple sizes:** Can request different sizes dynamically
- **Lazy processing:** Only compress when requested

**Cons:**
- **Storage cost:** Still store full 5MB original (doesn't solve free tier limit)
- **Transform limits:** Supabase charges for transformations beyond free tier
- **Upload still slow:** User uploads full 5MB file
- **Not available on free tier:** Image transformations are Pro plan feature ($25/mo)

**Why rejected:** Client-side compression solves both storage and upload speed, with no ongoing costs.

---

### Alternative 3: External Image CDN (Cloudinary, ImageKit)

**Description:** Upload to specialized image CDN that handles compression, optimization, transformations.

**Pros:**
- **Professional optimization:** Best-in-class compression algorithms
- **Advanced features:** Face detection, art direction, format conversion (WebP, AVIF)
- **CDN included:** Global delivery, caching

**Cons:**
- **Cost:** Free tiers limited (Cloudinary: 25GB bandwidth/mo, then $0.08/GB)
- **Complexity:** Another service to integrate, manage, bill
- **Vendor lock-in:** Images stored with third party
- **Overkill:** We don't need advanced features for V1

**Why rejected:** Supabase Storage + client-side compression is simpler and free. Can migrate to Cloudinary if image features become critical.

---

### Alternative 4: No Compression (Accept Large Files)

**Description:** Accept images as-is, rely on Supabase Storage and user's connection.

**Pros:**
- **Simplest:** No compression code needed
- **Highest quality:** Users' images preserved exactly

**Cons:**
- **Poor UX:** 5MB uploads take 20-30s on slow connections
- **Storage limit hit fast:** 1GB = ~200 images (will hit free tier in weeks)
- **Slow page loads:** Flow wall would take 10+ seconds to load
- **High cost:** Would need paid Supabase plan ($25/mo) almost immediately

**Why rejected:** Accepting large files creates terrible UX and costs money. Compression solves both for ~50 lines of code.

## References

- [Compressor.js Documentation](https://github.com/fengyuanchen/compressorjs)
- [Browser Image Compression (alternative)](https://github.com/Donaldcwl/browser-image-compression)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)
- RunExpression Docs: `DOCS/03-TECHNICAL-DESIGN.md` (File Storage & Media Handling)

## Notes

- **Quality testing:** Test compression with race photos to ensure quality acceptable
- **Format conversion:** Always convert to JPEG (even PNG uploads) for consistency
- **Error handling:** If compression fails, allow original upload but warn user
- **Progress UX:** Show two stages: "Optimizing image..." then "Uploading..."
- **Mobile optimization:** Compressor.js works well on iOS/Android

**Compression Settings Justification:**
- **maxWidth: 1920px** — Retina displays (2x) show 960px images beautifully
- **quality: 0.8** — Sweet spot for file size vs quality (0.7 = visible artifacts, 0.9 = minimal savings)

**Future Enhancements:**
- V1.1: Generate thumbnails for gallery views (further savings)
- V1.1: Offer "HD" toggle for users who want full resolution
- V2: Create multiple sizes (thumbnail, medium, large) for responsive images

**When to revisit this decision:**
- If users complain about quality loss (can increase to 0.9)
- If we need advanced transformations (migrate to Cloudinary)
- If we add video uploads (need different compression strategy)

---

**Related ADRs:**
- [ADR-002: Supabase Backend](./002-supabase-backend.md) - Storage platform
