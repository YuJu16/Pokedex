
Add-Type -AssemblyName System.Drawing

$srcDir = "c:\Users\julia\Desktop\infoB3 2025-2026\NoSQL\tp-nosql-YuJu16\frontend\img"
$destDir = "c:\Users\julia\Desktop\infoB3 2025-2026\NoSQL\tp-nosql-YuJu16\frontend\public"
$files = @("cursornrml.png", "cursorpointe.png")

# Rotation angle (negative to rotate left/counter-clockwise seems appropriate if it's leaning right)
# Check: If it leans like \, rotation of 45 makes it -. If it leans like /, rotation of -45 makes it |
# Let's try -15 degrees first as "un peu" (a little bit). 
# User said: "ma baguette est pencher ... tourner l'image pour que ma baguette sois droit"
# If it's a wand, it's likely heavily tilted (diagonal). 
# I will try -45 degrees to make it vertical if it was diagonal.
$angle = -45 

foreach ($file in $files) {
    try {
        $sourcePath = Join-Path $srcDir $file
        $destPath = Join-Path $destDir $file
        
        if (Test-Path $sourcePath) {
            Write-Host "Processing $file..."
            
            $img = [System.Drawing.Image]::FromFile($sourcePath)
            
            # 1. Create a bitmap for the rotated image (large enough)
            # Calculate new bounds? For simplicity, make it square max 
            $dim = [Math]::Max($img.Width, $img.Height) * 1.5
            $bmp = New-Object System.Drawing.Bitmap([int]$dim, [int]$dim)
            $g = [System.Drawing.Graphics]::FromImage($bmp)
            
            $g.InterpolationMode = "HighQualityBicubic"
            $g.SmoothingMode = "HighQuality"
            
            # Center of the new bitmap
            $cx = $dim / 2
            $cy = $dim / 2
            
            # Move origin to center
            $g.TranslateTransform($cx, $cy)
            $g.RotateTransform($angle)
            $g.TranslateTransform(-$cx, -$cy)
            
            # Draw image centered
            $dx = ($dim - $img.Width) / 2
            $dy = ($dim - $img.Height) / 2
            $g.DrawImage($img, [float]$dx, [float]$dy)
            
            # 2. Extract the relevant content or just resize the whole thing?
            # Rotation introduces empty space. We want the content to fill 32x32 as much as possible.
            # Let's just resize this large rotated bitmap to 32x32. 
            # But the content is in the center, and we have lots of empty space now.
            # We should crop to content? No, too complex.
            # Let's simply resize the original to 32x32 valid box?
            # Actually, standard cursors should be top-left aligned.
            # If I rotate around center, the "tip" moves.
            
            # ALTERNATIVE: Just resize to 32x32 first, then rotate? No, quality loss.
            
            # Let's try a simpler approach for "Straightening".
            # Assume user wants it vertical.
            # Create final 32x32 bitmap.
            $final = New-Object System.Drawing.Bitmap(32, 32)
            $gf = [System.Drawing.Graphics]::FromImage($final)
            $gf.InterpolationMode = "HighQualityBicubic"
            
            # We want to draw the rotated image such that it fits in 32x32.
            # Let's verify what happens if we rotate around the center of 32x32 context.
            
            $gf.TranslateTransform(16, 16)
            $gf.RotateTransform($angle)
            $gf.TranslateTransform(-16, -16)
            
            # Draw the original image scaled down to fit?
            # Let's scale it to say 24x24 inside the 32x32 to leave room for rotation corners.
            $gf.DrawImage($img, 4, 4, 24, 24)
            
            $final.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
            
            $g.Dispose()
            $bmp.Dispose()
            $gf.Dispose()
            $final.Dispose()
            $img.Dispose()
            
            Write-Host "Rotated and saved $file"
        }
    } catch {
        Write-Error $_
    }
}
