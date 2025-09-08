"use client"
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button and logo */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white mr-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Logo/Brand - Hidden on small screens, visible on medium+ */}
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <span className="text-xl font-bold hidden md:block">Bulk Messenger</span>
            </div>
          </div>

          {/* User section */}
          {user && (
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-indigo-200 truncate max-w-[120px]">{user.email}</span>
              </div>
              
              <div className="relative group">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium border-2 border-white text-sm md:text-base">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                
                {/* Dropdown menu - Hidden on mobile, visible on hover */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform -translate-y-2 group-hover:translate-y-0 hidden md:block">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      Sign out
                    </div>
                  </button>
                </div>
              </div>

              {/* Mobile logout button (visible on small screens) */}
              <button 
                onClick={handleLogout}
                className="md:hidden bg-indigo-500 hover:bg-indigo-400 p-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}