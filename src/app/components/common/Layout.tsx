"use client"
import { useAuth } from '../../contexts/AuthContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useState } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) return <>{children}</> // No layout for auth pages

  return (
    <div className="flex h-screen">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - Hidden on mobile by default */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}