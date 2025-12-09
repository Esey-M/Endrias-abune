# Church Website - Bilingual (Tigrinya & Dutch)

A complete, fully responsive church website built with HTML, Tailwind CSS, and vanilla JavaScript, featuring bilingual support for Tigrinya (ti) and Dutch (nl).

## Features

- 🌍 **Bilingual Support**: Full translation system for Tigrinya and Dutch
- 📱 **Fully Responsive**: Works seamlessly on all devices (mobile, tablet, desktop)
- 🎨 **Modern Design**: Clean, professional church-friendly design using Tailwind CSS
- 🔄 **Language Persistence**: Selected language is saved in localStorage
- ⚡ **Fast & Lightweight**: Pure vanilla JavaScript, no heavy frameworks
- 🔒 **Secure**: Form validation and secure practices

## Pages

1. **Home** (`index.html`) - Welcome page with overview
2. **About Us** (`about.html`) - Information about the church
3. **Mission** (`mission.html`) - Church mission statement
4. **Vision** (`vision.html`) - Church vision statement
5. **Yearbook** (`yearbook.html`) - Annual activities with accordion layout
6. **Services** (`services.html`) - Weekly services roster table
7. **Church Leaders** (`church-leaders.html`) - 5 church leader profiles
8. **Sunday School Leaders** (`sunday-school-leaders.html`) - 8 Sunday school leader profiles
9. **Contact** (`contact.html`) - Contact form with location and service times

## File Structure

```
/
├── index.html
├── about.html
├── mission.html
├── vision.html
├── yearbook.html
├── services.html
├── church-leaders.html
├── sunday-school-leaders.html
├── contact.html
├── js/
│   ├── translations.js    # Translation data (Tigrinya & Dutch)
│   └── language.js        # Language switching logic
├── images/
│   ├── leaders/           # Leader profile images
│   └── church/            # Church photos
└── README.md
```

## Usage

1. Open `index.html` in a web browser
2. Use the language toggle buttons (Ti/NL) in the navigation bar to switch languages
3. Navigate through the pages using the navigation menu

## Language System

The website uses a JSON-based translation system:

- All translatable text uses the `data-translate` attribute
- Translations are stored in `js/translations.js`
- Language switching is handled by `js/language.js`
- Selected language is saved in localStorage

### Adding Translations

To add new translations, edit `js/translations.js`:

```javascript
const translations = {
  ti: {
    new_key: "ትርጉም",
    // ...
  },
  nl: {
    new_key: "Vertaling",
    // ...
  }
};
```

Then use in HTML:
```html
<p data-translate="new_key">Default text</p>
```

## Customization

### Changing Church Name

Replace "Church Name" in all HTML files with your actual church name.

### Adding Leader Images

1. Add leader images to `images/leaders/`
2. Update the image paths in `church-leaders.html` and `sunday-school-leaders.html`:

```html
<img src="images/leaders/leader1.jpg" class="w-32 h-32 rounded-full mx-auto mb-4">
```

### Updating Contact Information

Edit `contact.html` to update:
- Address
- Email
- Phone number
- Google Maps embed URL

### Modifying Colors

The website uses Tailwind CSS. To change colors, modify the color classes:
- `blue-600`, `blue-700`, `blue-800` - Primary colors
- `gray-50`, `gray-100`, `gray-700` - Secondary colors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Features

- Form validation on contact form
- XSS protection through proper HTML escaping
- Secure form handling


## Support

For questions or support, please contact the church administration.

