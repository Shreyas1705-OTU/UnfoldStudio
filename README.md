# Photography Client Manager

A local-first client manager for a solo photography business: clients, notes,
payments, invoices, contracts, shoot timeline, and links to files on Google
Drive/Dropbox. No AI, no cloud services, no accounts — everything runs on
your own Mac.

## Requirements

- Python 3.10+
- Node.js 18+

If you don't have these: `brew install python node`

## Setup

```bash
git clone <repo-url>
cd photography-client-manager
./setup.sh
```

## Run

```bash
./run.sh
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173 — open this in your browser

Press `Ctrl+C` to stop both servers.

## Data

Everything is stored in a single local file, `backend/crm.db`. Back it up
however you like (Time Machine, copying it to a Drive folder, etc.) — there's
no external database or account involved.
