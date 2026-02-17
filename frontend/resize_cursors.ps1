
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
            
            # Load original image
            $originalImage = [System.Drawing.Image]::FromFile($sourcePath)
            
            # Create new bitmap with target size (32x32)
            $newBitmap = New-Object System.Drawing.Bitmap(32, 32)
            $graphics = [System.Drawing.Graphics]::FromImage($newBitmap)
            
            # Set high quality settings
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

            # Draw resized image
            $graphics.DrawImage($originalImage, 0, 0, 32, 32)
            
            # Save new image
            $newBitmap.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
            
            # Cleanup
            $graphics.Dispose()
            $newBitmap.Dispose()
            $originalImage.Dispose()
            
            Write-Host "Successfully resized and saved to $destPath"
        } else {
            Write-Error "Source file not found: $sourcePath"
        }
    } catch {
        Write-Error "Error processing $file : $_"
    }
}
