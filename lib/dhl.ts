type Address = {
  name: string;
  street: string;
  houseNumber?: string;
  postal: string;
  city: string;
  countryCode: string;
  email?: string;
  phone?: string;
};

export type DHLCreateLabelInput = {
  receiver: Address;
  reference: string;
  weightKG?: number;
};

function envRequired(k: string): string {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env ${k}`);
  return v;
}

export async function dhlCreateLabel(input: DHLCreateLabelInput): Promise<{ labelPdfBase64: string; trackingNumber: string; }>{

  const key = process.env.DHL_API_KEY;
  const mode = (process.env.DHL_MODE || 'demo').toLowerCase();

  if (mode !== 'dhl' || !key) {
    const dummyPdf = Buffer.from('%PDF-1.4\n% Fake DHL Demo Label\n%%EOF', 'utf8').toString('base64');
    return { labelPdfBase64: dummyPdf, trackingNumber: 'DHL-DEMO-TRACK-000000' };
  }

  const SHIPPER_NAME = envRequired('DHL_SHIPPER_NAME');
  const SHIPPER_STREET = envRequired('DHL_SHIPPER_STREET');
  const SHIPPER_HOUSENO = process.env.DHL_SHIPPER_HOUSENO || '';
  const SHIPPER_POSTAL = envRequired('DHL_SHIPPER_POSTAL');
  const SHIPPER_CITY = envRequired('DHL_SHIPPER_CITY');
  const SHIPPER_COUNTRY = process.env.DHL_SHIPPER_COUNTRY || 'DE';

  const EKP = envRequired('DHL_EKP');
  const BILLING_NUMBER = envRequired('DHL_BILLING_NUMBER');
  const PRODUCT_CODE = process.env.DHL_PRODUCT_CODE || 'V01PAK';
  const WEIGHT_KG = input.weightKG || Number(process.env.DHL_DEFAULT_WEIGHT_KG || '1');

  const payload = {
    profile: process.env.DHL_PROFILE || 'STANDARD_GRUPPENPROFIL',
    shipments: [{
      product: PRODUCT_CODE,
      billingNumber: `${EKP}${BILLING_NUMBER}`,
      reference: input.reference,
      shipper: {
        name1: SHIPPER_NAME,
        address: {
          streetName: SHIPPER_STREET,
          houseNumber: SHIPPER_HOUSENO,
          postalCode: SHIPPER_POSTAL,
          city: SHIPPER_CITY,
          country: SHIPPER_COUNTRY
        },
        email: process.env.DHL_SHIPPER_EMAIL || undefined,
        phone: process.env.DHL_SHIPPER_PHONE || undefined
      },
      consignee: {
        name1: input.receiver.name,
        address: {
          streetName: input.receiver.street,
          houseNumber: input.receiver.houseNumber || '',
          postalCode: input.receiver.postal,
          city: input.receiver.city,
          country: input.receiver.countryCode
        },
        email: input.receiver.email || undefined,
        phone: input.receiver.phone || undefined
      },
      details: {
        weight: { value: WEIGHT_KG, uom: 'kg' }
      },
      label: { format:'A6', printFormat:'PDF' }
    }]
  };

  const url = process.env.DHL_API_BASE || 'https://api-eu.dhl.com/parcel/de/shipping/v2/orders';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type':'application/json', 'DHL-API-Key': key },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DHL label error: ${res.status} ${res.statusText} — ${text}`);
  }

  const data = await res.json() as any;
  const s = data?.shipments?.[0];
  const trackingNumber = s?.shipmentNumber || s?.pieceIds?.[0] || 'UNKNOWN';
  const labelPdfBase64 = s?.label?.b64 || s?.labelData?.[0]?.b64;
  if (!labelPdfBase64) throw new Error('DHL response missing label PDF.');
  return { labelPdfBase64, trackingNumber };
}
