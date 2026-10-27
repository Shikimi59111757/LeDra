Unregister-ScheduledTask -TaskName 'Risovanie' -Confirm:$false -ErrorAction SilentlyContinue
$lnk = Join-Path ([Environment]::GetFolderPath('Desktop')) 'Рисование.lnk'
if (Test-Path $lnk) { Remove-Item $lnk }
Write-Host 'Напоминание удалено. Программа и файлы сохранены.'
