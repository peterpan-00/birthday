# 🎂 Private Interactive Birthday Website for Tanishka “Tanu” / “Mau” ❤️

A private, cinematic, full-stack birthday universe crafted for **Mau** by her family.

---

## 🌟 Overview & Experience Sequence

1. **Private Google Login (`/login`)**: Warm, cinematic, and mysterious sign-in portal.
2. **Song Selection (`/music`)**: Interactive soundtrack chooser before entering the memory journey.
3. **Cinematic Hero (`/birthday`)**: "Happy Birthday, Mau! 🎂✨" with ambient stardust and parallax.
4. **17+ Personal Photo Chapters**: Varied editorial layouts (Polaroid, Asymmetric, Floating, 3D Tilt, Fullscreen, Overlapping, Minimalist Whitespace, etc.) with Framer Motion scroll animations.
5. **Name Metamorphosis**: Typographic evolution: `Tanishka` → `Tanu` → `MAU ❤️`.
6. **Mau & Little Sister Section**: Dedicated memory showcase celebrating their inseparable bond.
7. **Interactive Easter Eggs**: Clickable celestial stars with hidden notes & secret letter reveal with pastel confetti.
8. **Final Emotional Letter**: Climax letter and keepsake photograph.
9. **Persistent YouTube Player**: Floating top-right glass badge (`♫ Playing` / `♫ Paused`) with uninterrupted background audio, volume slider, and change song controls.

---

## 🔒 Security & Privacy Architecture

### 1. Zero Public Photos
Personal family photographs are **never** placed in `/public` or directly addressable directories.
- **Local Development**: Photos are stored in the server-only `private/photos/` folder (gitignored).
- **Production**: The same protected endpoint can be connected to a private object-storage provider later; it must never use a public asset URL.

### 2. Strict Authentication & Authorization Proxy
Images are requested via logical identifiers (e.g., `/api/private/photos/mau-01`).
```text
Browser Request (/api/private/photos/mau-01)
     ↓
Clerk middleware checks the session
     ↓
Server verifies email against ALLOWED_GOOGLE_ACCOUNT_* allowlist
     ↓
Server validates photo ID against strict whitelist registry (Anti-Enumeration)
     ↓
Server streams private image with Cache-Control: private, no-store, max-age=0
```

### ⚠️ Privacy Boundary
> **Important Limitation**: While private storage and server authorization prevent unauthorized network access and crawler scraping of original files, any authorized viewer displaying content on their screen could theoretically capture screenshots.

---

## 🎵 Official YouTube IFrame Player Architecture

- Uses the official **YouTube IFrame Player API** (`https://www.youtube.com/iframe_api`).
- Does **not** scrape or extract raw audio streams.
- Provides uninterrupted continuous playback during long-form page scrolling.
- Global `MusicProvider` context maintains audio playback across page routes.
- Handles browser autoplay policies with friendly one-tap alert recovery (`“The soundtrack needs one little tap 🎵”`).
- Configured with security `origin` parameters matching development and production domains.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom editorial palette (warm creams, blush, lavender, plum, gold)
- **Animations**: Framer Motion & Canvas-Confetti
- **Icons**: Lucide React
- **Authentication**: Clerk with Google OAuth & Server-Side Allowlist Enforcement

## ⚙️ Environment Variables & Clerk Setup

Create a `.env.local` file in the project root:

```env
# Clerk configuration (copy these from Clerk Dashboard → API Keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/music

# Server-Side Allowed Google Accounts (Strict 2-Account Allowlist)
ALLOWED_GOOGLE_ACCOUNT_1=first@gmail.com
ALLOWED_GOOGLE_ACCOUNT_2=second@gmail.com

# YouTube Data API v3 Key (server-side ONLY)
YOUTUBE_API_KEY=your_youtube_data_api_v3_key

# Keep false while the story is being reviewed without family images.
# Set true only after the configured real photos are in private/photos/.
NEXT_PUBLIC_ENABLE_PRIVATE_PHOTOS=false
```

### 🔐 Clerk Auth Setup Step-by-Step

1. **Create a Clerk application**: Open the [Clerk Dashboard](https://dashboard.clerk.com) and create or select the application for this deployment.
2. **Enable Google**: In Clerk Dashboard, open **Configure → SSO connections → Google** and enable Google sign-in.
3. **Configure redirect URLs**:
   - Go to [Google Cloud Console](https://console.cloud.google.com).
     - Add the Clerk-provided callback URL to the OAuth client’s authorized redirect URIs.
4. **Set the server allowlist**: Add the two exact, lowercase Google addresses to `.env.local`. These variables are server-only and must not use the `NEXT_PUBLIC_` prefix.
5. **Test access**: An allowlisted, verified Google account can access `/music` and `/birthday`; every other account is redirected to `/unauthorized`.
6. **Deploy consistently**: Configure the same Clerk instance’s matching publishable/secret key pair and the two allowlist variables in each Vercel environment. Do not mix test and production keys.

---

## 🚀 Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📸 Adding Real Photographs

1. Place your private photographs into `private/photos/`:
   - `mau-01.jpg` (Hero photograph)
   - `mau-02.jpg` ... `mau-17.jpg` (Chapters)
   - `mau-18.jpg` (Secret surprise memory)
2. (Supports `.jpg`, `.jpeg`, `.png`, `.webp`, and `.avif`).
3. Every ID referenced in `src/config/birthday.ts` must have a real image. Missing images return a friendly loading error in the browser; the app never fabricates a family memory.
4. During design review, set `NEXT_PUBLIC_ENABLE_PRIVATE_PHOTOS=false`. The site renders intentional empty memory frames and does not request photo endpoints. Set it to `true` once the real image set is ready.

---

## 🎶 Soundtracks & Chapters

- **Soundtracks**: Search and select any song on the `/music` page via YouTube Data API v3 search.
- **Chapters & Messages**: Edit `src/config/birthday.ts` to customize chapter titles, captions, microcopy, sister section notes, or interactive star quotes.

---

## ☁️ Deployment to Vercel

1. Push code to a private GitHub repository.
2. Import project into [Vercel](https://vercel.com).
3. Under **Settings → Environment Variables**, add:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - `CLERK_SECRET_KEY`
   - `ALLOWED_GOOGLE_ACCOUNT_1`
   - `ALLOWED_GOOGLE_ACCOUNT_2`
   - `YOUTUBE_API_KEY`
4. Deploy and enjoy! 🎉

## 🔁 Clerk OAuth redirect configuration

The custom Google button starts the OAuth flow at `/sso-callback`; Clerk completes the exchange there and then sends the visitor to `/music`. Add the local and deployed site URLs to the Clerk dashboard's allowed redirect/origin configuration. Keep Google enabled as a social connection, and keep the two `ALLOWED_GOOGLE_ACCOUNT_*` values server-side only.

## ✅ Security checks before sharing

- Confirm `private/photos/` contains only real images and is not committed.
- Confirm an unauthenticated request to `/api/private/photos/mau-01` receives `401`; an authenticated but unapproved account receives `403`.
- Confirm photo responses include `Cache-Control: private, no-store`.
- Private delivery prevents network access by unauthorized visitors, but an authorized viewer can still capture what is displayed on screen.
