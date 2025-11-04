'use client';
import React, { useState } from 'react';

type Size = '40x40' | '60x60';
type Color = 'white' | 'black' | 'lime' | 'orange' | 'blue' | 'yellow';

export default function Page() {
  const [size, setSize] = useState<Size>('40x40');
  const [epoxy, setEpoxy] = useState<boolean>(false);
  const [color, setColor] = useState<Color>('white');
  const [quantity, setQuantity] = useState<number>(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setImageFile(f);
    if (f) setImagePreview(URL.createObjectURL(f));
    else setImagePreview(null);
  }

  async function uploadToCloudinary() {
    if (!imageFile) return;
    if (!cloudName || !uploadPreset) {
      alert('Cloudinary env vars missing');
      return;
    }
    setIsUploading(true);
    const form = new FormData();
    form.append('file', imageFile);
    form.append('upload_preset', uploadPreset as string);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: form });
    const data = await res.json();
    if (data?.secure_url) setUploadedUrl(data.secure_url);
    setIsUploading(false);
  }

  async function checkout() {
    setIsCheckingOut(true);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ size, epoxy, color, quantity, imageUrl: uploadedUrl })
    });
    if (!res.ok) {
      setIsCheckingOut(false);
      alert('Checkout failed');
      return;
    }
    const data = await res.json();
    window.location.href = data.url;
  }

  return (
    <div style={{background:'#fff', border:'1px solid #eee', borderRadius:12, padding:24, boxShadow:'0 2px 8px rgba(0,0,0,.04)'}}>
      <h1 style={{marginTop:0}}>Customize your Symbol Board</h1>
      <p>Upload your image and choose options. Demo pricing is handled at checkout.</p>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}}>
        <section>
          <label style={{display:'block', margin:'12px 0 6px'}}>Upload image</label>
          <input type="file" accept="image/*" onChange={onFileChange} />
          {imagePreview && (
            <div style={{marginTop:12}}>
              <img src={imagePreview} alt="preview" style={{maxWidth:'100%', borderRadius:8, border:'1px solid #ddd'}}/>
            </div>
          )}
          <button onClick={uploadToCloudinary} disabled={!imageFile || isUploading} style={{marginTop:12, padding:'8px 12px'}}>
            {isUploading ? 'Uploading…' : uploadedUrl ? 'Re-upload' : 'Upload to Cloudinary'}
          </button>
          {uploadedUrl && <p style={{fontSize:12, color:'#0a0'}}>Uploaded ✓</p>}
        </section>

        <section>
          <div style={{display:'grid', gap:12}}>
            <div>
              <label>Size</label><br/>
              <select value={size} onChange={e=>setSize(e.target.value as Size)}>
                <option value="40x40">40×40 mm</option>
                <option value="60x60">60×60 mm</option>
              </select>
            </div>
            <div>
              <label>Epoxy</label><br/>
              <select value={epoxy ? 'yes' : 'no'} onChange={e=>setEpoxy(e.target.value==='yes')}>
                <option value="no">No epoxy</option>
                <option value="yes">Epoxy</option>
              </select>
            </div>
            <div>
              <label>Color</label><br/>
              <div style={{display:'flex', gap:8}}>
                {(['white','black','lime','orange','blue','yellow'] as Color[]).map(c => (
                  <button key={c} onClick={()=>setColor(c)} aria-label={c}
                    style={{width:28, height:28, borderRadius:'50%', border: color===c ? '3px solid #333' : '1px solid #ccc', background:
                      c==='white' ? '#fff' :
                      c==='black' ? '#000' :
                      c==='lime' ? '#a3e635' :
                      c==='orange' ? '#fb923c' :
                      c==='blue' ? '#3b82f6' : '#facc15'
                    }} />
                ))}
              </div>
            </div>
            <div>
              <label>Quantity</label><br/>
              <input type="number" min={1} value={quantity} onChange={e=>setQuantity(parseInt(e.target.value||'1'))}/>
            </div>
            <button onClick={checkout} disabled={isCheckingOut} style={{padding:'10px 14px', fontWeight:600}}>
              {isCheckingOut ? 'Redirecting…' : 'Buy with Stripe'}
            </button>
            <p style={{fontSize:12, color:'#666'}}>Upload first to include your image in the order metadata.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
