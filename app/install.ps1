# Ставит ежедневное напоминание в Планировщик заданий Windows.
# С ключом -Keep не задаёт вопросов: сохраняет текущее время напоминания и обновляет только путь к программе.
param([switch]$Keep)
$ErrorActionPreference = 'Stop'
$app    = $PSScriptRoot
$root   = Split-Path -Parent $app
$remind = Join-Path $app 'remind.ps1'

Get-ChildItem -Path $root -Recurse -File | Unblock-File -ErrorAction SilentlyContinue

$utc = [DateTime]::UtcNow.Date.AddHours(16)
$def = [TimeZoneInfo]::ConvertTimeFromUtc($utc, [TimeZoneInfo]::Local).ToString('HH:mm')
$old = Get-ScheduledTask -TaskName 'Risovanie' -ErrorAction SilentlyContinue
if ($old -and $old.Triggers.Count -gt 0) {
    try { $def = ([DateTime]$old.Triggers[0].StartBoundary).ToString('HH:mm') } catch {}
}

if (-not $Keep) {
    Write-Host ''
    Write-Host 'Напоминание о рисовании' -ForegroundColor Yellow
    Write-Host "16:00 по Гринвичу соответствует $def по времени этого компьютера."
    $t = Read-Host "Время напоминания (Enter — оставить $def, или введите другое, например 15:30)"
    if ([string]::IsNullOrWhiteSpace($t)) { $t = $def }
} else { $t = $def }

function Read-Time([string]$v) {
    if ($v.Trim() -match '^(\d{1,2})\s*[:.,\-]?\s*(\d{2})$') {
        $h = [int]$Matches[1]; $m = [int]$Matches[2]
        if ($h -le 23 -and $m -le 59) { return [DateTime]::Today.AddHours($h).AddMinutes($m) }
    }
    return $null
}
$time = Read-Time $t
if (-not $time) { Write-Host "Время «$t» не распознано, установлено $def." -ForegroundColor Red; $time = Read-Time $def }

$arg      = "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$remind`""
$action   = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument $arg
$trigger  = New-ScheduledTaskTrigger -Daily -At $time
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 5)
Register-ScheduledTask -TaskName 'Risovanie' -Description 'Задание по рисованию на день' -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null

# ярлык на рабочем столе
$desk = [Environment]::GetFolderPath('Desktop')
$ws = New-Object -ComObject WScript.Shell
$lnk = $ws.CreateShortcut((Join-Path $desk 'Рисование.lnk'))
$lnk.TargetPath = 'powershell.exe'
$lnk.Arguments = "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$remind`" -Manual"
$lnk.WorkingDirectory = $root
$lnk.IconLocation = 'imageres.dll,190'
$lnk.Save()

Write-Host ''
Write-Host ("Напоминание установлено: ежедневно в " + $time.ToString('HH:mm') + ", кроме воскресенья.") -ForegroundColor Green
Write-Host 'Если компьютер в это время выключен, программа откроется после включения.'
Write-Host 'Ярлык «Рисование» на рабочем столе открывает программу в любое время.'
Write-Host ''
if (-not $Keep) { & $remind -Manual }
