### rishblol.github.io
> The internet is the most effective instrument we have for globalization.

This is my personal website, where you can see my `projects` and `blogs` (very erratic in writing blogs btw, so don't expect any consistency rip).

This website is made using:
* Astro
* Tailwind CSS
* Shadcn/ui

Local development requires Node.js 24 LTS and npm. Install the locked dependencies
with `npm ci`, then run `npm run dev`.

Run `npm run build` to type-check the project and generate the production site in
`dist/`. Run `npm run preview` to serve that output locally. GitHub Pages uses
Node.js 24 and runs the same checks before building with its deployment URL.

Styles use Tailwind CSS 3 through PostCSS, with `tailwind.config.ts` and the
existing `@tailwind` directives. The legacy `@astrojs/tailwind` integration is
incompatible with this project's Astro version.
