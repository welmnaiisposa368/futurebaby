'use client'
import { useState } from 'react'
export default function TTSDemo() {
  const [customMessage, setCustomMessage] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('child-female')
  const [ttsGenerating, setTtsGenerating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const handleTTSPreview = async () => {
    setTtsGenerating(true)
    try {
      const response = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: customMessage.trim() || undefined,
          voiceId: selectedVoice,
          duration: 60,
          planType: 'standard'
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate voice preview')
      }
      const result = await response.json()
      setResult(result)
    } catch (error: any) {
      console.error('TTS preview error:', error)
      alert(error.message || 'Failed to generate voice preview')
    } finally {
      setTtsGenerating(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-500 text-white p-4 rounded-lg mb-8 text-center">
          <h1 className="text-2xl font-bold">🎧 Clean TTS Demo</h1>
          <p className="mt-2">Test TTS functionality without debug code</p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            🎧 Voice Message Generator
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Custom Message
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Enter your message here..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={300}
              />
              <div className="text-xs text-gray-500 mt-1">
                {customMessage.length}/300 characters
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice Style
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="child-female">Child Female (Sweet & Gentle)</option>
                <option value="child-male">Child Male (Playful & Warm)</option>
                <option value="young-female">Young Female (Soft & Caring)</option>
                <option value="young-male">Young Male (Friendly & Calm)</option>
              </select>
            </div>
            <button
              onClick={handleTTSPreview}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200"
              disabled={ttsGenerating}
            >
              {ttsGenerating ? '🔄 Generating...' : '🎵 Generate Voice'}
            </button>
            {result && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-bold text-green-800 mb-3">✅ Voice Generated Successfully!</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex justify-between">
                    <span className="font-medium">Message:</span>
                    <span className="text-right">"{result.text}"</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Voice:</span>
                    <span>{result.voice?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Duration:</span>
                    <span>{result.duration} seconds</span>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-blue-800 text-sm">
                      🎵 <strong>Audio Ready:</strong> In production, you would hear the generated voice message here.
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Demo URL: {result.audioUrl}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 text-center">
          <a href="/generate" className="text-blue-600 underline">← Back to Generate Page</a>
        </div>
      </div>
    </div>
  )
}