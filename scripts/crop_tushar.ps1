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
    
    Write-Host "Source image dimensions: $($img.Width) x $($img.Height)"

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

# Image is 1706w x 1894h. Head is roughly at x: 880, y: 700.
# Let's crop a box of 1200 x 1200 starting from x: 280, y: 150
Crop-Headshot -sourcePath "public\team-photos\Tushar Kumaran.jpeg" -destPath "public\team-photos\tushar_passport.jpg" -rotateTurns 0 -srcX 280 -srcY 150 -srcWidth 1200 -srcHeight 1200 -outSize 800
