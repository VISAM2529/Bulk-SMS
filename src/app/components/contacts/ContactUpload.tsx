"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ContactUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    
    setIsUploading(true)
    
    // Simulate upload with progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
    
    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval)
      setIsUploading(false)
      setUploadProgress(100)
      
      // Show success message before redirecting
      setTimeout(() => {
        router.push('/contacts')
      }, 1000)
    }, 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadProgress(0)
    }
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-md mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Upload Contacts</h1>
          <p className="text-gray-600 mt-1">Import your contacts from a CSV or Excel file</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact File
              </label>
              
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.xls"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                  file 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                } ${isUploading ? 'opacity-50' : ''}`}>
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  
                  {file ? (
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(file.size / 1024).toFixed(1)} KB • {file.type}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        CSV or Excel files only
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {isUploading && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 text-center">
                  Uploading... {uploadProgress}% complete
                </p>
              </div>
            )}

            {/* Success Message */}
            {uploadProgress === 100 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-green-800">Upload successful! Redirecting...</p>
                </div>
              </div>
            )}

            {/* Requirements */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">File Requirements</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  CSV or Excel format
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Include name and phone number columns
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Maximum file size: 10MB
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push('/contacts')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center"
                disabled={isUploading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Cancel
              </button>

              <button
                type="submit"
                disabled={!file || isUploading}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Upload Contacts
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}