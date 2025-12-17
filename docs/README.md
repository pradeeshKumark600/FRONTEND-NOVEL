# தேன்தமிழ் அமுது நாவல்கள் (TheanTamil Amuthu Novels)

A modern, responsive web application for reading Tamil novels online. Built with React, Vite, and TailwindCSS.

## 🌟 Features

- **Bilingual Support**: Read novels in Tamil or English
- **Multiple Novels**: Browse and read various Tamil novels
- **Chapter Navigation**: Easy navigation between chapters
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Modern UI**: Beautiful interface with smooth animations
- **User Authentication**: Secure login/signup system
- **Reading Progress**: Track your reading progress

## 📚 Available Novels

1. **Novel 1**: தாய் மடியிலே அமுது (Thaai Madiyile Amuthu)
2. **Novel 2**: தாலாட்டும் தாழம்பூவே (The Lullaby of the Temple Flower) - 27 Chapters (Fully Translated)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd theantamil-amuthu-novels-master
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.2
- **Styling**: TailwindCSS 3.4.17, SASS
- **Animations**: Framer Motion, GSAP
- **Routing**: React Router DOM
- **UI Components**: Swiper (carousels)

## 📂 Project Structure

```
theantamil-amuthu-novels/
├── src/
│   ├── assets/          # Images, icons, and static files
│   ├── components/      # React components
│   │   ├── common/      # Reusable components
│   │   └── layout/      # Layout components (Header, Footer)
│   ├── utils/           # Utility functions and chapter data
│   │   └── chapters/    # Tamil and English chapter content
│   │       ├── novel-1.js
│   │       ├── novel-2.js
│   │       └── english/ # English translations
│   ├── pages/           # Page components
│   ├── styles/          # Global styles
│   └── main.jsx         # Application entry point
├── public/              # Public assets
├── scripts/             # Build and utility scripts
├── docs/                # Project documentation
├── translations/        # Translation output files
└── dist/                # Production build output
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📖 Translation Scripts

Located in the `scripts/` folder:

- `translate-chapters.cjs` - Translate Tamil chapters to English using Google Translate API
- `extract-chapters-*.cjs` - Extract chapters from source files to JSON
- `add-translations-to-novel.cjs` - Add translated chapters to English novel files
- `verify-translations.cjs` - Verify translation completeness

### Running Translation

```bash
node scripts/translate-chapters.cjs
```

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎨 Color Scheme

- Primary: Gold/Yellow tones
- Background: Cream/Beige
- Text: Dark brown
- Accents: Traditional Tamil aesthetic

## 📄 Documentation

Detailed documentation is available in the `docs/` folder:

- [Project Structure Overview](docs/PROJECT_STRUCTURE_OVERVIEW.md)
- [Responsive Design Guide](docs/RESPONSIVE_DESIGN_REFERENCE.md)
- [Translation Setup](docs/TRANSLATION_SETUP.md)
- [Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Translate API for translation services
- Tamil literature community
- All contributors and readers

## 📞 Contact

For questions or support, please open an issue on the repository.

---

Made with ❤️ for Tamil literature enthusiasts
