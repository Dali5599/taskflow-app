import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/lib/hooks/use-dark-mode'
import { AuthProvider } from '@/lib/hooks/use-auth'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export const metadata: Metadata = {
  title: '📋 TaskFlow - Task Management Pro',
  description: 'Application moderne de gestion de tâches avec React, Next.js et Tailwind CSS',
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <div className="flex min-h-screen">
              {/* Sidebar - Navigation */}
              <aside className="fixed left-0 top-0 h-screen z-20">
                <Sidebar />
              </aside>

              {/* Main Content */}
              <div className="flex-1 ml-64">
                {/* Header */}
                <Header />

                {/* Page Content */}
                <main className="p-6 animate-fade-in">
                  {children}
                </main>
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
