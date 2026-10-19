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

# 1. Dhyanesh: Width is 700, Height is 1331.
# To keep strictly within 0..700 width, take srcX=0, srcWidth=700.
# Height: 700 to match aspect ratio 1:1.
# Vertical range: head starts around 380. So srcY=320, srcHeight=700 goes from 320 to 1020. Perfectly centered and within bounds!
Crop-Headshot -sourcePath "public\team-photos\blehh - DHYANESH VINOTHKUMAR 24BCE7282.png" -destPath "public\team-photos\dhyanesh_passport.jpg" -rotateTurns 0 -srcX 0 -srcY 320 -srcWidth 700 -srcHeight 700 -outSize 800

# 2. Sreeyansh: Center face slightly more
Crop-Headshot -sourcePath "public\team-photos\SREEYANSH THOGITI.jpeg" -destPath "public\team-photos\sreeyansh_passport.jpg" -rotateTurns 90 -srcX 650 -srcY 1600 -srcWidth 2000 -srcHeight 2000 -outSize 800

# 3. Gowthami: Center head and upper shoulders closely for passport style
Crop-Headshot -sourcePath "public\team-photos\KORTHAM GOWTHAMI.jpeg" -destPath "public\team-photos\gowthami_passport.jpg" -rotateTurns 90 -srcX 800 -srcY 1500 -srcWidth 1250 -srcHeight 1250 -outSize 800

# 4. Siddhartha: Center head and upper shoulders
Crop-Headshot -sourcePath "public\team-photos\BODDU VENKAT SAI SIDDHARTHA 25BCA8078.jpg" -destPath "public\team-photos\siddhartha_passport.jpg" -rotateTurns 0 -srcX 650 -srcY 1600 -srcWidth 1000 -srcHeight 1000 -outSize 800
