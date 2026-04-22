import './globals.css'

export const metadata = {
  title: 'FutureBabe - Meet Your Future Baby',
  description: 'Upload your photos and let AI show your future child.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div suppressHydrationWarning={true}>
          {children}
        </div>
      </body>
    </html>
  )
}
