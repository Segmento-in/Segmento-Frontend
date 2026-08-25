from PIL import Image
import os

def analyze_and_crop(image_path, output_path):
    try:
        if not os.path.exists(image_path):
            print(f"File not found: {image_path}")
            return

        img = Image.open(image_path)
        img = img.convert("RGBA")
        
        # Get bounding box of non-transparent pixels
        bbox = img.getbbox()
        
        print(f"--- Logo Analysis ---")
        print(f"Original dimensions: {img.width}x{img.height}")
        
        if bbox:
            print(f"Non-transparent bounding box: {bbox} (Left, Top, Right, Bottom)")
            
            # Crop the image
            cropped_img = img.crop(bbox)
            print(f"Cropped dimensions: {cropped_img.width}x{cropped_img.height}")
            
            # Calculate how much empty space there was
            empty_width_percent = 100 - (cropped_img.width / img.width * 100)
            empty_height_percent = 100 - (cropped_img.height / img.height * 100)
            print(f"Empty space removed: {empty_width_percent:.1f}% width, {empty_height_percent:.1f}% height")
            
            # Save the cropped image
            cropped_img.save(output_path)
            print(f"\nSuccess! Cropped image saved to: {output_path}")
        else:
            print("Image is entirely transparent or empty!")
            
    except ImportError:
        print("Error: Pillow library is not installed.")
        print("Please install it by running: pip install Pillow")
    except Exception as e:
        print(f"Error analyzing image: {e}")

# Paths
input_image = r"c:\Users\HP\Desktop\Segmento\Segmento-Frontend\apps\sense\public\images\logo.png"
output_image = r"c:\Users\HP\Desktop\Segmento\Segmento-Frontend\apps\sense\public\images\logo_cropped.png"

analyze_and_crop(input_image, output_image)
