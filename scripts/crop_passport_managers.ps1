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

# 1. Yazhini: 616x960. Head is in upper center around x:60..550, y:200..650.
Crop-Headshot -sourcePath "public\team-photos\WhatsApp Image 2026-08-14 at 10.23.33 PM - YAZHINI K B 23BCE8736.jpeg" -destPath "public\team-photos\yazhini_passport.jpg" -rotateTurns 0 -srcX 60 -srcY 200 -srcWidth 480 -srcHeight 480 -outSize 800

# 2. Nihitha: 1972x4096. Head is around x:500..1600, y:1000..2100.
Crop-Headshot -sourcePath "public\team-photos\MUPPARAJU NIHITHA CHOWDARY.jpg" -destPath "public\team-photos\nihitha_passport.jpg" -rotateTurns 0 -srcX 350 -srcY 1050 -srcWidth 1300 -srcHeight 1300 -outSize 800

# 3. Dharineesh MR: 1396x1546.
Crop-Headshot -sourcePath "public\team-photos\DHARINEESH M R.jpg" -destPath "public\team-photos\dharineesh_passport.jpg" -rotateTurns 0 -srcX 70 -srcY 50 -srcWidth 1250 -srcHeight 1250 -outSize 800
