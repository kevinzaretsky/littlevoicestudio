export const metadata = {
  title: 'Little Voice Studio',
  description: 'Custom symbol products',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{fontFamily:'system-ui, sans-serif', margin:0, padding:0, background:'#fafafa'}}>
        <header style={{padding:'16px 24px', background:'#111', color:'#fff'}}>
          <div style={{maxWidth:960, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <strong>Little Voice Studio</strong>
            <nav style={{opacity:.8}}>Customizer • Checkout</nav>
          </div>
        </header>
        <main style={{maxWidth:960, margin:'32px auto', padding:'0 16px'}}>{children}</main>
        <footer style={{padding:'24px', textAlign:'center', fontSize:12, color:'#666'}}>© {new Date().getFullYear()} Little Voice Studio</footer>
      </body>
    </html>
  );
}
