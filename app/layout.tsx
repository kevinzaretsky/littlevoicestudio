import './globals.css'
export const metadata = { title: 'LittleVoiceStudio', description: 'Boards that build bridges.' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>)
}
