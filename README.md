# AI Readiness Self-Assessment

A Next.js app for running a 7-enabler AI readiness assessment with:
- Guided assessment flow
- User information capture
- Scoring by category and overall maturity
- Dynamic recommendations
- Color PDF report export

## App Flow

1. `/` Start page
2. `/assessment` Questionnaire (7 categories, 2 questions each, 1-5 scale)
3. `/user-info` User details form
4. `/results` Scored results, maturity stage, recommendations, PDF export
5. `/contact` Email contact form

## Maturity Scoring

- Category scores are converted from 1-5 scale to 0-100
- Overall score is the average of category scores
- Maturity stages:
  - Explorer: 0-25%
  - Builder: 26-50%
  - Integrator: 51-75%
  - Market Shaper: 76-100%

## Recommendation Logic

- Recommendation set 1: Based on maturity stage
- Recommendation sets 2 and 3: Based on the two lowest enablers
- For each lowest enabler, recommendation content changes by threshold:
  - Under 50%
  - 50% And Above

## Local Storage Keys

- `answers`: Question responses
- `profile`: User details

## Project Structure

- `app/page.tsx`: Start page
- `app/assessment/page.tsx`: Questionnaire UI
- `app/user-info/page.tsx`: User information form
- `app/results/page.tsx`: Results, recommendations, PDF download
- `app/contact/page.tsx`: Contact form
- `app/components-site-header.tsx`: Shared header/nav
- `app/components-thread-background.tsx`: Shared thread background layer
- `app/globals.css`: Global theme and print styles
- `lib/enablers.ts`: Enabler definitions
- `lib/questions.ts`: Question bank
- `lib/scoring.ts`: Scoring and maturity calculations
- `lib/recommendations.ts`: Recommendation content and variants

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

## Quality Checks

```bash
npm run lint
npm run build
```

## Notes

- Primary brand accent color is `#1d9acc`
- Thread background imagery is sourced from:
  - `public/Innovation Thread_Style 1 White.png`
  - `public/Innovation Thread_Style 2 White.png`
- Results page supports direct PDF download (not browser print workflow)
# ai-readiness
