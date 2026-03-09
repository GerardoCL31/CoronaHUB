$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "Building production bundle..."
npx webpack --mode production

$zipPath = Join-Path $root "dist-one.zip"
if (Test-Path $zipPath) {
  Remove-Item $zipPath -Force
}

Write-Host "Creating dist-one.zip..."
Compress-Archive -Path (Join-Path $root "dist\*") -DestinationPath $zipPath

Write-Host "Done: $zipPath"
