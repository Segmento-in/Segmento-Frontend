import sys
try:
    from PIL import Image
except ImportError:
    print("Pillow library is missing. Please run: pip install Pillow")
    sys.exit(1)

def erase_subtext():
    # File paths
    img_path = 'public/images/segmento_logo.png'
    out_path = 'public/images/segmento_logo_clean.png'
    
    try:
        img = Image.open(img_path).convert("RGBA")
    except Exception as e:
        print(f"Error loading image: {e}")
        sys.exit(1)
        
    width, height = img.size
    print(f"Loaded logo: {width}x{height} pixels")
    
    # We will sample the background color from the bottom-right corner
    # This ensures we paint over the text with the exact same background color (white or transparent).
    pixels = img.load()
    bg_color = pixels[width - 1, height - 1] 
    
    # ==========================================
    # 🎯 UPDATED TARGETING COORDINATES 🎯
    # The previous script missed because the text is higher up!
    # Also, we cannot erase the entire bottom half because it would clip 
    # the bottom of the circular graphic on the left.
    # We only erase the BOTTOM-RIGHT quadrant.
    # ==========================================
    box_left = 210    # Start safely to the right of the circular logo mark
    box_top = 235     # Start just below "DATA TECHNOLOGIES"
    box_right = width
    box_bottom = height
    
    for x in range(box_left, box_right):
        for y in range(box_top, box_bottom):
            pixels[x, y] = bg_color  # Paint over with background color
            
    img.save(out_path)
    print(f"✅ Saved cleaned logo to {out_path}")
    print("Please visually check the new logo. The subtext should now be completely gone while the circular graphic remains perfectly intact.")

if __name__ == '__main__':
    erase_subtext()
