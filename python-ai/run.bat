@echo off
REM Python AI Service Startup Script for Windows

echo Starting Python AI Service...

REM Check if .env exists
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
)

REM Create virtual environment if needed
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install requirements
echo Installing requirements...
pip install -r requirements.txt

REM Create logs directory
if not exist logs mkdir logs

REM Start the service
echo Starting FastAPI server...
python app.py

pause
