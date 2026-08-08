# Homepage update guide

The production homepage uses `index.html`, `index.css`, `index.js`, and `site-content.js`.

## Recommended event workflow

Use one public Google Calendar as the source of truth for gatherings:

1. Create a calendar owned by a role-based account such as `cmumuslimalumni@gmail.com`.
2. Give the current board permission to manage events.
3. Make this dedicated calendar public with **See all event details** access.
4. In Google Cloud, create a project and enable the **Google Calendar API**.
5. Create a standard API key. Restrict it to the **Google Calendar API** and to these website referrers:
   - `https://cmumuslimalumni.github.io`
   - `https://cmumuslimalumni.github.io/*`
   - `http://127.0.0.1:4173`
   - `http://127.0.0.1:4173/*` while testing locally
6. Paste that key into `calendar.apiKey` in `site-content.js`. The public calendar ID and subscription URL are already configured.

Once connected, the page requests the next four events and renders them in the site's custom agenda blocks. Changes made in Google Calendar appear automatically. Until then, `fallbackEvents` provides a small local list and automatically hides past entries.

## Updating highlights

Add a photo to `assets/Gallery Pics`, then add one item to the `highlights` list in `site-content.js`. Keep three to six strong highlights, ordered newest first. Upcoming events should never be copied into highlights; after an event, add a photo and a short retrospective title instead.

## Suggested publishing rhythm

- Google Calendar: update whenever an event is confirmed or changed.
- Highlights: add one strong image after meaningful events.
- Newsletter: publish on its own cadence and link the latest issue from the homepage.
- Leadership: update once per board transition.

This keeps the frequently changing information in two obvious places instead of scattered through the page markup.
