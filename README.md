# Vasoya Meet — Executive Profile

Profile site of Vasoya Meet, Chief Executive Officer of [Hexafusion Infotech](https://www.hexafusioninfotech.com/), Surat.

Plain HTML/CSS/JS — no build step. Open `index.html` or deploy the folder to any static host (Vercel, Netlify, GitHub Pages).

```
index.html
assets/css/style.css   styles (dark theme, responsive)
assets/js/main.js      interactions + project list (edit the `projects` array to add sites)
assets/img/            portrait, share image + favicon
```

`/assets/*` is cached for 7 days (see `vercel.json`). When you change the CSS or JS, bump the `?v=` query in `index.html`; when you replace an image, give it a new filename.
