# Narration script

The film narrates itself with on-screen typography — that is the approach in
the reference and it is what is rendered in the MP4. This file is the same
narration written out as a spoken script, in case you want to record it and
lay a voice over the top.

Tone: you are presenting something you designed and built. Calm, clear,
confident. Not selling anything. Read it the way you would explain the system
to a manager who has never seen it.

## How to add a recorded voice-over

1. Record the lines below, keeping to the timecodes.
2. Export one **52-second** MP3 and save it as `public/audio/voiceover.mp3`.
3. In `src/GetwellAdminPromo.tsx`, find:

   ```ts
   export const VOICE_OVER = false;
   ```

   Change it to `true`.
4. Re-run the workflow. The music and sound effects duck automatically under
   the voice. Nothing else needs changing.

## Script

| In      | Out     | Line |
|---------|---------|------|
| 0:00.3  | 0:03.4  | Every patient comes with a hundred details. |
| 0:03.2  | 0:05.8  | And I watched them scatter across notebooks, spreadsheets and chats. |
| 0:06.0  | 0:07.8  | Records in three places. |
| 0:08.0  | 0:09.8  | Follow-ups slipping. |
| 0:10.0  | 0:11.8  | Numbers retyped by hand. |
| 0:12.3  | 0:15.6  | So I built Getwell Admin — a single system built around how the clinic actually works. |
| 0:16.2  | 0:20.6  | I put what the team checks first on one screen: today's appointments, who is due for follow-up, and where the programme stands. |
| 0:21.2  | 0:25.6  | I created one patient list, so nobody searches in three places. Search by name, ID or phone and open the record straight from the row. |
| 0:26.2  | 0:31.6  | I structured the profile so every visit and measurement lives on one page — weight, BMI, body composition, appointments and panel claims. |
| 0:32.2  | 0:36.6  | I made the system flag who is due and who is overdue, working it out from the last visit, with the follow-up message already written. |
| 0:37.2  | 0:40.6  | And I added reporting so the month adds itself up, straight from the visits and claims that are already recorded. |
| 0:41.2  | 0:45.4  | Every part is built around the same workflow: record, track, follow up, review. |
| 0:46.2  | 0:51.0  | Getwell Admin. A system I designed and built for a weight loss clinic. It started with too many details in too many places. |

Total runtime: **52.0 seconds**.

## Notes on accuracy

Every claim above is a function that exists in the application:

* **Dashboard** — KPI cards (total, active, due follow-up, panel patients),
  Today's Appointments, Patients Due for Follow-Up, Programme Overview.
* **Patients** — patient list with search by name, ID or phone; GW-XXXX IDs;
  panel / payment; current and goal weight; status; Add Patient.
* **Patient profile** — hero with programme start and last visit; Program
  Financial Summary; tabs for Overview, Visits, Body Composition,
  Appointments, Panel Claims and Files & Photos.
* **Follow-ups** — the app computes days since last visit, a suggested next
  visit date and a due / overdue / high-attention flag from configurable
  thresholds in Settings, and ships a prewritten follow-up message.
* **Body composition** — the app parses the clinic's Arboleaf "Body
  Composition Analysis" report and reads twelve core measurements from it, so
  the numbers do not have to be retyped.
* **Reports** — patient activity, panel performance (invoiced / claimed /
  balance) and suspended policies, calculated from recorded visits and claims.

Nothing in the narration describes a feature the application does not have.
