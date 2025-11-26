# CLAUDE.md

## Project Overview

**Nerdio Go-Live Timeline Calculator** - A React application for Azure Virtual Desktop (AVD) migration planning. It calculates reverse timelines from a go-live date and builds business cases with ROI analysis.

## Tech Stack

- React 18 + Vite
- Tailwind CSS with @tailwindcss/forms and @tailwindcss/typography
- Lucide React (icons)
- jsPDF + jspdf-autotable (PDF export)
- xlsx (Excel export)
- Recharts (charts/visualizations)
- react-hook-form + zod (form validation)
- date-fns (date utilities)

## Commands

```bash
npm install    # Install dependencies
npm run dev    # Start dev server (Vite)
npm run build  # Production build
npm run preview # Preview production build
```

## Project Structure

```
src/
├── App.jsx                    # Main app with tab navigation
├── main.jsx                   # Entry point
├── index.css                  # Global styles + Tailwind
├── components/
│   ├── TimelineCalculator.jsx     # Main timeline calculator
│   ├── TimelineGanttChart.jsx     # Gantt chart visualization
│   ├── business-case/             # Business case wizard components
│   │   ├── BusinessCaseWizard.jsx
│   │   ├── CustomerProfileForm.jsx
│   │   ├── CurrentStateConfig.jsx
│   │   ├── FutureStateConfig.jsx
│   │   ├── ResultsDashboard.jsx
│   │   └── ProgressStepper.jsx
│   ├── ExecutiveOnePager/         # PDF export components
│   ├── QuickQualifier/            # NTENT quick qualifier
│   ├── navigation/                # Navigation components
│   └── ui/                        # Reusable UI components (badges, tooltips)
├── contexts/
│   └── BusinessCaseContext.jsx    # Global state for business case
├── hooks/
│   ├── useTimelineCalculator.js
│   └── useCoachTriggers.js
├── utils/
│   ├── business-case/
│   │   ├── cost-calculator.js     # Cost calculation logic
│   │   └── roi-calculator.js      # ROI calculation logic
│   ├── export/
│   │   ├── pdf-generator.js       # PDF export
│   │   ├── excel-generator.js     # Excel export
│   │   └── timeline-pdf-export.js
│   └── timeline/
│       ├── richard-timeline-engine.js  # Core timeline engine
│       └── migration-helper.js
├── constants/
│   ├── ntentQuestions.js          # NTENT scoring questions
│   └── ntentColors.js             # NTENT color scheme
└── data/
    ├── azure-pricing.json         # Azure pricing data
    └── nerdio-value-metrics.json  # Value metrics
```

## Key Concepts

### NTENT Framework
The application uses a weighted scoring system with 18 complexity factors across categories:
- Project Scope
- Tech Stack
- Governance
- Security
- Applications

### Three Main Views (Tabs)
1. **Timeline** (`activeTab === 'timeline'`) - Reverse timeline calculator
2. **Business Case** (`activeTab === 'business-case'`) - Full ROI wizard
3. **Qualifier** (`activeTab === 'qualifier'`) - Quick NTENT qualification

### BusinessCaseContext
Global state provider for business case data. Wrap components with `<BusinessCaseProvider>` to access shared state.

## Coding Conventions

- Functional components with hooks
- Tailwind CSS for styling (no separate CSS modules)
- Component files use PascalCase (e.g., `TimelineCalculator.jsx`)
- Utility files use kebab-case (e.g., `cost-calculator.js`)
- Constants in `src/constants/`
- Business logic in `src/utils/`

## Testing

Tests are located in `tests/` directory:
```bash
tests/timeline/timeline-validator.test.js
```

## Deployment

Configured for Vercel deployment (`vercel.json` present).
