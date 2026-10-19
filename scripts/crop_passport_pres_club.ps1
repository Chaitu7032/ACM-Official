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

# 1. Shaik Haaris: 690w x 504h.
# Head is centered around x: 370, y: 240.
# Maximum square height is 504.
# srcSize = 500, srcY = 0, srcX = 370 - 250 = 120. (120 + 500 = 620 <= 690)
Crop-Headshot -sourcePath "public\team-photos\Shaik Haaris.png" -destPath "public\team-photos\haaris_passport.jpg" -rotateTurns 0 -srcX 120 -srcY 0 -srcWidth 500 -srcHeight 500 -outSize 800

# 2. Angel Pratibha Mukherjee: 1368w x 1150h.
# Head is centered around x: 670, y: 550.
# Square crop of 1120x1120:
# srcY = 0, srcX = 670 - 560 = 110. (110 + 1120 = 1230 <= 1368)
Crop-Headshot -sourcePath "public\team-photos\angel pratibha mukherjee.png" -destPath "public\team-photos\angel_passport.jpg" -rotateTurns 0 -srcX 110 -srcY 0 -srcWidth 1120 -srcHeight 1120 -outSize 800
