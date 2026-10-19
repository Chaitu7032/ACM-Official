Add-Type -AssemblyName System.Drawing

function Crop-Headshot {
    param(
        [string]$sourcePath,
        [string]$destPath,
        [int]$rotateTurns, # 0, 90, 180, 270
        [int]$srcX,
        [int]$srcY,
        [int]$srcWidth,
        [int]$srcHeight,
        [int]$outSize = 800
    )
    $fullSrc = (Resolve-Path $sourcePath).Path
    $fullDest = Join-Path (Get-Location).Path $destPath
    $img = [System.Drawing.Image]::FromFile($fullSrc)
    
    if ($rotateTurns -eq 90) {
        $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone)
    } elseif ($rotateTurns -eq 180) {
        $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone)
    } elseif ($rotateTurns -eq 270) {
        $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone)
    }

    $bmp = New-Object System.Drawing.Bitmap($outSize, $outSize)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $destRect = New-Object System.Drawing.Rectangle(0, 0, $outSize, $outSize)
    $srcRect = New-Object System.Drawing.Rectangle($srcX, $srcY, $srcWidth, $srcHeight)

    $g.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]95)
    
    $bmp.Save($fullDest, $codec, $encoderParams)

    $g.Dispose()
    $bmp.Dispose()
    $img.Dispose()
    Write-Host "Saved cropped passport photo to $fullDest"
}

# R.Sai Ganesh: 1200w x 1600h.
# Head is centered around x: 550, y: 400.
# Size: 800x800 square
# srcX = 550 - 400 = 150.
# srcY = 140.
Crop-Headshot -sourcePath "public\team-photos\R.Sai Ganesh.jpeg" -destPath "public\team-photos\sai_ganesh_passport.jpg" -rotateTurns 0 -srcX 160 -srcY 140 -srcWidth 800 -srcHeight 800 -outSize 800
