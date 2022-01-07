#!/usr/bin/env bash
# Exit on failure
set -e

PORT=${PORT:-8545}

echo "Running ganache..."

ganache-cli -p $PORT --accounts 1025