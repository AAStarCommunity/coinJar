#!/bin/bash

# validate-system.sh
# This script validates the basic functionality of the transaction testing system.

# --- Configuration ---
BACKEND_URL="http://localhost:4000"
FRONTEND_URL="http://localhost:5173"
BACKEND_DIR="projects/start/packages/fake-backend"
FRONTEND_DIR="projects/start/packages/transaction-test-demo"

# --- Helper Functions ---
log() {
  echo "[INFO] $1"
}

error() {
  echo "[ERROR] $1"
  exit 1
}

# --- Main Validation Logic ---

log "Starting system validation..."

# 1. Check if backend is running
log "Checking if backend is running..."
curl -s $BACKEND_URL > /dev/null
if [ $? -ne 0 ]; then
  error "Backend is not running or not accessible at $BACKEND_URL. Please start it first."
fi
log "Backend is accessible."

# 2. Check if frontend is running
log "Checking if frontend is running..."
curl -s $FRONTEND_URL > /dev/null
if [ $? -ne 0 ]; then
  error "Frontend is not running or not accessible at $FRONTEND_URL. Please start it first."
fi
log "Frontend is accessible."

# 3. Test /test/status endpoint
log "Testing /test/status endpoint..."
STATUS_RESPONSE=$(curl -s $BACKEND_URL/test/status)
if [ $? -ne 0 ]; then
  error "Failed to get status from $BACKEND_URL/test/status"
fi

# Basic check for JSON response
if echo "$STATUS_RESPONSE" | grep -q "isRunning"; then
  log "Successfully received status: $STATUS_RESPONSE"
else
  error "Unexpected response from /test/status: $STATUS_RESPONSE"
fi

log "System validation complete. Basic functionality confirmed."
