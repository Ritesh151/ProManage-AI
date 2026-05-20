#!/bin/bash

# Python AI Service Startup Script

echo "Starting Python AI Service..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

# Install dependencies if needed
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements
echo "Installing requirements..."
pip install -r requirements.txt

# Create logs directory
mkdir -p logs

# Start the service
echo "Starting FastAPI server..."
python app.py
