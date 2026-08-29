# Chamindu Attanayaka — Animated DevOps Portfolio

A full one-page web version of the GitHub profile dashboard.

## Structure

```text
.
├── index.html
└── assets
    ├── css
    │   └── styles.css
    ├── js
    │   └── app.js
    └── img
        └── favicon.svg
```

## Run locally

No build tools are required.

### Option 1 — Open directly

Open `index.html` in a modern browser.

### Option 2 — Local HTTP server

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Deploy to GitHub Pages

1. Create a normal repository, for example `devops-portfolio`.
2. Upload all files from this package.
3. Commit and push to `main`.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Choose `main` and `/ (root)`.
7. Save.

The site will then be served by GitHub Pages.

## Animations

The website uses normal browser-supported CSS and JavaScript animations, including:

- cloud floating/glow animation
- moving network data packets
- animated terminal cursor
- rotating technology-logo orbit rings
- floating technology logos
- moving monitoring graph marker
- project progress and restart animations
- certification badge floating
- animated section scan lines
- canvas network particles
- scroll reveal transitions

Unlike a GitHub README SVG, these run as normal webpage animations.
