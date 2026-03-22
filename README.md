# Swayam Purwar — Developer Portfolio (SP.DEV)

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-purple?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock" alt="GSAP" />
  <img src="https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=threedotjs" alt="Three.js" />
  <img src="https://img.shields.io/badge/Lenis-black?style=for-the-badge" alt="Lenis Smooth Scroll" />
</p>

<p align="center">
  <strong>A highly interactive, 3D-enabled personal developer portfolio website.</strong><br/>
  Showcasing projects, case studies, and interactive web experiences <br/>
  with smooth animations and dynamic routing.
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧊 **3D Graphics** | Immersive 3D elements and web experiences powered by **Three.js**. |
| 🎞️ **Advanced Animations** | Complex timeline animations and seamless page transitions utilizing **GSAP**. |
| 🌊 **Smooth Scrolling** | Fluid, highly-optimized scroll behavior powered by **Lenis** studio-freight. |
| 🖱️ **Custom Interactions** | Custom cursor and hover states across interactive elements (buttons, project links, etc.). |
| 🔍 **Dynamic SEO** | Per-page metadata and SEO management using **React Helmet Async**. |
| 📁 **Case Studies** | Dedicated, detailed breakdown pages for major projects (Apple Music, Kite, Instagram, CodeSense AI). |
| ⚡ **Blazing Fast** | Built on **React 19** and bundled with **Vite** for instantaneous hot-module replacement and optimized builds. |

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Frontend Framework** | React 19 + Vite |
| **Routing** | React Router DOM v7 |
| **Animations** | GSAP (GreenSock Animation Platform) |
| **3D Rendering** | Three.js |
| **Scroll Engine** | Lenis |
| **SEO Management** | React Helmet Async |
| **Linting** | ESLint 9 + React Plugins |

## 📁 Project Structure

```text
SP.DEV/
├── public/
│   └── assets/
│       ├── docs/           # Resume PDF
│       └── images/         # UI assets, project previews, and profile pictures
├── src/
│   ├── assets/
│   │   └── css/            # Global stylesheets (styles.css, resume.css)
│   ├── components/         # Reusable UI components (Navbar, Footer, ProjectCard, SEO, PageTransition)
│   ├── pages/              # Main site pages (Home, About, Resume, Success, NotFound)
│   │   └── work/           # Detailed project case studies (Kite, Instagram, AppleMusic, CodeSenseAiSaas)
│   ├── utils/              # Helper functions, animation logic, telemetry, and constants
│   ├── App.jsx             # Main application layout and router setup
│   └── main.jsx            # Application entry point
├── eslint.config.js        # ESLint rules and configuration
├── vite.config.js          # Vite bundler configuration
└── package.json            # Project dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
  ```bash
  git clone [https://github.com/SwayamPurwar/SP.DEV.git](https://github.com/SwayamPurwar/SP.DEV.git)
  cd SP.DEV
  ```
2. **Install dependencies:**
  ```bash
  npm install
  ```
3. **Run the Development Server:**
  ```bash
  npm run dev
  ```
4. **Build for Production:**
  ```bash
  npm run build
  ```

### 💡 Key Configurations

**Interactive Elements**
Custom cursor logic and interactive hover states are managed via global selectors defined in `src/utils/constants.js`. The following elements trigger interactive states:

```bash
"a", "button", ".btn", ".t-btn", ".nav-item", ".toc-link", ".tech-pill", ".cv-btn", ".cs-tag", ".project-link", ".socials a", ".glass-btn", ".mouse-hover"
```


## 👨‍💻 Author

**Swayam Purwar**
- **LinkedIn**: [Swayam Purwar](https://www.linkedin.com/in/SwayamPurwar)
- **GitHub**: [@SwayamPurwar](https://github.com/SwayamPurwar/)
- **Email**: [swayampurwar111104@gmail.com](mailto:swayampurwar111104@gmail.com)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by Swayam Purwar
</p>