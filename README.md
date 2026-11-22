# Sushmit & Manaswita &mdash; Wedding Invitation

An elegant, modern, and responsive wedding invitation website for **Sushmit & Manaswita**, celebrating on **February 16, 2027** at **Beldhi Golf Course, Jamshedpur**.

---

## ✨ Features
- **Aesthetic**: Deep emerald green, warm gold accents, and soft cream palette reflecting a lush golf course setting.
- **Hero & Countdown**: Live countdown timer to February 16, 2027 (IST) with couple portrait.
- **Celebration Itinerary**: Detailed cards for Mehandi, Sangeet & Ring Ceremony, Haldi, and Wedding & Reception across Sonari West and Beldhi Golf Course.
- **Travel & Venues**: Connectivity details for Tatanagar Junction, Ranchi Airport, and Google Maps venue navigation.
- **Interactive RSVP**:
  - Guest and party size selector (1&ndash;10)
  - Events attendance checkboxes
  - Hotel accommodation assistance request
  - Ranchi &rarr; Jamshedpur cab coordination request
  - "Ready to dance?" interactive dance floor toggle
  - Live background sync to **Google Forms & Google Sheets**
  - Instant one-click **Add to Calendar (.ics)** download
- **Mobile First**: Zero horizontal overflow, WCAG AA contrast, and smooth scrolling.

---

## 🚀 Project Structure

```text
├── index.html              # Main invitation page
├── assets/
│   ├── couple-portrait.jpg # Hero portrait image
│   ├── main.js             # Live countdown, RSVP validation & Google Form integration
│   └── styles.css          # Compiled Tailwind CSS bundle
├── src/
│   └── input.css           # Tailwind v4 source styles & custom design tokens
├── package.json            # Build dependencies (@tailwindcss/cli)
└── .gitignore              # Ignores node_modules, build artifacts, and OS files
```

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start Tailwind watch mode
npm run dev

# Build production minified CSS
npm run build
```

---

## 🌐 Deployment
This static website is ready for 1-click deployment on **Vercel**, **Netlify**, or **GitHub Pages**.
