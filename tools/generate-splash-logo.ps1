# Generates the CineCatalog splash mark.
#
# The mark is an aperture: a disc with a hexagonal iris opening and six seams
# running from the hexagon's corners out to the rim. It is built from exact
# geometry rather than hand-written path data, so the Android vector and the PNG
# asset are guaranteed to be the same shape.
#
# Outputs:
#   android/app/src/main/res/drawable/splash_logo.xml   (VectorDrawable)
#   src/assets/splash-logo.png                          (512px, transparent)
#   %TEMP%\splash-preview.png                           (mockup, for review)
#
# Run from the repo root:  pwsh -File tools/generate-splash-logo.ps1

Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$outVector  = Join-Path $root 'android\app\src\main\res\drawable\splash_logo.xml'
$outPng     = Join-Path $root 'src\assets\splash-logo.png'
$outPreview = Join-Path $env:TEMP 'splash-preview.png'

# --- geometry, in a 120x120 coordinate space -------------------------------
# PowerShell variable names are case-insensitive, so the two radii must not be
# called $R and $r - those are the same variable and the second would win.
$cx = 60.0; $cy = 60.0
$rOuter = 52.0      # outer disc
$rIris  = 19.0      # hexagonal iris opening (circumradius)
$hw     = 1.15      # half width of each seam

$cos = @{}; $sin = @{}
for ($k = 0; $k -lt 6; $k++) {
    $a = [Math]::PI * 60 * $k / 180.0
    $cos[$k] = [Math]::Cos($a); $sin[$k] = [Math]::Sin($a)
}

$hex = @(); $rim = @()
for ($k = 0; $k -lt 6; $k++) {
    # one step at a time: in PowerShell the comma operator binds tighter than '*',
    # so an inline `$a * $b, $c` would multiply by an array instead.
    $hx = $cx + $rIris * $cos[$k]
    $hy = $cy + $rIris * $sin[$k]
    $rx = $cx + $rOuter * $cos[$k]
    $ry = $cy + $rOuter * $sin[$k]
    $hex += ,@($hx, $hy)
    $rim += ,@($rx, $ry)
}

function F([double]$v) {
    ([Math]::Round($v, 2)).ToString([System.Globalization.CultureInfo]::InvariantCulture)
}

# --- path data: one path, evenOdd, so the opening and seams are punched out --
$sb = New-Object System.Text.StringBuilder
[void]$sb.Append("M60,8 A$(F $rOuter),$(F $rOuter) 0 1,0 60,112 A$(F $rOuter),$(F $rOuter) 0 1,0 60,8 Z")
[void]$sb.Append(" M" + (($hex | ForEach-Object { "$(F $_[0]),$(F $_[1])" }) -join ' L') + " Z")
for ($k = 0; $k -lt 6; $k++) {
    $px = -$sin[$k] * $hw; $py = $cos[$k] * $hw
    $a1x = $hex[$k][0] + $px; $a1y = $hex[$k][1] + $py
    $b1x = $rim[$k][0] + $px; $b1y = $rim[$k][1] + $py
    $b2x = $rim[$k][0] - $px; $b2y = $rim[$k][1] - $py
    $a2x = $hex[$k][0] - $px; $a2y = $hex[$k][1] - $py
    $pts = @(@($a1x, $a1y), @($b1x, $b1y), @($b2x, $b2y), @($a2x, $a2y))
    [void]$sb.Append(" M" + (($pts | ForEach-Object { "$(F $_[0]),$(F $_[1])" }) -join ' L') + " Z")
}
$pathData = $sb.ToString()

# --- VectorDrawable -------------------------------------------------------
$xml = @"
<?xml version="1.0" encoding="utf-8"?>
<!--
  CineCatalog mark: an aperture. A disc, a hexagonal iris opening, and six seams
  from the opening's corners out to the rim, all in one path with an evenOdd fill
  so the opening and the seams are punched out and the splash colour shows
  through. The path is generated from exact geometry by
  tools/generate-splash-logo.ps1 - do not hand edit it.
-->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:aapt="http://schemas.android.com/aapt"
    android:width="132dp"
    android:height="132dp"
    android:viewportWidth="120"
    android:viewportHeight="120">

    <path
        android:fillType="evenOdd"
        android:pathData="$pathData">
        <aapt:attr name="android:fillColor">
            <gradient
                android:type="linear"
                android:startX="30" android:startY="10"
                android:endX="98" android:endY="112"
                android:startColor="#FFE3BC"
                android:centerColor="#FFC46B"
                android:endColor="#F29B2C" />
        </aapt:attr>
    </path>
</vector>
"@
Set-Content -Path $outVector -Value $xml -Encoding utf8

# --- PNG, same geometry, transparent background ----------------------------
$size = 512
$scale = $size / 120.0

function Sc([double]$v) { [single]($v * $scale) }

$gp = New-Object System.Drawing.Drawing2D.GraphicsPath
$gp.FillMode = [System.Drawing.Drawing2D.FillMode]::Alternate
$gp.AddEllipse((Sc($cx - $rOuter)), (Sc($cy - $rOuter)), (Sc(2 * $rOuter)), (Sc(2 * $rOuter)))

$hexPts = @()
foreach ($h in $hex) { $hexPts += New-Object System.Drawing.PointF((Sc($h[0])), (Sc($h[1]))) }
$gp.AddPolygon([System.Drawing.PointF[]]$hexPts)

for ($k = 0; $k -lt 6; $k++) {
    $px = -$sin[$k] * $hw; $py = $cos[$k] * $hw
    $quad = @(
        (New-Object System.Drawing.PointF((Sc($hex[$k][0] + $px)), (Sc($hex[$k][1] + $py)))),
        (New-Object System.Drawing.PointF((Sc($rim[$k][0] + $px)), (Sc($rim[$k][1] + $py)))),
        (New-Object System.Drawing.PointF((Sc($rim[$k][0] - $px)), (Sc($rim[$k][1] - $py)))),
        (New-Object System.Drawing.PointF((Sc($hex[$k][0] - $px)), (Sc($hex[$k][1] - $py))))
    )
    $gp.AddPolygon([System.Drawing.PointF[]]$quad)
}

$c1 = [System.Drawing.ColorTranslator]::FromHtml('#FFE3BC')
$c2 = [System.Drawing.ColorTranslator]::FromHtml('#FFC46B')
$c3 = [System.Drawing.ColorTranslator]::FromHtml('#F29B2C')
$from = New-Object System.Drawing.PointF((Sc(30)), (Sc(10)))
$to   = New-Object System.Drawing.PointF((Sc(98)), (Sc(112)))
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($from, $to, $c1, $c3)
$blend = New-Object System.Drawing.Drawing2D.ColorBlend(3)
$blend.Colors = @($c1, $c2, $c3)
$blend.Positions = @(0.0, 0.5, 1.0)
$brush.InterpolationColors = $blend

$bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::Transparent)
$g.FillPath($brush, $gp)
$g.Dispose()
$pngDir = Split-Path $outPng -Parent
if (-not (Test-Path $pngDir)) { New-Item -ItemType Directory -Force -Path $pngDir | Out-Null }
$bmp.Save($outPng, [System.Drawing.Imaging.ImageFormat]::Png)

# --- preview mockup, so a human can check it ---------------------------------
$pw = 540; $ph = 960
$preview = New-Object System.Drawing.Bitmap($pw, $ph)
$pg = [System.Drawing.Graphics]::FromImage($preview)
$pg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$pg.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
$pg.Clear([System.Drawing.ColorTranslator]::FromHtml('#08090C'))

$logoSize = 300
$pg.DrawImage($bmp, [int](($pw - $logoSize) / 2), 250, $logoSize, $logoSize)

$font  = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Bold)
$small = New-Object System.Drawing.Font('Segoe UI', 15)
$fmt = New-Object System.Drawing.StringFormat
$fmt.Alignment = [System.Drawing.StringAlignment]::Center
$amber = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#FFC46B'))
$word  = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#E8EAF0'))
$muted = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#8B93A3'))
$pg.DrawString('CineCatalog', $font, $word, (New-Object System.Drawing.RectangleF(0, 600, $pw, 60)), $fmt)
$pg.DrawString('MOVIES  ·  TV  ·  PEOPLE', $small, $muted, (New-Object System.Drawing.RectangleF(0, 668, $pw, 40)), $fmt)
$pg.Dispose()
$preview.Save($outPreview, [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose(); $brush.Dispose(); $gp.Dispose(); $preview.Dispose()

Write-Host "vector  : $outVector"
Write-Host "png     : $outPng"
Write-Host "preview : $outPreview"
Write-Host "pathData length: $($pathData.Length)"
