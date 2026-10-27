Unregister-ScheduledTask -TaskName 'Risovanie' -Confirm:$false -ErrorAction SilentlyContinue
$desk = [Environment]::GetFolderPath('Desktop')
$ws = New-Object -ComObject WScript.Shell
foreach ($f in Get-ChildItem -Path $desk -Filter *.lnk -File -ErrorAction SilentlyContinue) {
    if ($ws.CreateShortcut($f.FullName).Arguments -like '*remind.ps1*-Manual*') { Remove-Item $f.FullName }
}
Write-Host 'Напоминание удалено. Программа и файлы сохранены.'
