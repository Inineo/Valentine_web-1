# 💖 Valentine's Day Cinematic Scrapbook

An immersive, scroll-controlled digital scrapbook that transforms Valentine's Day memories into an interactive cinematic experience. Features romantic polaroids, handwritten notes, and physical textures layered over dynamically scrubbing flower bloom video.

## ✨ Use Case

This project is perfect for:

- **Digital Love Letters** - Create personalized romantic experiences for your significant other
- **Memory Preservation** - Transform photo collections into interactive storytelling experiences
- **Special Occasions** - Showcase relationship milestones, anniversaries, or proposals
- **Portfolio Piece** - Demonstrate advanced web animation and scroll-based interaction techniques
- **Wedding Gifts** - Design unique digital keepsakes for couples

## 🎯 Features

- **Scroll-Controlled Video Scrubbing** - Video playback synchronized with scroll position for cinematic control
- **Interactive Scrapbook Elements** - Polaroid photos and handwritten notes with parallax effects
- **3D Transforms & Animations** - Depth and dimension through perspective transformations
- **Floating Particle System** - Ambient hearts and sparkles that follow mouse movement
- **Audio Ambience** - Optional background music with fade controls
- **Responsive Design** - Optimized for all screen sizes and devices
- **Accessibility** - Respects `prefers-reduced-motion` for users with motion sensitivity
- **Smooth Performance** - Optimized rendering and throttled scroll handlers

## 🛠️ Tech Stack

### Core Framework
- **React 19** - UI component library
- **TypeScript** - Type-safe development
- **Vite 8** - Fast build tool and dev server

### Styling & Animation
- **Tailwind CSS 4** - Utility-first styling framework
- **Motion (Framer Motion) 12** - Advanced animation library
- **Custom CSS** - Hand-crafted effects and textures

### UI & Icons
- **Lucide React** - Modern icon library

### Development Tools
- **ESBuild** - Fast JavaScript bundler
- **TypeScript Compiler** - Static type checking
- **Autoprefixer** - CSS vendor prefixing

### Additional Libraries
- **@google/genai** - AI integration capabilities
- **Express** - Backend server (if needed)
- **dotenv** - Environment variable management

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Inineo/Valentine_web-1.git
cd Valentine_web-1
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Configure environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your API keys if needed
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:3000`

## 📦 Available Scripts

- **`npm run dev`** - Start development server on port 3000
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build
- **`npm run lint`** - Run TypeScript type checking
- **`npm run clean`** - Remove build artifacts

## 📂 Project Structure

```
valentine's-day-cinematic-scrapbook/
├── src/
│   ├── components/
│   │   ├── ValentineExperience.tsx    # Main orchestrator component
│   │   ├── ScrubVideo.tsx             # Scroll-controlled video
│   │   ├── ScrapbookLayer.tsx         # Scrapbook overlay system
│   │   ├── Polaroid.tsx               # Photo component
│   │   ├── PaperNote.tsx              # Handwritten note component
│   │   └── FloatingParticles.tsx      # Particle system
│   ├── data/
│   │   └── scrapbookData.ts           # Content configuration
│   ├── types.ts                        # TypeScript definitions
│   ├── App.tsx                         # Root component
│   ├── main.tsx                        # Entry point
│   └── index.css                       # Global styles
├── public/
│   ├── photos/                         # Polaroid images
│   └── videos/                         # Background video
└── package.json
```

## 🎨 Customization

### Adding Your Own Photos

Replace images in `public/photos/` with your own memories (recommended: 600x800px for polaroids)

### Updating Content

Edit `src/data/scrapbookData.ts` to customize:
- Photo captions
- Handwritten notes
- Positioning and rotation
- Animation timings

### Changing Video

Replace `public/videos/flower.mp4` with your own video (recommended: 10-30 seconds, 1080p)

### Styling

Modify `src/index.css` for global theme changes or component files for specific element styling.

## 🌐 Deployment

Build the project for production:

```bash
npm run build
```

Deploy the `dist/` folder to:
- **Vercel** - Automatic deployment with Git integration
- **Netlify** - Drag-and-drop or Git-based deployment
- **GitHub Pages** - Free static hosting
- **Firebase Hosting** - Google's hosting platform

## 📄 License

This project is open source and available for personal and commercial use.

## 💝 Credits

Created with love for celebrating special moments and relationships.

---

**Made with React, TypeScript, and Vite**
