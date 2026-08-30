Add-Type -AssemblyName System.Drawing

$filePath = Join-Path (Get-Location) "public/images/logo.png"
$bytes = [System.IO.File]::ReadAllBytes($filePath)
$ms = New-Object System.IO.MemoryStream($bytes, 0, $bytes.Length)
$bmp = [System.Drawing.Bitmap]::FromStream($ms)

$minX = $bmp.Width
$minY = $bmp.Height
$maxX = 0
$maxY = 0

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $pixel = $bmp.GetPixel($x, $y)
        if ($pixel.A -gt 15) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Original Size: $($bmp.Width) x $($bmp.Height)"
Write-Host "Tight Bounding Box: X=$minX..$maxX, Y=$minY..$maxY"

$w = $maxX - $minX + 1
$h = $maxY - $minY + 1

$rect = New-Object System.Drawing.Rectangle($minX, $minY, $w, $h)
$cropped = $bmp.Clone($rect, $bmp.PixelFormat)

$bmp.Dispose()
$ms.Dispose()

$cropped.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()

Write-Host "Cropped and saved successfully! New size: $w x $h"
