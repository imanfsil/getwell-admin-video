# Getwell Admin Promo Video

A Remotion project that renders a **45-second promotional video** for the
Getwell Weight Loss Admin web app.

* Output: `out/getwell-admin-promo.mp4`
* Resolution: **1920 × 1080**
* Frame rate: **30 fps**
* Duration: **1350 frames = 45.00 seconds**
* Composition ID: **`GetwellAdminPromo`**

---

## What must be in your GitHub repository

The repository root has to look **exactly** like this — 6 files and 2 folders:

```
package.json                      <- must be at the TOP level
package-lock.json
tsconfig.json
remotion.config.ts
README.md
.gitignore
.github/workflows/render.yml
src/index.ts                      <- the entry point
src/Root.tsx
src/GetwellAdminPromo.tsx
```

> **The single most common mistake:** the `src` folder does not get uploaded.
> GitHub's "Add file → Upload files" **file picker cannot select folders** — you
> must *drag and drop* the extracted folder's contents onto the upload page, or
> use GitHub Desktop / `git push`. If `src/index.ts` is missing, the render
> fails with *"requires you to specify a entry point"*.
>
> This project's workflow now checks for that first and tells you plainly which
> file is missing — and it will even unzip the ZIP for you if you committed the
> ZIP itself, or lift the project up if you uploaded it inside a sub-folder.

**How to check in 5 seconds:** open your repository on GitHub. You should see
`package.json` and a `src` folder listed side by side on the main page. Click
`src` — it should contain `index.ts`, `Root.tsx` and `GetwellAdminPromo.tsx`.

---

## How to get your MP4 (6 steps)

1. **Extract the ZIP and upload everything inside it to your GitHub repository root**
   (drag and drop the files *and* the `src` / `.github` folders together).
2. Open your repository on GitHub and click the **Actions** tab.
3. In the left sidebar, click **Render Getwell Video**.
4. Click **Run workflow** (green button), then **Run workflow** again to confirm.
5. **Wait for the render to finish** — roughly 10–20 minutes. The job turns green.
6. Open the finished run, scroll to **Artifacts**, download
   **`getwell-admin-promo`** → inside is `getwell-admin-promo.mp4`.

---

## Easiest upload method (recommended)

Using Git on your own machine avoids the folder problem entirely:

```bash
cd path/to/the/extracted/folder
git init
git add .
git commit -m "Getwell Admin promo video"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/YOUR-REPO.git
git push -u origin main
```

---

## Running it locally (optional)

```bash
npm install
npm run render        # writes out/getwell-admin-promo.mp4
npm start             # opens the Remotion Studio preview
npm run compositions  # must print: GetwellAdminPromo  30  1920x1080  1350 (45.00 sec)
npm run typecheck     # no output means no errors
```

---

## Why this version cannot hit the old error

* The video is now **three files inside `src/`** instead of twenty — far less to
  lose during an upload.
* **No `public/` folder and no asset files.** Poppins is embedded in the source
  as base64, so there is nothing external to go missing and no network request
  during the render.
* `remotion.config.ts` calls `Config.setEntryPoint("./src/index.ts")`, so
  Remotion finds the entry point **even if the path argument is omitted**.
* The workflow verifies every required file *before* installing anything and
  fails with a plain-English message naming the missing file.

---

## Storyboard

| Time | Scene | On screen |
|------|-------|-----------|
| 0–4s | Intro | "Meet Getwell Admin" · "Smarter weight loss management." |
| 4–11s | Dashboard | KPI cards, today's appointments, follow-ups, programme overview — "Everything in one place." |
| 11–18s | Patients | Patient list, live search, row highlight — "Manage every patient with ease." |
| 18–26s | Patient Profile | Weight progress chart, BMI, body composition, visits — "Track progress, visits & results." |
| 26–33s | Appointments | Today's schedule, no-shows, patients due for follow-up — "Never miss a follow-up." |
| 33–39s | Reports | Revenue breakdown, panel performance, claims settled — "Turn patient data into action." |
| 39–45s | Final CTA | "Getwell Admin" · "Built for smarter weight loss care." · "Manage. Track. Grow." |

---

## Notes

* The interface in the video is rebuilt in React from the real app's
  `index.html`, `patients.html`, `patient-profile.html`, `appointments.html`,
  `reports.html`, `app.js` and `styles.css` — the same sidebar (MAIN /
  MANAGEMENT), the same GW-XXXX patient IDs, the same KPI labels, badges,
  tables, RM currency and colour tokens (`#08142A`, `#2563EB`, `#EEF5FF`,
  `#F8FBFF`, `#D9E4F2`, `#64748B`).
* **No real patient data is used.** Every name, ID and figure is fictional demo
  content, held in the `PATIENTS` / `TODAY_APPOINTMENTS` / `FOLLOW_UPS` arrays
  near the top of `src/GetwellAdminPromo.tsx`.
* To change wording or numbers, edit those arrays or the matching scene
  component in the same file, then re-run the workflow.
