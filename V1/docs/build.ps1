Set-Location $PSScriptRoot

Write-Host "Building TCC PDF..." -ForegroundColor Cyan

pdflatex -interaction=nonstopmode tcc.tex
bibtex tcc
pdflatex -interaction=nonstopmode tcc.tex
pdflatex -interaction=nonstopmode tcc.tex

if ($?) {
    Write-Host "Done: tcc.pdf" -ForegroundColor Green
    Start-Process tcc.pdf
} else {
    Write-Host "Build failed. Check tcc.log" -ForegroundColor Red
}
