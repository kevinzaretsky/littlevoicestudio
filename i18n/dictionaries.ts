import type { Locale } from './config';

const en = {
  brand: 'LittleVoiceStudio',
  tagline: 'Bloom of understanding 🌿',
  subline: 'Build custom symbol boards and order them with your photos. Upload, customize, and check out securely.',
  shopNow: 'Shop now',
  admin: 'Admin',
  cart: 'Cart',
  cartTitle: 'Cart',
  yourCartIsEmpty: 'Your cart is empty.',
  remove: 'Remove',
  clear: 'Clear',
  checkout: 'Checkout',
  uploadToCloudinary: 'Upload to Cloudinary',
  uploading: 'Uploading…',
  addToCart: 'Add to Cart',
  noProducts: 'No products yet. Go to Admin to add one.',
  noImage: 'No image',
  thankYou: 'Thank you! ✅',
  successText: 'We received your order. Stripe has sent a confirmation to your email.',
  shippingDHL: 'Shipping (DHL)',
  view: 'View',
  delete: 'Delete'
} as const;

const de = {
  brand: 'LittleVoiceStudio',
  tagline: 'Blüte des Verstehens 🌿',
  subline: 'Erstelle individuelle Symboltafeln mit deinen Fotos. Hochladen, anpassen und sicher bezahlen.',
  shopNow: 'Jetzt shoppen',
  admin: 'Admin',
  cart: 'Warenkorb',
  cartTitle: 'Warenkorb',
  yourCartIsEmpty: 'Dein Warenkorb ist leer.',
  remove: 'Entfernen',
  clear: 'Leeren',
  checkout: 'Zur Kasse',
  uploadToCloudinary: 'Zu Cloudinary hochladen',
  uploading: 'Lädt hoch…',
  addToCart: 'In den Warenkorb',
  noProducts: 'Noch keine Produkte. Gehe zu Admin, um eines anzulegen.',
  noImage: 'Kein Bild',
  thankYou: 'Vielen Dank! ✅',
  successText: 'Wir haben deine Bestellung erhalten. Stripe hat eine Bestätigung an deine E-Mail gesendet.',
  shippingDHL: 'Versand (DHL)',
  view: 'Ansehen',
  delete: 'Löschen'
} as const;

// Make Dict be "same keys as EN, values are generic strings"
export type Dict = { [K in keyof typeof en]: string };

// Cast the chosen dictionary to that widened type
export async function getDict(locale: Locale): Promise<Dict> {
  return (locale === 'de' ? de : en) as Dict;
}

