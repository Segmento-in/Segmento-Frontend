from PIL import Image
import os

def remove_bg_and_crop(image_path, output_path):
    try:
        if not os.path.exists(image_path):
            print(f"File not found: {image_path}")
            return

        print("--- Advanced Logo Processing ---")
        img = Image.open(image_path).convert("RGBA")
        width, height = img.size
        pixels = img.load()
        
        # Sample the 4 corners to find the background color
        corners = [
            pixels[0, 0], pixels[width-1, 0],
            pixels[0, height-1], pixels[width-1, height-1]
        ]
        # Most common corner color is assumed to be the background
        bg_color = max(set(corners), key=corners.count)
        print(f"Detected solid background color: {bg_color}")
        
        tolerance = 20 # Allows for slight compression artifacts
        
        datas = img.getdata()
        new_data = []
        for item in datas:
            # Check if pixel matches background within tolerance
            if (abs(item[0] - bg_color[0]) <= tolerance and 
                abs(item[1] - bg_color[1]) <= tolerance and 
                abs(item[2] - bg_color[2]) <= tolerance):
                new_data.append((255, 255, 255, 0)) # Make transparent
            else:
                new_data.append(item) # Keep original pixel
                
        img.putdata(new_data)
        
        bbox = img.getbbox()
        if bbox:
            print(f"New tight bounding box (after making background transparent): {bbox}")
            cropped = img.crop(bbox)
            
            # Calculate how much empty space there was
            empty_width_percent = 100 - (cropped.width / width * 100)
            empty_height_percent = 100 - (cropped.height / height * 100)
            
            print(f"Final true dimensions: {cropped.width}x{cropped.height}")
            print(f"Removed true empty space: {empty_width_percent:.1f}% width, {empty_height_percent:.1f}% height")
            
            cropped.save(output_path)
            print(f"\nSuccess! Perfect transparent cropped logo saved to: {output_path}")
        else:
            print("Image became completely transparent. Could not crop.")
            
    except Exception as e:
        print(f"Error processing image: {e}")

input_image = r"c:\Users\HP\Desktop\Segmento\Segmento-Frontend\apps\sense\public\images\logo.png"
output_image = r"c:\Users\HP\Desktop\Segmento\Segmento-Frontend\apps\sense\public\images\logo_transparent.png"

remove_bg_and_crop(input_image, output_image)
