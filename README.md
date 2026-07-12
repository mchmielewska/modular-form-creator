# Modular Form Creator

A React resources-management frontend for creating, provisioning, and reviewing resources through a two-module workflow.

## Quick start

### Full stack with Docker (recommended)

Start the frontend, backend, and MongoDB together:

```bash
docker compose up -d --build
```

Open the application at [http://localhost:5173/resources](http://localhost:5173/resources).

The backend is available at [http://localhost:5001](http://localhost:5001), with Swagger UI at [http://localhost:5001/docs](http://localhost:5001/docs).

No local Node.js dependency installation is required for this workflow: the frontend image runs `npm ci` during its build. After changing `package.json` or `package-lock.json`, rebuild and recreate the frontend service:

```bash
docker compose build frontend
docker compose up -d frontend
```

### Frontend development

Install dependencies and start Vite locally:

```bash
npm ci
npm run dev
```

Start the backend services separately when using the local frontend server:

```bash
docker compose up -d backend mongo
```

## Scripts

| Command                 | Purpose                                                  |
| ----------------------- | -------------------------------------------------------- |
| `npm run dev`           | Start the Vite development server.                       |
| `npm run test:coverage` | Run tests with enforced application coverage thresholds. |
| `npm run lint`          | Run ESLint.                                              |
| `npm run build`         | Type-check and create a production build.                |

Coverage is enforced for the application workflow code.

## Routes

| Route                                    | Purpose                                                                        |
| ---------------------------------------- | ------------------------------------------------------------------------------ |
| `/resources`                             | List, search, filter, sort, create, and delete resources.                      |
| `/resources/:resourceId`                 | Resource overview, module progress, provisioning, and buffered-change actions. |
| `/resources/:resourceId/basic-info`      | Basic Info module form.                                                        |
| `/resources/:resourceId/project-details` | Project Details module form.                                                   |
| `/resources/:resourceId/details`         | Read-only combined resource summary.                                           |

## Workflow rules

- A new resource starts as `draft`.
- The resource name is immutable after creation.
- Basic Info must be complete before Project Details can be edited for draft resources.
- Provisioning is the only way to transition a resource from `draft` to `completed`.
- Provisioning is enabled only when both modules are complete.
- Completed resources cannot be provisioned again.

### Completed-resource edits

Edits to a completed resource are deliberately non-persistent at first:

1. A module form saves the edit into frontend-only memory.
2. **Submit changes** sends the full resource payload through the backend `PUT` endpoint.
3. **Discard changes**, refreshing, or closing the app removes the temporary buffer.

## Architecture

The frontend is organized by feature under `src/features/resources`:

- Typed API and TanStack Query modules manage backend communication and cache updates.
- Controller hooks coordinate route state, form state, and business rules.
- View components receive props and render without API calls or query hooks.

The supplied design system and backend source remain unchanged.

## Quality checks

Run before submission:

```bash
npm run test:coverage
npm run lint
npm run build
```
