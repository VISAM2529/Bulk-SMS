import './globals.css'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/common/Layout'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  )
}