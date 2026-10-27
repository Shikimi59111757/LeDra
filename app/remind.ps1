param([switch]$Manual)
# Обновляет список фото из папки «Мои рефы» и открывает программу.
$ErrorActionPreference = 'SilentlyContinue'
$app  = $PSScriptRoot
$root = Split-Path -Parent $app

if (-not $Manual -and (Get-Date).DayOfWeek -eq 'Sunday') { exit }

$refsDir = Join-Path $root 'Мои рефы'
if (-not (Test-Path $refsDir)) { New-Item -ItemType Directory -Path $refsDir | Out-Null }
$ext = @('.jpg','.jpeg','.png','.webp','.gif','.bmp')
$items = @(Get-ChildItem -Path $refsDir -Recurse -File | Where-Object { $ext -contains $_.Extension.ToLower() })
$names = foreach ($f in $items) {
    $rel = $f.FullName.Substring($refsDir.Length).TrimStart([char[]]'\/').Replace('\','/')
    '"' + $rel.Replace('\','\\').Replace('"','\"') + '"'
}
$js = 'window.REFS = [' + ($names -join ',') + '];'
[System.IO.File]::WriteAllText((Join-Path $app 'refs.js'), $js, (New-Object System.Text.UTF8Encoding($false)))

Start-Process (Join-Path $root 'Программа.html')
