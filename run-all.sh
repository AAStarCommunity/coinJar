#!/bin/bash

# Kill processes on ports 5173, 4000, 8000
lsof -ti:5173 | xargs kill -9
lsof -ti:4000 | xargs kill -9
lsof -ti:8000 | xargs kill -9

# Start services
pnpm dev:backend &
pnpm dev:frontend &
python3 -m http.server 8000 &

# Print URLs
echo "DApp Launchpad: http://localhost:8000"
echo "CoinJar DApp: http://localhost:5173"
echo "Backend API: http://localhost:4000"
