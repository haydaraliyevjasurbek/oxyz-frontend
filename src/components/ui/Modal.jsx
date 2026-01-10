import React from 'react'

export default function Modal({ open, onClose, children, title }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-slate-900 rounded-xl shadow-xl w-full max-w-md mx-4 relative">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="text-lg font-semibold text-slate-100">{title}</div>
          <button
            className="text-slate-400 hover:text-slate-200 text-xl font-bold px-2"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            ×
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
