#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

echo "Setting up backend..."
cd backend
python3 -m venv venv
./venv/bin/pip install -q -r requirements.txt
cd ..

echo "Setting up frontend..."
cd frontend
npm install
cd ..

echo "Done. Run ./run.sh to start the app."
