@echo off
title Launching IndiGo Agent Gatekeeper...
echo ========================================================
echo   IndiGo Airlines - Agent Gatekeeper Prototype
echo   MBA Assignment: Autonomous AI Agent Governance Gate
echo   Student Enrollment Number: PGD202563093
echo ========================================================
echo.
echo Opening Agent Gatekeeper in your default web browser...
start "" "%~dp0index.html"
echo.
echo Application launched! You can close this window.
timeout /t 3 >nul
exit
