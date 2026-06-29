# client-web-prototype

Alkemio platform UI redesign prototype built with React, Tailwind CSS, and shadcn/ui.

## Overview

This repository contains a Vite-based frontend prototype focused on UI/UX redesign and migration work.

- App source lives under `src/`
- Static assets live under `public/`
- Design and implementation specs live under `specs/`
- Shared styles live under `styles/`

## Prerequisites

- Node.js 18.18+ (Node.js 20 LTS recommended)
- npm 9+

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Build for Production

Create an optimized production build:

```bash
npm run build
```

Build output is generated in `dist/`.

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build the app for production

## Repository Notes

- `specs/` contains project briefs, plans, tasks, and migration artifacts.
- `guidelines/` contains supporting project guidance.
- If a `prototype/` folder is present, treat it as read-only reference material.

## Troubleshooting

- If dependencies are out of date or installation fails, remove `node_modules/` and `package-lock.json`, then run `npm install` again.
- If the dev server port is in use, Vite will suggest another available port in terminal output.
