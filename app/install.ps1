# Ставит ежедневное напоминание в Планировщик заданий Windows.
$ErrorActionPreference = 'Stop'
$app    = $PSScriptRoot
$root   = Split-Path -Parent $app
$remind = Join-Path $app 'remind.ps1'

Get-ChildItem -Path $root -Recurse -File | Unblock-File -ErrorAction SilentlyContinue

$utc = [DateTime]::UtcNow.Date.AddHours(16)
$def = [TimeZoneInfo]::ConvertTimeFromUtc($utc, [TimeZoneInfo]::Local).ToString('HH:mm')

Write-Host ''
Write-Host 'Напоминание о рисовании' -ForegroundColor Yellow
Write-Host "16:00 по Гринвичу на этом компьютере это $def."
$t = Read-Host "Во сколько напоминать? Нажми Enter, чтобы оставить $def, или впиши своё время (например 15:30)"
if ([string]::IsNullOrWhiteSpace($t)) { $t = $def }
try { $time = [DateTime]::ParseExact($t.Trim(), @('H:mm','HH:mm','H.mm'), $null, 'None') }
catch { Write-Host "Не поняла время «$t», ставлю $def." -ForegroundColor Red; $time = [DateTime]::ParseExact($def, 'HH:mm', $null) }

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
Write-Host ("Готово. Программа будет открываться каждый день в " + $time.ToString('HH:mm') + ", кроме воскресенья.") -ForegroundColor Green
Write-Host 'Если компьютер в это время выключен, она откроется, когда ты его включишь.'
Write-Host 'На рабочем столе появился ярлык «Рисование», им можно открыть программу в любой момент.'
Write-Host ''
& $remind -Manual
