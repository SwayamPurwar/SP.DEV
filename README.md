# Swayam Purwar — Developer Portfolio (SP.DEV)

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.1-black?style=for-the-badge&logo=nextdotjs" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS 4" />
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

| Feature                    | Description                                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 🧊 **3D Graphics** | Immersive 3D elements and web experiences powered by **Three.js**.                                             |
| 🎞️ **Advanced Animations** | Complex timeline animations and seamless page transitions utilizing **GSAP** and **ScrollTrigger**.                                  |
| 🌊 **浪 Smooth Scrolling** | Fluid, highly-optimized scroll behavior powered by **Lenis**.                                   |
| 🖱️ **Custom Interactions** | Custom cursor and hover states across interactive elements (buttons, project links, etc.).                     |
| 🔍 **Dynamic SEO** | Per-page metadata and SEO management using the **Next.js Metadata API**.                                             |
| 📁 **Case Studies** | Dedicated breakdown pages for major projects (Apple Music, Kite, Instagram, CodeSense AI).           |
| ⚡ **Next-Gen Tech** | Built on **Next.js 16** and **React 19** with **Turbopack** for lightning-fast performance. |

## 🛠️ Tech Stack

| Category               | Technology                          |
| ---------------------- | ----------------------------------- |
| **Frontend Framework** | Next.js 16 (App Router) + React 19 |
| **Styling** | Tailwind CSS v4                     |
| **Animations** | GSAP (GreenSock Animation Platform) |
| **3D Rendering** | Three.js                            |
| **Scroll Engine** | Lenis                               |
| **Backend/Auth** | Firebase                            |
| **Type Safety** | TypeScript                          |

## 📁 Project Structure

```text
SP.DEV/
├── public/
│   └── assets/
│       ├── fonts/          # Fira Code, Outfit, Space Grotesk, Syne, etc.
│       ├── docs/           # Resume PDF & HTML
│       └── images/         # UI assets, project previews, and profile pictures
├── src/
│   ├── app/                # Next.js App Router (Layouts, Pages, Routes)
│   │   ├── api/            # API routes (e.g., Contact form handler)
│   │   ├── work/           # Detailed project case studies
│   │   ├── globals.css     # Global Tailwind styles
│   │   └── layout.tsx      # Root layout and font configurations
│   ├── components/         # Reusable UI components (Navbar, Footer, ProjectCard, etc.)
│   ├── utils/              # Helper functions, GSAP logic, Firebase config, and constants
│   └── types/              # TypeScript definitions
├── postcss.config.mjs      # PostCSS configuration
├── next.config.ts          # Next.js configuration
└── package.json            # Project dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

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
