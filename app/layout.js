import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider publishableKey="pk_test_Y2hhbXBpb24tbW91c2UtOTA2NS5jbGVyay5hY2NvdW50cy5kZXY">
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}