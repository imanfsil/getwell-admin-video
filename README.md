# Getwell Admin — project presentation film

A Remotion project that renders a **52-second project presentation film** for the
Getwell Weight Loss Admin web app, with an original score and sound design.

* Output: `out/getwell-admin-promo.mp4`
* Resolution: **1920 × 1080**
* Frame rate: **30 fps**
* Duration: **1560 frames = 52.00 seconds**
* Audio: **stereo, 44.1 kHz** — original music + synchronised sound design
* Composition ID: **`GetwellAdminPromo`**
* No watermarks of any kind.

---

## How to get your MP4 (6 steps)

1. **Extract the ZIP and upload everything inside it to your GitHub repository
   root** — the files *and* the `src`, `public` and `.github` folders.
2. Open your repository on GitHub and click the **Actions** tab.
3. In the left sidebar, click **Render Getwell Video**.
4. Click **Run workflow** (green button), then **Run workflow** again to confirm.
5. **Wait for the render to finish** — roughly 15–25 minutes. The job turns green.
6. Open the finished run, scroll to **Artifacts**, download
   **`getwell-admin-promo`** → inside is `getwell-admin-promo.mp4`.

### The one thing to check first

On your repository's main page you should see `package.json`, `src` and
`public` side by side. Click `public` → `audio` and confirm `music.mp3` and
`sfx.mp3` are there. GitHub's *"Add file → Upload files"* **file picker cannot
select folders** — drag and drop them instead, or push with Git:

```bash
cd path/to/the/extracted/folder
git init
git add .
git commit -m "Getwell Admin promo film"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/YOUR-REPO.git
git push -u origin main
```

The workflow checks for every required file *before* installing anything, and
tells you in plain English which one is missing — it will even unzip the ZIP or
lift a nested folder to the root if that is what went wrong.

---

## The story

Ten scenes, cut to the same 120 BPM score. The visuals, UI walkthrough and motion remain unchanged; the narrative now frames the film as a project I designed and built around an observed workflow problem.

| Time | Scene | What happens |
|------|-------|--------------|
| 0:00–0:03 | **Problem** | “Every patient comes with a hundred details.” The fragments of patient records, appointments, notes, messages, spreadsheets and alerts show the information being handled across different places. |
| 0:03–0:06 | | “I found those details across different places.” |
| 0:06–0:12 | **Workflow pain** | “Too many places.” · “Too many steps.” · “Too much to keep track of.” The visual pressure builds exactly as before. |
| 0:12–0:16 | **Build** | “So I built Getwell Admin.” The same impact reveal and application entrance are retained, followed by “I wanted one workflow, shaped around how the team actually works.” |
| 0:16–0:21 | **Dashboard** | “I started with one clear overview.” The existing dashboard walkthrough, counters and focus treatment remain unchanged. |
| 0:21–0:26 | **Patients** | “I created a central patient list.” The same search interaction demonstrates finding a patient quickly. |
| 0:26–0:32 | **Patient profile** | “I structured each profile around key information.” The existing progress, body-composition and visit visuals remain unchanged. |
| 0:32–0:37 | **Appointments** | “I added tracking for visits, missed visits, and follow-ups.” The same appointment and follow-up interactions remain. |
| 0:37–0:41 | **Reports** | “I included reports for revenue and panel claims.” The existing report visuals remain unchanged. |
| 0:41–0:46 | **One workflow** | “Built around the workflow.” · “I built the system around the workflow.” The same multi-window fan-out is retained. |
| 0:46–0:52 | **Closing** | The same brand composition closes on “A workflow I designed from a real operational problem.” followed by “From scattered details to one connected workflow.” |

A chapter bar runs along the bottom for the whole film — **The problem ·
The solution · Inside Getwell · Getwell Admin** — with a live progress strip.

---

## Motion language

Camera push-ins and pull-outs, 3D perspective and parallax, masked word-by-word
type reveals, blur-to-sharp entrances, staggered card entrances, sliding
navigation highlight, real page-to-page transitions inside the window (the old
page slides and blurs out while the new one slides in behind a loading bar),
animated cursor with click ripples, number counters, self-drawing charts, glow
pulses, light sweeps, drifting particles and film grain.

There is **one** application window for the whole application walkthrough. The camera moves
around it and the pages change inside it, which is what makes it read as
somebody using the software rather than a slideshow of screenshots.

---

## Sound

`public/audio/soundtrack.mp3` was **generated from scratch for this project** —
synthesised sample by sample, not sourced from a library — so there is nothing
to license, nothing to attribute and no watermark.

* **Score** — original 120 BPM piece in A minor. Six bars of tension (low
  drone, a clock tick that speeds up, glitch stabs, a riser), the drop at 0:12,
  a full groove through the application walkthrough with the arrangement changing at every
  scene, and a lift for the closing brand moment.
* **Sound design** — around 140 individual effects: whooshes, notification
  dings, keyboard taps, UI pops, clicks, counter ticks, digital glitches,
  reverse swells, sub impacts and completion chimes. Every one sits on the exact
  frame of the thing it belongs to, because the picture and the audio were cut
  against the same 120 BPM grid.
* Mastered with a slow gain-rider and a soft limiter to −15.4 dB mean /
  −0.5 dB peak, so it is consistently loud with no clipping.

To use your own music instead, just replace `public/audio/soundtrack.mp3` with
a 52-second file of the same name.

### Voice-over

The film is designed to work without one — the typography narrates, exactly
like the reference. If you want a spoken track, `VOICEOVER-SCRIPT.md` has a
script timed to the cut and a one-line switch to turn it on.

---

## Project structure

```
package.json                   # scripts + pinned dependencies
package-lock.json              # matches package.json exactly
tsconfig.json
remotion.config.ts             # codec / quality settings + entry point
README.md
VOICEOVER-SCRIPT.md
.github/workflows/render.yml   # "Render Getwell Video" (manual run)
public/
  audio/
    soundtrack.mp3             # original score + sound design, premixed
src/
  index.ts                     # entry point — used by every script
  Root.tsx                     # registers the composition
  GetwellAdminPromo.tsx        # tokens, UI, all ten scenes, master timeline
```

Poppins is embedded in the source as base64, so the render never needs a
network request for fonts.

---

## Running it locally (optional)

```bash
npm install
npm run render        # writes out/getwell-admin-promo.mp4
npm start             # opens the Remotion Studio preview
npm run compositions  # must print: GetwellAdminPromo  30  1920x1080  1560 (52.00 sec)
npm run typecheck     # no output means no errors
```

---

## Notes

* The interface is rebuilt in React from the real app's `index.html`,
  `patients.html`, `patient-profile.html`, `appointments.html`, `reports.html`,
  `app.js` and `styles.css` — the same GETWELL sidebar with MAIN and MANAGEMENT
  groups, the same GW-XXXX patient IDs, the same KPI labels, badges, tables,
  Arboleaf body-composition metrics, RM currency and colour tokens
  (`#08142A`, `#2563EB`, `#EEF5FF`, `#F8FBFF`, `#D9E4F2`, `#64748B`).
* **No real patient data is used anywhere.** Every name, ID and figure is
  fictional demo content held in the `PATIENTS`, `TODAY_APPOINTMENTS`,
  `FOLLOW_UPS` and `CHAOS_COPY` arrays in `src/GetwellAdminPromo.tsx`.
* Nothing from the reference video is reused — no branding, text, layout,
  assets or audio. Only the *approach* to pacing and motion is shared.
* To change wording, numbers or timing: the copy lives in the `CAPTIONS`,
  `CHAOS_COPY` and scene components, and every cut point is a single number in
  the `T` object near the top of the file.
