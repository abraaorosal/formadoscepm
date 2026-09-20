# CEPM Training History Dashboard

Interactive dashboard for exploring historical training records, class totals, completion metrics and geographic coverage.

The project transforms structured historical records into a searchable analytical interface designed to support institutional memory and quantitative analysis.

## Core capabilities

- historical class records;
- year-based filtering;
- text search across class and location data;
- totals for participants and graduates;
- completion-rate calculations;
- geographic coverage indicators;
- yearly comparison views;
- breakdown of participants from other institutions;
- tabular exploration of detailed records.

## Technology stack

| Layer | Technologies |
| --- | --- |
| UI | React 18 |
| Language | TypeScript |
| Build | Vite |
| Data source | JSON |
| Architecture | Reusable analytical components |

## Project structure

The web application is located under:

```text
cepm-dashboard/
├── src/
│   ├── components/
│   ├── data/
│   │   └── graduates.json
│   ├── App.tsx
│   └── types.ts
├── package.json
└── vite.config.ts
```

## Analytical flow

```text
Historical JSON records
        │
        ▼
Normalization
        │
        ▼
Filtering + aggregation
        │
        ├── totals
        ├── completion rates
        ├── yearly metrics
        └── geographic coverage
        │
        ▼
React dashboard
```

## Running locally

```bash
cd cepm-dashboard
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Engineering highlights

The dashboard uses typed records and derived metrics rather than hard-coded summary values. Aggregations are calculated from the underlying dataset, which improves maintainability and traceability when historical records are updated.

## Data responsibility

Historical institutional datasets should contain only information authorized for public disclosure. Personally identifiable or operationally sensitive information should not be included in the public dataset.

---

**Portfolio focus:** React · TypeScript · analytics · historical data · institutional dashboards
