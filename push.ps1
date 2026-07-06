$git = "C:\Program Files\Git\bin\git.exe"
$lockPath = "C:\Users\LINDOW\Downloads\Journey of Us Website\.git\index.lock"

# Force delete lock file using .NET
try {
    [System.IO.File]::Delete($lockPath)
    Write-Host "Lock file deleted successfully." -ForegroundColor Green
} catch {
    Write-Host "Could not delete lock: $_" -ForegroundColor Yellow
}

# Stage files
Write-Host "=== Staging files ===" -ForegroundColor Cyan
& $git add .

# Commit
Write-Host "=== Committing ===" -ForegroundColor Cyan
& $git commit -m "first commit"

# Branch and remote
Write-Host "=== Setting branch to main ===" -ForegroundColor Cyan
& $git branch -M main

Write-Host "=== Adding remote origin ===" -ForegroundColor Cyan
& $git remote remove origin 2>&1 | Out-Null
& $git remote add origin "https://github.com/Azrul0410/arivahmelvia.git"

# Push
Write-Host "=== Pushing to GitHub ===" -ForegroundColor Cyan
& $git push -u origin main

Write-Host "=== ALL DONE ===" -ForegroundColor Green
