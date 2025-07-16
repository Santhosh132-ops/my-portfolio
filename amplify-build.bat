@echo off
echo Building static site...

REM Clean dist folder
IF EXIST dist (
    rmdir /s /q dist
)
mkdir dist

REM Copy all root HTML files
for %%f in (*.html) do (
    xcopy "%%f" "dist\" /Y >nul
)

REM Copy css/ if exists
IF EXIST css (
    xcopy css dist\css /E /I /Y >nul
)

REM Copy js/ if exists
IF EXIST js (
    xcopy js dist\js /E /I /Y >nul
)

REM Copy images/ if exists
IF EXIST images (
    xcopy images dist\images /E /I /Y >nul
)

echo ✅ Build complete.
