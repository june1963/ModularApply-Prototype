import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'

function TestApp() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-white">ModularApply Test - React is Working!</h1>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestApp />
  </StrictMode>,
)
