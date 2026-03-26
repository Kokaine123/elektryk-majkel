# Next.js + Tailwind CSS Projekt

To jest projekt Next.js z integracją Tailwind CSS.

## Szybki start

### Wymagania

- Node.js 18+
- npm, yarn, pnpm, lub bun

### Instalacja zależności

```bash
npm install
```

### Uruchamianie serwera developmentowego

```bash
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce aby zobaczyć wynik.

### Build produkcyjny

```bash
npm run build
npm run start
```

## Struktura projektu

```
nextjs-app/
├── app/                 # Katalog aplikacji (App Router)
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Główna strona (/)
│   ├── globals.css      # Globalne style Tailwind CSS
├── public/              # Pliki statyczne
├── components/          # Komponenty React
├── lib/                 # Funkcje pomocnicze
├── package.json         # Zależności projektu
├── tsconfig.json        # Konfiguracja TypeScript
├── tailwind.config.ts   # Konfiguracja Tailwind CSS
├── next.config.ts       # Konfiguracja Next.js
└── .eslintrc.json       # Konfiguracja ESLint
```

## Dokumentacja

- [Next.js dokumentacja](https://nextjs.org/docs)
- [Tailwind CSS dokumentacja](https://tailwindcss.com/docs)

---

Stworzono z użyciem Next.js 16, React 19 i Tailwind CSS 4.
