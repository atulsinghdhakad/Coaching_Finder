#!/bin/bash
set -e

echo "Current directory: $(pwd)"
echo "Listing contents:"
ls -la

echo "Changing to frontend directory..."
cd frontend

echo "Frontend directory contents:"
ls -la

echo "Installing dependencies..."
npm install

echo "Building the application..."
npm run build

echo "Build completed successfully!" 