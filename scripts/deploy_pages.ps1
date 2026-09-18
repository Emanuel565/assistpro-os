# Script para build e deploy do frontend no GitHub Pages (AssistPro OS)
Write-Host "==> Compilando frontend para producao..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\..\frontend"
npm.cmd run build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha no build do frontend."
    exit 1
}

Write-Host "==> Preparando fallback SPA (404.html e .nojekyll)..." -ForegroundColor Cyan
Copy-Item dist\index.html dist\404.html -Force
New-Item -ItemType File -Name .nojekyll -Path dist -Force | Out-Null

Write-Host "==> Publicando na branch gh-pages do GitHub..." -ForegroundColor Cyan
Set-Location dist
git init -b gh-pages
git remote add origin https://github.com/Emanuel565/assistpro-os.git
git add -A
git commit -m "deploy: update GitHub Pages frontend build"
git push -u origin gh-pages --force
Remove-Item -Recurse -Force .git

Set-Location "$PSScriptRoot\.."
Write-Host "==> Deploy concluido com sucesso no GitHub Pages!" -ForegroundColor Green
Write-Host "URL: https://emanuel565.github.io/assistpro-os/" -ForegroundColor Green
