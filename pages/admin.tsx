
import { useEffect, useState } from 'react';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string;

type Uploaded = { secure_url: string; public_id: string };

export default function Admin() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploads, setUploads] = useState<Uploaded[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError('Missing Cloudinary env vars. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.');
    }
  }, []);

  async function uploadAll() {
    if (!files) return;
    setBusy(true); setError(null);
    const list: Uploaded[] = [];
    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append('file', file);
      body.append('upload_preset', UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body });
      const json = await res.json();
      if (json.secure_url) list.push({ secure_url: json.secure_url, public_id: json.public_id });
      else setError(json?.error?.message || 'Upload failed');
    }
    setUploads(prev => [...prev, ...list]);
    setBusy(false);
  }

  return (
    <main style={{fontFamily:'system-ui, -apple-system, Segoe UI, Roboto', padding:24, maxWidth:1000, margin:'0 auto'}}>
      <h1>Admin – Upload Images to Cloudinary</h1>
      <p>Uploads go directly to your Cloudinary: <b>{CLOUD_NAME || '(missing)'}</b> with preset <b>{UPLOAD_PRESET || '(missing)'}</b>.</p>

      <input type="file" multiple accept="image/*" onChange={e=>setFiles(e.target.files)} />
      <button disabled={!files || busy} onClick={uploadAll} style={{marginLeft:8, padding:'8px 14px', borderRadius:10, border:'1px solid #ccc'}}>
        {busy ? 'Uploading…' : 'Upload selected files'}
      </button>
      {error && <p style={{color:'crimson'}}>{error}</p>}

      <hr/>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:12}}>
        {uploads.map(u => (
          <figure key={u.public_id} style={{margin:0}}>
            <img src={u.secure_url} alt={u.public_id} style={{width:'100%',height:180,objectFit:'cover',borderRadius:12}}/>
            <figcaption style={{fontSize:12, wordBreak:'break-all'}}>{u.public_id}</figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
