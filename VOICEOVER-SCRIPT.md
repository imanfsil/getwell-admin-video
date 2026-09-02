# Voice-over script (optional)

The film is written the same way the reference is: the on-screen typography
carries the narration and the score carries the emotion, so it works with **no
spoken voice at all**. If you want a voice-over as well, here is a script
timed to the cut.

## How to add it

1. Record (or have someone record) the lines below.
2. Export a single **52-second** MP3 with the lines starting at the timecodes
   shown, and save it as `public/audio/voiceover.mp3`.
3. Open `src/GetwellAdminPromo.tsx`, find this line near the bottom:

   ```ts
   export const VOICE_OVER = false;
   ```

   Change it to `true`.
4. Re-run the workflow. The music and effects duck automatically underneath
   the voice — nothing else needs changing.

Direction for the reader: confident, calm, modern, unhurried. Warm but not
salesy. Think product film, not advertisement.

## Script

| In      | Out     | Line |
|---------|---------|------|
| 0:01.0  | 0:05.4  | Every patient in a weight loss programme is a hundred small details. |
| 0:06.2  | 0:11.4  | And when those details live in books, spreadsheets and messages… things get missed. |
| 0:12.4  | 0:15.6  | Meet Getwell Admin. |
| 0:16.4  | 0:20.6  | One place to run your whole clinic — patients, visits, progress and follow-ups. |
| 0:21.4  | 0:25.6  | Find any patient in seconds, with everything about them on one screen. |
| 0:26.4  | 0:31.6  | Track weight, BMI and body composition across every visit, automatically. |
| 0:32.4  | 0:36.6  | See who is due, who is overdue, and who never came back. |
| 0:37.4  | 0:40.6  | And turn all of it into decisions you can act on. |
| 0:41.4  | 0:45.4  | Your whole clinic, working as one connected system. |
| 0:46.4  | 0:50.4  | Getwell Admin. Built for smarter weight loss care. |

Total runtime of the film: **52.0 seconds**.

## Shorter alternative (if you prefer fewer words)

| In      | Line |
|---------|------|
| 0:01.0  | Managing a weight loss clinic shouldn't mean juggling records, appointments and progress across a dozen places. |
| 0:12.4  | Meet Getwell Admin. |
| 0:16.4  | A smarter way to manage your patients, track their progress, and stay on top of every follow-up. |
| 0:32.4  | Everything your team needs, in one place. |
| 0:41.4  | So you can spend less time managing data… |
| 0:46.4  | …and more time managing care. |
