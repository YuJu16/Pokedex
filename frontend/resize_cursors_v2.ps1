
Add-Type -AssemblyName System.Drawing

$srcDir = "c:\Users\julia\Desktop\infoB3 2025-2026\NoSQL\tp-nosql-YuJu16\frontend\img"
$destDir = "c:\Users\julia\Desktop\infoB3 2025-2026\NoSQL\tp-nosql-YuJu16\frontend\public"
$files = @("cursornrml.png", "cursorpointe.png")

foreach ($file in $files) {
    try {
        $sourcePath = Join-Path $srcDir $file
        $destPath = Join-Path $destDir $file
        
        if (Test-Path $sourcePath) {
            Write-Host "Resizing $file..."
            
            $originalImage = [System.Drawing.Image]::FromFile($sourcePath)
            
            # Calculate new dimensions maintaining aspect ratio (max 32x32)
            $ratioX = 32 / $originalImage.Width
            $ratioY = 32 / $originalImage.Height
            $ratio = [Math]::Min($ratioX, $ratioY)
            
            $newWidth = [int]($originalImage.Width * $ratio)
            $newHeight = [int]($originalImage.Height * $ratio)
            
            # Create a 32x32 transparent canvas
            # Actually, browsers are fine with non-square cursors as long as they are small.
            # But let's stick to just the resized image to minimize empty space, or use 32x32 for consistency?
            # Let's use the precise new dimensions to avoid extra padding that might confuse the hotspot.
            # However, Windows cursors often use 32x32. Let's stick to just the image size.
            
            $newBitmap = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
            $graphics = [System.Drawing.Graphics]::FromImage($newBitmap)
            
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            
            $graphics.DrawImage($originalImage, 0, 0, $newWidth, $newHeight)
            
            $newBitmap.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
            
            $graphics.Dispose()
            $newBitmap.Dispose()
            $originalImage.Dispose()
            
            Write-Host "Resized $file to $newWidth x $newHeight"
        }
    } catch {
        Write-Error $_
    }
}
