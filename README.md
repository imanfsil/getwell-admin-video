# Getwell Admin — project presentation film

A Remotion project that renders a **52-second presentation film** about the
Getwell Weight Loss Admin system: the problem it was built for, and how each
part of it works. Original score and sound design, no sales pitch.

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

Ten scenes, cut to a 120 BPM score — every transition, impact and reveal lands
on a beat.

| Time | Scene | What happens |
|------|-------|--------------|
| 0:00–0:03 | **The problem** | "Every patient comes with a **hundred details.**" Fragments of a clinic's day — patient rows, appointment cards, sticky notes, WhatsApp messages, spreadsheet pages, missed-visit alerts — start flying in and piling up. |
| 0:03–0:06 | | "And I watched them **scatter** across notebooks, spreadsheets and chats." The pile keeps growing and starts to blur. |
| 0:06–0:12 | | Three observations, one every two seconds, with an RGB-split glitch on each: "Records in three places." · "Follow-ups slipping." · "Numbers retyped by hand." The screen turns red-hot, the cards jitter, then everything is sucked into the centre. |
| 0:12–0:16 | **What I built** | Impact, white flash, silence-then-drop. The logo lands, "So I built **Getwell Admin.**", and the application flies in through 3D perspective with a light sweep across the glass. |
| 0:16–0:21 | **The dashboard** | "I put what the team checks first on **one screen.**" KPI cards land one by one, counters run up, the cursor hovers *Due follow-up* and it pulses. |
| 0:21–0:26 | **Patient records** | "I created **one patient list,** so nobody searches in three places." The cursor clicks the search field, types "Nurul", the list filters and the matching row lights up. |
| 0:26–0:32 | **The patient profile** | "I structured the profile so every visit and measurement lives **on one page.**" The camera pushes in, the weight chart draws itself, body-composition lines cross, and the totals count up. |
| 0:32–0:37 | **Appointments** | "I made the system flag who is **due** and who is **overdue.**" Today's schedule populates, *No show* flashes amber, an overdue follow-up row is ringed in red and *Follow Up Now* pulses. |
| 0:37–0:41 | **Reporting** | "I added reporting so the month **adds itself up.**" Revenue bars grow, panel claims fill in, the claims-settled ring sweeps to 84%. |
| 0:41–0:46 | **How it fits together** | The camera pulls all the way back and the single window becomes five, fanned out in 3D. "Every part built around **the same workflow.**" · Record. · Track. · Follow up. · Review. |
| 0:46–0:52 | **Close** | The system settles behind the wordmark. "Getwell Admin" · "A system I designed and built for a weight loss clinic." · "It started with too many details in too many places." |

A chapter bar runs along the bottom for the whole film — **The problem ·
What I built · How it works · The system** — with a live progress strip.

Every statement in the film describes a function that exists in the
application. `VOICEOVER-SCRIPT.md` lists each claim against the feature it
refers to.

---

## Motion language

Camera push-ins and pull-outs, 3D perspective and parallax, masked word-by-word
type reveals, blur-to-sharp entrances, staggered card entrances, sliding
navigation highlight, real page-to-page transitions inside the window (the old
page slides and blurs out while the new one slides in behind a loading bar),
animated cursor with click ripples, number counters, self-drawing charts, glow
pulses, light sweeps, drifting particles and film grain.

There is **one** application window for the whole product act. The camera moves
around it and the pages change inside it, which is what makes it read as
somebody using the software rather than a slideshow of screenshots.

---

## Sound

`public/audio/soundtrack.mp3` was **generated from scratch for this project** —
synthesised sample by sample, not sourced from a library — so there is nothing
to license, nothing to attribute and no watermark.

* **Score** — original 120 BPM piece in A minor. Six bars of tension (low
  drone, a clock tick that speeds up, glitch stabs, a riser), the drop at 0:12,
  a full groove through the product tour with the arrangement changing at every
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

The narration is carried by the on-screen typography, so the film works with
no spoken track. If you want to record one, `VOICEOVER-SCRIPT.md` has the same
narration written out as a spoken script with timecodes, and a one-line switch
to turn it on.

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
* To change wording, numbers or timing: the copy lives in the `CAPTIONS`
  array, the `Stamp` calls in `ActProblem`, the `CHAOS_COPY` table and the
  `ActProduct` / `ActCta` components. Every cut point is a single number in the
  `T` object near the top of the file.
* `webapp/` holds the Getwell Weight Loss Admin web app itself, unchanged. It
  is included for reference — the render does not read from it, so you can
  delete the folder if you only want the video project.
