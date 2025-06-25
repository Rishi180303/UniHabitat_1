# UniHabitat

A modern web application for students to find off-campus housing. Built with Next.js, Tailwind CSS, and shadcn/ui.

## Features

- Responsive landing page with modern design
- Mobile-first approach
- Clean and intuitive user interface
- Built with accessibility in mind

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- shadcn/ui components
- TypeScript

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/unihabitat.git
cd unihabitat
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
unihabitat/
├── app/
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.ts
│   │   └── error/
│   │       └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── profile/
│   │   ├── page.tsx           # Profile view & in-place edit
│   │   └── setup/
│   │       └── page.tsx       # Profile setup & edit wizard
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Landing page
├── components/
│   ├── AuthError.tsx
│   ├── AuthModal.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── HeroBackground.tsx
│   ├── Features.tsx
│   ├── Footer.tsx
│   ├── ListingCard.tsx
│   ├── MobileMenu.tsx
│   ├── Navbar.tsx
│   ├── Navigation.tsx
│   ├── Step.tsx
│   ├── StepContent.tsx
│   ├── UniversitySearch.tsx   # Smart university dropdown
│   ├── auth-provider.tsx
│   ├── providers.tsx
│   └── ui/
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── tabs.tsx
├── lib/
│   ├── supabase.ts
│   └── utils.ts
├── public/
│   └── universities/
│       ├── berkeley.svg
│       ├── harvard.svg
│       ├── mit.svg
│       └── stanford.svg
├── package.json
├── package-lock.json
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
├── postcss.config.js
└── README.md
```


