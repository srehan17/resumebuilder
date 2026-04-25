# Client — React Frontend

Built with Create React App, TypeScript, Redux Toolkit, and Bootstrap 5.

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start dev server at `http://localhost:3000` |
| `npm test` | Run test suite |
| `npm run build` | Production build |

## Structure

```
src/
├── app/               # Redux store and typed hooks
├── components/        # Shared UI components (Header, Spinner, etc.)
├── features/          # Redux slices + API service files
│   ├── auth/
│   ├── experience/
│   ├── education/
│   └── profile/
└── pages/             # Route-level components
```

## State Management

Redux Toolkit slices manage four domains: `auth`, `experience`, `education`, and `profile`. Each slice has a corresponding service file that handles Axios calls to the backend API.

## Testing

Tests live alongside the code they test (`*.test.ts` / `*.test.tsx`).

```bash
npm test
```

Covers Redux reducer logic for all slices and a smoke test that the app renders without crashing.
