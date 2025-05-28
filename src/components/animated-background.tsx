'use client'

import React from 'react'

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100" />
      
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute w-96 h-96 -top-48 -right-48 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute w-96 h-96 -bottom-48 left-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </div>
    </div>
  )
}
