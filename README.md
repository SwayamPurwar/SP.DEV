# Swayam Purwar — Developer Portfolio (SP.DEV)

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Strict" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock" alt="GSAP" />
  <img src="https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=threedotjs" alt="Three.js" />
  <img src="https://img.shields.io/badge/Lenis-black?style=for-the-badge" alt="Lenis Smooth Scroll" />
</p>

<p align="center">
  <strong>A highly interactive, 3D-enabled personal developer portfolio website.</strong><br/>
  Showcasing projects, case studies, and immersive web experiences <br/>
  with smooth animations, dynamic routing, and hidden easter eggs.
</p>

---

## ✨ Features

| Feature                    | Description                                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 🛡️ **Enterprise Type Safety** | Built with **100% Strict-Mode TypeScript**, ensuring a zero-`any`, heavily typed, and crash-resistant architecture. |
| 🧊 **3D Graphics & Canvas** | Immersive web experiences and data visualizations powered by **Three.js** and native HTML5 `<canvas>`.                                             |
| 🎞️ **Advanced Animations** | Complex timeline animations, micro-interactions, and seamless page transitions utilizing **GSAP** & **ScrollTrigger**.                                  |
| 🌊 **Fluid Scrolling** | Highly-optimized, momentum-based scroll behavior powered by **Lenis**.                                   |
| 🎵 **Custom Audio Engine** | Integrated UI soundscapes and interactive audio feedback (`audio-system.ts`). |
| 🕹️ **Terminal & Easter Eggs** | Hidden interactive command-line interface and secret interactions waiting to be discovered. |
| 📁 **Deep-Dive Case Studies** | Dedicated architectural breakdown pages for major projects (Apple Music, Kite, Instagram, CodeSense AI).           |
| ⚡ **Next-Gen Tech** | Built on the bleeding edge: **Next.js 16**, **React 19**, and **Tailwind v4** utilizing **Turbopack** for lightning-fast performance. |

## 🛠️ Tech Stack

| Category               | Technology                          |
| ---------------------- | ----------------------------------- |
| **Frontend Framework** | Next.js (App Router) + React 19     |
| **Type System** | TypeScript (Strict Mode)            |
| **Styling** | Tailwind CSS v4 + `clsx` / `tailwind-merge` |
| **Animations** | GSAP (GreenSock Animation Platform) |
| **3D & Canvas** | Three.js + Native Canvas API        |
| **Scroll Engine** | Lenis                               |
| **Backend / APIs** | Next.js Route Handlers + Firebase   |
| **Icons & Assets** | Lucide React                        |

## 📁 Project Structure

```text
SP.DEV/
├── public/
│   └── assets/
│       ├── fonts/          # Fira Code, Outfit, Space Grotesk, Syne, etc.
│       ├── docs/           # Resume PDF & HTML files
│       └── images/         # UI assets, project previews, and profile shots
├── src/
│   ├── app/                # Next.js App Router (Layouts, Pages, Routes)
│   │   ├── api/            # Serverless API routes (e.g., Contact form handler)
│   │   ├── work/           # Detailed project case studies and architectural breakdowns
│   │   ├── globals.css     # Global Tailwind styles & CSS variables
│   │   └── layout.tsx      # Root layout, metadata, and font configurations
│   ├── components/         # Reusable UI components (Navbar, Footer, ProjectCard, etc.)
│   └── utils/              
│       ├── animations.ts   # Global GSAP & Lenis scroll logic
│       ├── audio-system.ts # Interactive UI sound engine
│       ├── terminal.ts     # Hidden CLI logic
│       ├── easter-eggs.ts  # Secret interactions
│       └── firebase.ts     # Backend configuration
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

4. **Set up environment variables:**
Create a `.env` file in the root directory and add your Firebase credentials (required for the contact form/backend features).

4. **Run the Development Server:**

```bash
npm run dev
```

5. **Build for Production:**

```bash
npm run build
```

### 💡 Key Configurations

## 🖥️ Website Terminal Commands (S.A.M)

The portfolio includes a built-in terminal UI (not your OS terminal).

How to open it:

- Press `~` (tilde) or `` ` `` (backtick)
- Or triple-click the navbar logo quickly

### Implemented Commands

- `help`
  - Displays terminal help output
- `ls`, `dir`
  - Lists available sections and secret file hint (`secrets.enc`)
- `cd <path>`, `goto <path>`
  - Supports `about`, `contact`, `resume`, `work`, `..`, `home`, `~`
- `cat <target>`
  - `cat secrets.enc` -> encrypted access denied message
  - `cat about` -> mock HTML output
- `clear`, `cls`
  - Clears terminal output panel
- `ai`, `chat`
  - Enters S.A.M AI mode
- `matrix`
  - Triggers matrix visual effect
- `blackout`
  - Triggers blackout easter egg sequence
- `gravity`
  - Triggers gravity easter egg sequence
- `exit`, `gui`
  - Closes terminal UI

### VIM Mode

- Internal VIM handler exists in code.
- Exit command is `:wq`.
- Current status: no public command is wired to enter VIM mode yet, so this flow is hidden/placeholder until an enter command is added.

### Secret / Easter-Egg Notes

- `matrix`, `blackout`, and `gravity` are fully active visual secret commands.
- `secrets.enc` is intentionally protected via `cat` behavior.

### Autocomplete and Recognized Keywords

Autocomplete source currently includes:

- `help`, `ls`, `cd`, `pwd`, `date`, `history`, `clear`, `socials`, `theme`, `matrix`, `blackout`, `gravity`, `ai`, `cat`, `decrypt`

Recognized local-style prefixes include:

- `whoami`, `echo`, `exit`, `sudo`, `npm`, `voice`, `analyze`

### Important Behavior

- Unknown or not-implemented commands are broadcast to the global terminal chat stream.
- History navigation: `ArrowUp` and `ArrowDown`
- Autocomplete: `Tab`

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
