param([switch]$Manual, [switch]$Test)
# С ключом -Manual (ярлык на рабочем столе): обновляет список референсов и открывает программу.
# Без ключа (ежедневное напоминание): показывает окно «Пора рисовать», щелчок по нему открывает программу.
# -Test показывает окно в любой день, для проверки.
$ErrorActionPreference = 'SilentlyContinue'
$app  = $PSScriptRoot
$root = Split-Path -Parent $app

function Open-Program {
    $refsDir = Join-Path $root 'Референсы'
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
}

if ($Manual) { Open-Program; exit }
if (-not $Test -and (Get-Date).DayOfWeek -eq 'Sunday') { exit }

# ---------- окно напоминания ----------
Add-Type -AssemblyName System.Windows.Forms, System.Drawing
Add-Type -Namespace Ledra -Name Dpi -MemberDefinition '[DllImport("user32.dll")] public static extern bool SetProcessDPIAware();'
[Ledra.Dpi]::SetProcessDPIAware() | Out-Null
[System.Windows.Forms.Application]::EnableVisualStyles()

$paper = [System.Drawing.Color]::FromArgb(246, 241, 231)
$ink   = [System.Drawing.Color]::FromArgb(47, 39, 33)
$muted = [System.Drawing.Color]::FromArgb(133, 120, 104)
$rowan = [System.Drawing.Color]::FromArgb(140, 58, 38)
$rule  = [System.Drawing.Color]::FromArgb(211, 198, 178)

$k = [System.Windows.Forms.Screen]::PrimaryScreen.WorkingArea
$scale = [Math]::Max(1.0, ([System.Drawing.Graphics]::FromHwnd([IntPtr]::Zero)).DpiX / 96.0)
function S([double]$v) { [int][Math]::Round($v * $scale) }

$form = New-Object System.Windows.Forms.Form
$form.FormBorderStyle = 'None'
$form.StartPosition = 'Manual'
$form.TopMost = $true
$form.ShowInTaskbar = $true
$form.Text = 'Пора рисовать'
$form.BackColor = $paper
$form.Size = New-Object System.Drawing.Size((S 380), (S 128))
$form.Location = New-Object System.Drawing.Point(($k.Right - $form.Width - (S 16)), ($k.Bottom - $form.Height - (S 16)))
$form.Cursor = [System.Windows.Forms.Cursors]::Hand

# скруглённые углы и тонкая рамка
$r = S 14
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddArc(0, 0, $r, $r, 180, 90); $path.AddArc($form.Width - $r - 1, 0, $r, $r, 270, 90)
$path.AddArc($form.Width - $r - 1, $form.Height - $r - 1, $r, $r, 0, 90); $path.AddArc(0, $form.Height - $r - 1, $r, $r, 90, 90)
$path.CloseFigure()
$form.Region = New-Object System.Drawing.Region($path)
$form.Add_Paint({
    param($s, $e)
    $e.Graphics.SmoothingMode = 'AntiAlias'
    $pen = New-Object System.Drawing.Pen($rule, 1)
    $e.Graphics.DrawPath($pen, $path)
    $bar = New-Object System.Drawing.SolidBrush($rowan)
    $e.Graphics.FillRectangle($bar, (S 22), (S 26), (S 3), (S 76))
})

$title = New-Object System.Windows.Forms.Label
$title.Text = 'Пора рисовать'
$title.Font = New-Object System.Drawing.Font('Georgia', 19, [System.Drawing.FontStyle]::Regular)
$title.ForeColor = $ink
$title.AutoSize = $true
$title.Location = New-Object System.Drawing.Point((S 38), (S 20))

$text = New-Object System.Windows.Forms.Label
$text.Text = 'Задание на сегодня ждёт в программе. Нажмите, чтобы открыть.'
$text.Font = New-Object System.Drawing.Font('Segoe UI', 10)
$text.ForeColor = $muted
$text.Location = New-Object System.Drawing.Point((S 38), (S 62))
$text.Size = New-Object System.Drawing.Size((S 300), (S 44))

$close = New-Object System.Windows.Forms.Label
$close.Text = '✕'
$close.Font = New-Object System.Drawing.Font('Segoe UI', 11)
$close.ForeColor = $muted
$close.AutoSize = $true
$close.Location = New-Object System.Drawing.Point(($form.Width - (S 34)), (S 10))
$close.Cursor = [System.Windows.Forms.Cursors]::Default
$close.Add_MouseEnter({ $close.ForeColor = $ink })
$close.Add_MouseLeave({ $close.ForeColor = $muted })
$close.Add_Click({ $form.Tag = 'closed'; $form.Close() })

$open = { $form.Tag = 'open'; $form.Close() }
$form.Add_Click($open); $title.Add_Click($open); $text.Add_Click($open)
$form.Add_KeyDown({ param($s, $e) if ($e.KeyCode -eq 'Escape') { $form.Close() } elseif ($e.KeyCode -eq 'Enter') { & $open } })
$form.KeyPreview = $true

$form.Controls.AddRange(@($title, $text, $close))
$close.BringToFront()
$form.Add_Shown({ [System.Media.SystemSounds]::Asterisk.Play(); $form.Activate() })

[System.Windows.Forms.Application]::Run($form)
if ($form.Tag -eq 'open') { Open-Program }
