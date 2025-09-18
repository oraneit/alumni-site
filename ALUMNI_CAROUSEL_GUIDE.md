# Alumni Spotlight Carousel Guide

## 🎠 **Auto-Scrolling Carousel Features**

Your alumni spotlight section now has a beautiful auto-scrolling carousel with:

- ✅ **Auto-scroll** every 4 seconds
- ✅ **Manual navigation** with arrow buttons
- ✅ **Dot indicators** for direct navigation
- ✅ **Hover to pause** auto-scrolling
- ✅ **Responsive design** for all devices
- ✅ **Dynamic loading** from JSON configuration
- ✅ **Fallback images** if files are missing

## 📁 **Adding New Alumni Images**

### Method 1: Update JSON File (Recommended)
1. Add your new images to the `images/` folder
2. Edit `alumni-images.json` and add new entries:

```json
{
  "file": "new-alumni.png",
  "name": "Alumni Name", 
  "role": "Their Role/Profession"
}
```

### Method 2: Direct File Upload
1. Simply add images to the `images/` folder
2. The carousel will automatically detect and include them
3. Use descriptive filenames like `firstname-lastname.png`

## 🖼️ **Image Requirements**

- **Format**: PNG, JPG, or WebP
- **Size**: Recommended 280x320px (or similar aspect ratio)
- **Quality**: High resolution for crisp display
- **Naming**: Use lowercase with hyphens (e.g., `john-doe.png`)

## ⚙️ **Carousel Settings**

You can customize the carousel by editing these values in `index.html`:

```javascript
// Auto-scroll timing (milliseconds)
this.autoScrollInterval = setInterval(() => {
  this.goToNext();
}, 4000); // Change this number

// Card width for responsive design
const cardWidth = 280; // Adjust card size
```

## 📱 **Responsive Behavior**

- **Desktop**: Shows multiple cards with smooth scrolling
- **Tablet**: Adjusts card size for optimal viewing
- **Mobile**: Single card view with touch-friendly controls

## 🎨 **Styling Customization**

The carousel uses CSS custom properties for easy theming:

```css
:root {
  --brand: #e8640a;    /* Accent color */
  --card: #fff;        /* Card background */
  --muted: #64748b;    /* Text color */
}
```

## 🔧 **Troubleshooting**

### Images not showing?
1. Check file paths in `alumni-images.json`
2. Ensure images are in the `images/` folder
3. Verify image file extensions match JSON entries

### Carousel not auto-scrolling?
1. Check browser console for JavaScript errors
2. Ensure there are multiple images loaded
3. Try refreshing the page

### Performance issues?
1. Optimize image file sizes (compress images)
2. Limit to 10-15 images for best performance
3. Use WebP format for smaller file sizes

## 📊 **Current Alumni Images**

The carousel now includes 16 alumni profiles:
- **Samiksha** (Makeup Artist)
- **Narinder Singh** (Salon Owner & Beauty Entrepreneur)  
- **Vasvi Kapoor** (Hair Stylist & Salon Manager)
- **Aarti** (Makeup Artist & Beauty Expert)
- **Anamika** (Beauty Trainer & Hair Stylist)
- **Disha Bohral** (Beauty Expert)
- **Jyoti Pandey** (Makeup Artist)
- **Nisha Sharma** (Hair Stylist)
- **Nitu Solanki** (Beauty Consultant)
- **Riya** (Beauty Consultant)
- **Tannu** (Hair Stylist)
- **Viney** (Beauty Trainer)

Simply add more images to the `images/` folder and update `alumni-images.json` to expand the carousel!