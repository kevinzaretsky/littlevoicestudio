// i18n/dictionaries.ts

export type Locale = 'en' | 'de';

export type Dict = {
  // Brand / hero
  brand: string;
  tagline: string;
  subline: string;

  // Common UI
  color: string;
  size: string;
  delete: string;
  remove: string;
  total: string;
  shipping: string;
  cart: string;
  yourCartEmpty: string;
  checkout: string;
  clear: string;
  redirecting: string;

  // Product / upload
  uploadLabel: string;
  upload: string;
  uploading: string;
  viewUpload: string;
  uploadChooseFile: string;
  pleaseUploadFirst: string;
  uploadFailed: string;
  addToCart: string;
  addToCartFailed: string;

  // Success page
  successHeading: string;
  successText: string;
};

const en: Dict = {
  brand: 'LittleVoiceStudio',
  tagline: 'Bloom of understanding 🌿',
  subline:
    'Build custom symbol boards and order them with your photos. Upload, customize, and check out securely.',

  color: 'Color',
  size: 'Size',
  delete: 'Delete',
  remove: 'Remove',
  total: 'Total',
  shipping: 'Shipping (DHL)',
  cart: 'Your cart',
  yourCartEmpty: 'Your cart is empty.',
  checkout: 'Checkout',
  clear: 'Clear',
  redirecting: 'Redirecting…',

  uploadLabel: 'Upload your image (JPG/PNG/PDF)',
  upload: 'Upload',
  uploading: 'Uploading…',
  viewUpload: 'View upload',
  uploadChooseFile: 'Please choose a file first.',
  pleaseUploadFirst: 'Please upload an image first.',
  uploadFailed: 'Upload failed',
  addToCart: 'Add to cart',
  addToCartFailed: 'Could not add to cart',

  successHeading: 'Thank you! 🎉',
  successText:
    'Your order was received. You will get a confirmation email shortly.',
};

const de: Dict = {
  brand: 'LittleVoiceStudio',
  tagline: 'Blüte des Verstehens 🌿',
  subline:
    'Erstelle individuelle Symboltafeln mit deinen Fotos. Hochladen, anpassen und sicher bezahlen.',

  color: 'Farbe',
  size: 'Größe',
  delete: 'Löschen',
  remove: 'Entfernen',
  total: 'Gesamt',
  shipping: 'Versand (DHL)',
  cart: 'Warenkorb',
  yourCartEmpty: 'Dein Warenkorb ist leer.',
  checkout: 'Zur Kasse',
  clear: 'Leeren',
  redirecting: 'Weiterleiten…',

  uploadLabel: 'Lade dein Bild hoch (JPG/PNG/PDF)',
  upload: 'Hochladen',
  uploading: 'Wird hochgeladen…',
  viewUpload: 'Upload ansehen',
  uploadChooseFile: 'Bitte wähle zuerst eine Datei aus.',
  pleaseUploadFirst: 'Bitte lade zuerst ein Bild hoch.',
  uploadFailed: 'Upload fehlgeschlagen',
  addToCart: 'In den Warenkorb',
  addToCartFailed: 'Konnte nicht zum Warenkorb hinzufügen',

  successHeading: 'Danke! 🎉',
  successText:
    'Deine Bestellung ist eingegangen. Du erhältst in Kürze eine Bestätigungs-E-Mail.',
};

export async function getDict(locale: Locale): Promise<Dict> {
  return locale === 'de' ? de : en;
}
