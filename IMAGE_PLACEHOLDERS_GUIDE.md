# Image Placeholders Guide

This document lists all image placeholders added to the landing page and where to add your actual images.

## 📍 Location: Hero Section - Floating Cards (Right Side)

### 1. Heritage Trams Card
- **File**: `app/page.tsx` (Line ~76)
- **Current**: Gradient placeholder with "Tram Image" text
- **Suggested Image**: Kolkata heritage tram, vintage yellow tram on street
- **Dimensions**: ~192px x 96px (w-full h-24)
- **Style**: Should fit rounded card aesthetic

**How to Add**:
```tsx
<div className="w-full h-24 bg-gradient-to-br from-[#FF9B82] to-[#FFDAC1] flex items-center justify-center">
  <img 
    src="/images/kolkata-tram.jpg" 
    alt="Heritage Trams" 
    className="w-full h-full object-cover"
  />
</div>
```

---

### 2. Chai Corners Card
- **File**: `app/page.tsx` (Line ~87)
- **Current**: Gradient placeholder with "Chai Corner Image" text
- **Suggested Image**: Traditional chai stall, clay cups (bhar), people drinking chai
- **Dimensions**: ~224px x 128px (w-full h-32)
- **Style**: Warm, inviting atmosphere

**How to Add**:
```tsx
<div className="w-full h-32 bg-gradient-to-br from-[#FFDAC1] to-[#FF9B82] flex items-center justify-center">
  <img 
    src="/images/chai-corner.jpg" 
    alt="Chai Corners" 
    className="w-full h-full object-cover"
  />
</div>
```

---

### 3. Book Havens Card
- **File**: `app/page.tsx` (Line ~98)
- **Current**: Gradient placeholder with "Bookstore Image" text
- **Suggested Image**: College Street bookstores, stacked books, vintage library
- **Dimensions**: ~208px x 112px (w-full h-28)
- **Style**: Scholarly, cozy bookshop vibe

**How to Add**:
```tsx
<div className="w-full h-28 bg-gradient-to-br from-[#A8D8EA] to-[#B4E7CE] flex items-center justify-center">
  <img 
    src="/images/bookstore.jpg" 
    alt="Book Havens" 
    className="w-full h-full object-cover"
  />
</div>
```

---

## 📍 Location: Featured Hidden Gems Gallery

### 4. Featured Gem 1 - College Street
- **File**: `app/page.tsx` (Line ~178)
- **Current**: Gradient placeholder with "Featured Gem Image 1"
- **Suggested Image**: College Street book market, stalls with stacked books
- **Dimensions**: Full width x 224px (w-full h-56)
- **Style**: Vibrant, bustling market scene

**How to Add**:
```tsx
<div className="w-full h-56 bg-gradient-to-br from-[#FF9B82] to-[#FFDAC1] flex items-center justify-center">
  <img 
    src="/images/college-street.jpg" 
    alt="College Street" 
    className="w-full h-full object-cover"
  />
</div>
```

---

### 5. Featured Gem 2 - Prinsep Ghat
- **File**: `app/page.tsx` (Line ~193)
- **Current**: Gradient placeholder with "Featured Gem Image 2"
- **Suggested Image**: Prinsep Ghat monument, riverside sunset, Hooghly River
- **Dimensions**: Full width x 224px (w-full h-56)
- **Style**: Sunset/golden hour, serene waterfront

**How to Add**:
```tsx
<div className="w-full h-56 bg-gradient-to-br from-[#E6B8D7] to-[#A8D8EA] flex items-center justify-center">
  <img 
    src="/images/prinsep-ghat.jpg" 
    alt="Prinsep Ghat" 
    className="w-full h-full object-cover"
  />
</div>
```

---

### 6. Featured Gem 3 - Marble Palace
- **File**: `app/page.tsx` (Line ~208)
- **Current**: Gradient placeholder with "Featured Gem Image 3"
- **Suggested Image**: Marble Palace mansion, ornate architecture, courtyard
- **Dimensions**: Full width x 224px (w-full h-56)
- **Style**: Heritage architecture, elegant details

**How to Add**:
```tsx
<div className="w-full h-56 bg-gradient-to-br from-[#B4E7CE] to-[#FFDAC1] flex items-center justify-center">
  <img 
    src="/images/marble-palace.jpg" 
    alt="Marble Palace" 
    className="w-full h-full object-cover"
  />
</div>
```

---

## 📂 Recommended Folder Structure

Create an `images` folder in your `public` directory:

```
public/
  └── images/
      ├── kolkata-tram.jpg
      ├── chai-corner.jpg
      ├── bookstore.jpg
      ├── college-street.jpg
      ├── prinsep-ghat.jpg
      └── marble-palace.jpg
```

## 🎨 Image Guidelines

1. **Format**: Use `.jpg` or `.webp` for photos
2. **Optimization**: Compress images (keep under 200KB each)
3. **Aspect Ratios**: 
   - Floating cards: Landscape/square (2:1 to 1:1)
   - Featured gems: Landscape (16:9 or 3:2)
4. **Colors**: Images with warm tones work best with the pastel palette
5. **Quality**: High resolution but compressed (use tools like TinyPNG)

## 🔍 Where to Find Images

- **Unsplash**: Search "Kolkata", "Kolkata tram", "College Street Kolkata"
- **Pexels**: Free stock photos
- **Your own photos**: Best option for authenticity!

## ⚡ Quick Replace Command

Once you have your images in `public/images/`, simply replace the entire placeholder `<div>` with an `<img>` tag as shown in the examples above.

## 📝 Notes

- All placeholders have TODO comments in the code for easy searching
- Keep the `object-cover` class to maintain proper image scaling
- Maintain the same wrapper div structure for styling consistency
- The gradient backgrounds will be replaced by your images
