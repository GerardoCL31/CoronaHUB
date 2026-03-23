$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "Building production bundle..."
npm run build

$zipPath = Join-Path $root "dist-one.zip"
if (Test-Path $zipPath) {
  Remove-Item $zipPath -Force
}

Write-Host "Creating dist-one.zip..."
Compress-Archive -Path (Join-Path $root "dist\*"), (Join-Path $root "dist\.htaccess") -DestinationPath $zipPath

Write-Host "Done: $zipPath"
