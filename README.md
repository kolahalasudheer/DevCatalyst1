# Dev Catalyst Website

This site is data-driven. You can update content by editing JSON files and dropping images into the `public/` folder. No code changes required.

## Where to put files
- Event images: `public/events/`
- Gallery images: `public/gallery/`

Use absolute paths that start with `/` in JSON (e.g. `/events/hackathon-2025.jpg`).

## Data files to edit
- `public/data/events.json`
  - Structure:
  ```json
  {
    "upcoming": [
      {
        "title": "Hackathon 2025",
        "date": "2025-09-15",
        "description": "24-hour coding marathon with prizes.",
        "cta": "Learn More",
        "image": "/events/hackathon-2025.jpg",
        "category": "Hackathons"
      }
    ],
    "past": [
      {
        "title": "Beginner's Python Workshop",
        "date": "2025-02-10",
        "description": "Intro to Python programming.",
        "cta": "View Recap",
        "image": "/events/python.jpg",
        "category": "Workshops"
      }
    ]
  }
  ```
  - Categories supported for filters: `Hackathons`, `Workshops`, `Tech Talks`, `Seminars`.

- `public/data/gallery.json`
  - Structure:
  ```json
  [
    { "src": "/gallery/2025-hackathon-1.jpg", "alt": "Hackathon team at night" },
    { "src": "/gallery/2025-workshop-1.jpg", "alt": "Workshop session" }
  ]
  ```

## Local development
```bash
npm install
npm run dev
```
Visit the printed URL (e.g., http://localhost:5173). JSON is fetched at runtime; refresh after editing.

## Deployment (Netlify)
- Already configured via `netlify.toml`:
  - Build command: `npm run build`
  - Publish: `dist`
  - SPA redirects: all routes → `index.html`
- Connect repo to Netlify. Every push to `main` auto-deploys.

## Update flow (repeat)
1. Add images to `public/events/` or `public/gallery/`.
2. Edit `public/data/events.json` or `public/data/gallery.json`.
3. Commit and push.
4. Netlify builds and deploys automatically.

## Notes
- The site uses a safe fallback if JSON fails to load.
- Clear browser cache or hard refresh if you don’t see updates immediately.
