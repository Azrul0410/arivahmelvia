$git = "C:\Program Files\Git\bin\git.exe"

# Set git identity
Write-Host "=== Setting git identity ===" -ForegroundColor Cyan
& $git config --global user.email "azrul@example.com"
& $git config --global user.name "Azrul"

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
