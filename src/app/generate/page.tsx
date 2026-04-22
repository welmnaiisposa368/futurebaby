// FIXED VERSION - TTS WORKING WITH ORIGINAL UI
'use client'

import { useState, useEffect } from 'react'
import FooterDisclaimer from '../../components/FooterDisclaimer'

type GenerationStep = 'upload' | 'pricing' | 'payment' | 'generating' | 'result'

interface UploadedImage {
  file: File
  preview: string
}

interface GenerationResult {
  babyImageURL: string
  babyAudioURL: string
  babyMessage: string
  babyName: string
}

export default function Generate() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState<GenerationStep>('upload')
  const [userImage, setUserImage] = useState<UploadedImage | null>(null)
  const [partnerImage, setPartnerImage] = useState<UploadedImage | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [voicesLoaded, setVoicesLoaded] = useState(false)

  // TTS相关状态
  const [customMessage, setCustomMessage] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('child-female')
  const [ttsGenerating, setTtsGenerating] = useState(false)
  const [ttsConfigured, setTtsConfigured] = useState(false)

  // 智能提示词选项
  const [babyOptions, setBabyOptions] = useState({
    eyeColor: 'auto',
    hairColor: 'auto',
    skinTone: 'auto',
    expression: 'auto',
    style: 'realistic'
  })

  // 确保组件在客户端渲染
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 初始化语音功能
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices()
        if (voices.length > 0) {
          setVoicesLoaded(true)
        }
      }

      // 立即尝试加载
      loadVoices()

      // 监听语音加载完成事件
      speechSynthesis.addEventListener('voiceschanged', loadVoices)

      return () => {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices)
      }
    }
  }, [])

  useEffect(() => {
    // Simulate loading user data (in real app, this would fetch from Supabase)
    const loadUserData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Set mock user data - free user ready to purchase plans
      setUser({
        email: 'user@example.com',
        id: 'user-demo-123', // Use fixed ID to avoid hydration mismatch
        created_at: '2024-01-01T00:00:00.000Z', // Use fixed date to avoid hydration mismatch
        is_subscribed: false,
        subscription_type: 'free',
        monthly_generations_used: 0,
        has_paid: false // Track if user has paid for this session
      })

      setLoading(false)
    }

    loadUserData()
  }, [])

  const handleImageUpload = (file: File, type: 'user' | 'partner') => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        const uploadedImage = { file, preview }

        if (type === 'user') {
          setUserImage(uploadedImage)
        } else {
          setPartnerImage(uploadedImage)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePlanSelection = (planType: string) => {
    setSelectedPlan(planType)
    setCurrentStep('payment')
  }

  const handlePaymentSuccess = async (paymentDetails: any) => {
    // Update user payment status
    setUser(prev => ({ ...prev, has_paid: true }))
    setCurrentStep('generating')

    // Simulate generation process
    await simulateGeneration()
  }

  // Handle TTS preview
  const handleTTSPreview = async () => {
    if (!selectedPlan) return

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
          duration: selectedPlan === 'experience' ? 30 : 60,
          planType: selectedPlan
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate voice preview')
      }

      const result = await response.json()

      // Play the generated audio (in real implementation)
      alert(`Voice preview generated! Text: "${result.text}" | Voice: ${result.voice.name}`)

    } catch (error: any) {
      console.error('TTS preview error:', error)
      alert(error.message || 'Failed to generate voice preview')
    } finally {
      setTtsGenerating(false)
    }
  }

  // Handle direct payment - HIGH CONVERSION RATE
  const handlePlanPurchase = async () => {
    if (!ttsConfigured) {
      alert('Please configure your TTS message first!')
      return
    }

    const planPrices = {
      'one-time': '$5.90',
      'monthly': '$12.90',
      'yearly': '$49.90',
      'experience': '$7.90',
      'standard': '$14.90',
      'gift': '$23.90',
      'annual': '$49.90'
    }

    const price = planPrices[selectedPlan as keyof typeof planPrices] || '$14.90'

    // Direct payment confirmation - no extra steps!
    const proceed = confirm(`💳 DIRECT PAYMENT\n\nPlan: ${selectedPlan}\nPrice: ${price}\nTTS: "${customMessage || 'Default message'}"\n\nProceed to payment?`)

    if (proceed) {
      // 直接进入生成步骤，显示美观的进度条
      setCurrentStep('generation')
      setGenerationProgress(0)

      // 开始生成进度动画
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setCurrentStep('result')
            return 100
          }
          return prev + 10
        })
      }, 500)
    }
  }

  const simulateGeneration = async () => {
    try {
      if (!userImage?.file || !partnerImage?.file) {
        alert('Please upload both images first')
        return
      }

      // Start progress animation
      setGenerationProgress(10)

      // Prepare form data for API call
      const formData = new FormData()
      formData.append('image1', userImage.file)
      formData.append('image2', partnerImage.file)

      // Add generation options
      formData.append('style', babyOptions.style)
      formData.append('age', 'baby')
      formData.append('gender', 'auto')

      // Add smart prompt options
      formData.append('eyeColor', babyOptions.eyeColor)
      formData.append('hairColor', babyOptions.hairColor)
      formData.append('skinTone', babyOptions.skinTone)
      formData.append('expression', babyOptions.expression)

      setGenerationProgress(30)

      // Call the real API
      const response = await fetch('/api/generate-baby', {
        method: 'POST',
        body: formData
      })

      setGenerationProgress(60)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Generation failed')
      }

      const apiResult = await response.json()

      setGenerationProgress(90)

      // Create result object
      const result: GenerationResult = {
        babyImageURL: apiResult.babyImageURL,
        babyAudioURL: apiResult.babyAudioURL,
        babyMessage: "👶 Listen to your baby's adorable sounds! This is how your little one might babble, coo, and make their first attempts at 'mama' and 'dada'! 💕",
        babyName: 'Your Beautiful Baby'
      }

      setGenerationProgress(100)

      // Small delay for smooth UX
      await new Promise(resolve => setTimeout(resolve, 500))

      setGenerationResult(result)
      setCurrentStep('result')

    } catch (error) {
      console.error('Generation error:', error)
      setGenerationProgress(0)

      // Show error to user
      const errorMessage = error instanceof Error ? error.message : 'Generation failed'
      alert(`❌ Generation failed: ${errorMessage}\n\nPlease try again or contact support if the problem persists.`)

      // Fall back to mock result for demo purposes
      const fallbackResult: GenerationResult = {
        babyImageURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
        babyAudioURL: 'https://www.soundjay.com/misc/sounds/baby-giggle-01.mp3',
        babyMessage: "👶 Listen to your baby's adorable sounds! This is how your little one might babble, coo, and make their first attempts at 'mama' and 'dada'! 💕",
        babyName: 'Your Beautiful Baby (Demo)'
      }

      setGenerationResult(fallbackResult)
      setCurrentStep('result')
    }
  }

  const canProceedToPricing = () => {
    return userImage && partnerImage
  }

  const handleContinueToPricing = () => {
    if (canProceedToPricing()) {
      setCurrentStep('pricing')
    }
  }

  const handleStartOver = () => {
    setCurrentStep('upload')
    setUserImage(null)
    setPartnerImage(null)
    setSelectedPlan(null)
    setGenerationResult(null)
    setGenerationProgress(0)
  }

  // 播放宝宝声音功能 - 使用 ElevenLabs AI 语音
  const handlePlayBabyVoice = async () => {
    console.log('Playing baby voice clicked', generationResult)

    if (!generationResult?.babyMessage) {
      if (typeof window !== 'undefined') {
        alert('No baby voice available to play')
      }
      return
    }

    try {
      // 显示加载状态
      const button = document.querySelector('[data-voice-button]') as HTMLButtonElement
      if (button) {
        button.disabled = true
        button.textContent = '🔄 Generating Voice...'
      }

      // 调用 ElevenLabs API 生成语音
      const response = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: generationResult.babyMessage,
          voiceSettings: {
            stability: 0.4,        // 稍微不稳定，更像婴儿
            similarity_boost: 0.8, // 高相似度
            style: 0.2,            // 轻微的风格化
            use_speaker_boost: true
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate voice')
      }

      const { audioData, mimeType } = await response.json()

      // 创建音频对象并播放
      const audioBlob = new Blob([
        Uint8Array.from(atob(audioData), c => c.charCodeAt(0))
      ], { type: mimeType })

      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      // 设置音频事件监听器
      audio.onloadstart = () => {
        console.log('Audio loading started')
      }

      audio.oncanplay = () => {
        console.log('Audio can start playing')
        audio.play().catch(error => {
          console.error('Audio play failed:', error)
          alert('Failed to play audio. Please try again or check your browser settings.')
        })
      }

      audio.onplay = () => {
        console.log('Audio playback started')
        if (button) {
          button.textContent = '🔊 Playing...'
        }
      }

      audio.onended = () => {
        console.log('Audio playback ended')
        URL.revokeObjectURL(audioUrl) // 清理内存
        if (button) {
          button.disabled = false
          button.textContent = '🔊 Play Baby\'s Voice'
        }
      }

      audio.onerror = (error) => {
        console.error('Audio playback error:', error)
        URL.revokeObjectURL(audioUrl)
        if (button) {
          button.disabled = false
          button.textContent = '🔊 Play Baby\'s Voice'
        }
        alert('Audio playback failed. Please try again.')
      }

      // 开始加载音频
      audio.load()

    } catch (error) {
      console.error('Voice generation error:', error)

      // 恢复按钮状态
      const button = document.querySelector('[data-voice-button]') as HTMLButtonElement
      if (button) {
        button.disabled = false
        button.textContent = '🔊 Play Baby\'s Voice'
      }

      // 回退到 Web Speech API
      console.log('Falling back to Web Speech API...')
      handlePlayBabyVoiceWebSpeech()
    }
  }

  // 备用的 Web Speech API 方法
  const handlePlayBabyVoiceWebSpeech = () => {
    if (!generationResult?.babyMessage) return

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        speechSynthesis.cancel()

        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(generationResult.babyMessage)
          utterance.rate = 0.8
          utterance.pitch = 1.5
          utterance.volume = 0.8
          utterance.lang = 'en-US'

          const voices = speechSynthesis.getVoices()
          if (voices.length > 0) {
            const femaleVoice = voices.find(voice =>
              voice.lang.startsWith('en') &&
              (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman'))
            )
            if (femaleVoice) {
              utterance.voice = femaleVoice
            }
          }

          speechSynthesis.speak(utterance)
        }, 100)
      } catch (error) {
        console.error('Web Speech API error:', error)
        alert('Voice playback failed. Please try again.')
      }
    } else {
      alert('Sorry, your browser does not support voice playback feature')
    }
  }

  // 下载照片功能
  const handleDownloadPhoto = () => {
    console.log('下载照片被点击', generationResult)

    if (!generationResult?.babyImageURL) {
      if (typeof window !== 'undefined') {
        alert('没有可下载的照片')
      }
      return
    }

    if (typeof window !== 'undefined') {
      try {
        // 创建一个临时链接来下载图片
        const link = document.createElement('a')
        link.href = generationResult.babyImageURL
        link.download = `future-baby-${Date.now()}.jpg`
        link.target = '_blank'
        link.rel = 'noopener noreferrer'

        // 添加到DOM，点击，然后移除
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        console.log('下载链接已触发')
      } catch (error) {
        console.error('下载失败:', error)
        // 备用方案：在新窗口打开图片
        window.open(generationResult.babyImageURL, '_blank')
      }
    }
  }

  // 与伴侣分享功能
  const handleShareWithPartner = () => {
    console.log('分享被点击', generationResult)

    if (!generationResult) {
      if (typeof window !== 'undefined') {
        alert('没有可分享的内容')
      }
      return
    }

    // 直接使用备用分享方法，避免原生分享API的兼容性问题
    fallbackShare()
  }

  // 备用分享方法
  const fallbackShare = () => {
    if (typeof window !== 'undefined' && generationResult) {
      const shareText = `🍼 Look at our future baby!

Baby says: "${generationResult.babyMessage}"

From FutureBabe - See your beautiful future together
${typeof window !== 'undefined' ? window.location.origin : 'https://futurebabe.com'}`

      try {
        // 复制到剪贴板
        if (typeof window !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareText).then(() => {
            if (typeof window !== 'undefined') {
              alert('✅ Share content copied to clipboard!\n\nYou can paste it on Facebook, Instagram, WhatsApp, or any social platform to share with your partner.')
            }
          }).catch((error) => {
            console.error('Copy failed:', error)
            showManualCopy(shareText)
          })
        } else {
          showManualCopy(shareText)
        }
      } catch (error) {
        console.error('Share failed:', error)
        showManualCopy(shareText)
      }
    }
  }

  // 手动复制方法
  const showManualCopy = (text: string) => {
    if (typeof window === 'undefined') return

    // 创建一个模态框显示分享内容
    const modal = document.createElement('div')
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `

    const content = document.createElement('div')
    content.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 10px;
      max-width: 90%;
      max-height: 80%;
      overflow: auto;
    `

    content.innerHTML = `
      <h3 style="margin-top: 0;">📤 Share with Partner</h3>
      <p>Please copy the content below to share:</p>
      <textarea readonly style="width: 100%; height: 150px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">${text}</textarea>
      <div style="margin-top: 15px; text-align: center;">
        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Close</button>
      </div>
    `

    modal.appendChild(content)
    document.body.appendChild(modal)

    // 选中文本
    const textarea = content.querySelector('textarea') as HTMLTextAreaElement
    textarea.select()
    textarea.setSelectionRange(0, 99999) // 移动端兼容
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">👶</div>
          <p className="text-gray-600">Loading generation studio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* DIRECT PAYMENT UPDATE TEST */}
      <div className="bg-red-500 text-white p-2 text-center font-bold">
        🔥 DIRECT PAYMENT VERSION - NO PRICING REDIRECT 🔥
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center space-x-3">
              <span className="text-3xl">👶</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                FutureBabe
              </span>
            </a>

            <div className="flex items-center space-x-4">
              <a href="/dashboard" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
                Dashboard
              </a>
              <a href="/pricing" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
                Pricing
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {/* Step 1: Upload */}
            <div className={`flex items-center space-x-2 ${currentStep === 'upload' ? 'text-pink-600' : currentStep === 'pricing' || currentStep === 'payment' || currentStep === 'generating' || currentStep === 'result' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 'upload' ? 'bg-pink-100 text-pink-600' : currentStep === 'pricing' || currentStep === 'payment' || currentStep === 'generating' || currentStep === 'result' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {currentStep === 'pricing' || currentStep === 'payment' || currentStep === 'generating' || currentStep === 'result' ? '✓' : '1'}
              </div>
              <span className="text-sm font-medium">Upload Photos</span>
            </div>

            <div className="w-8 h-0.5 bg-gray-200"></div>

            {/* Step 2: Choose Plan */}
            <div className={`flex items-center space-x-2 ${currentStep === 'pricing' ? 'text-pink-600' : currentStep === 'payment' || currentStep === 'generating' || currentStep === 'result' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 'pricing' ? 'bg-pink-100 text-pink-600' : currentStep === 'payment' || currentStep === 'generating' || currentStep === 'result' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {currentStep === 'payment' || currentStep === 'generating' || currentStep === 'result' ? '✓' : '2'}
              </div>
              <span className="text-sm font-medium">Choose Plan</span>
            </div>

            <div className="w-8 h-0.5 bg-gray-200"></div>

            {/* Step 3: Generate */}
            <div className={`flex items-center space-x-2 ${currentStep === 'generating' || currentStep === 'result' ? 'text-pink-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 'generating' || currentStep === 'result' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'}`}>
                {currentStep === 'result' ? '✓' : '3'}
              </div>
              <span className="text-sm font-medium">Meet Your Baby</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        {/* Step 1: Upload Photos */}
        {currentStep === 'upload' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
                Meet Your <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Future Baby</span>
              </h1>
              <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto mb-8">
                Upload your photos to begin the magical journey ✨
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-pink-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upload Your Photos</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* User Photo Upload */}
                <div className="text-center">
                  <div className="relative">
                    {userImage ? (
                      <div className="w-64 h-64 mx-auto rounded-3xl overflow-hidden border-4 border-pink-200 shadow-lg">
                        <img
                          src={userImage.preview}
                          alt="Your photo"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setUserImage(null)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-64 h-64 mx-auto bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl border-2 border-dashed border-pink-300 flex items-center justify-center cursor-pointer hover:border-pink-400 transition-colors">
                        <div className="text-center">
                          <div className="text-4xl mb-2">👤</div>
                          <p className="text-gray-600 text-sm font-medium">Upload Your Photo</p>
                          <p className="text-gray-500 text-xs mt-1">Click to browse</p>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'user')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">Your beautiful face</p>
                </div>

                {/* Partner Photo Upload */}
                <div className="text-center">
                  <div className="relative">
                    {partnerImage ? (
                      <div className="w-64 h-64 mx-auto rounded-3xl overflow-hidden border-4 border-purple-200 shadow-lg">
                        <img
                          src={partnerImage.preview}
                          alt="Partner photo"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setPartnerImage(null)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-64 h-64 mx-auto bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl border-2 border-dashed border-purple-300 flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors">
                        <div className="text-center">
                          <div className="text-4xl mb-2">👤</div>
                          <p className="text-gray-600 text-sm font-medium">Upload Your Partner's Photo</p>
                          <p className="text-gray-500 text-xs mt-1">Click to browse</p>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'partner')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">Your partner's lovely face</p>
                </div>
              </div>

              {/* Smart Baby Options - Only show when both photos uploaded */}
              {canProceedToPricing() && (
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-8 border border-pink-100">
                  <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">
                    🎨 Customize Your Baby's Features
                  </h4>
                  <p className="text-gray-600 text-sm text-center mb-6">
                    Help our AI create the perfect baby by choosing specific features (optional)
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Eye Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        👁️ Eye Color
                      </label>
                      <select
                        value={babyOptions.eyeColor}
                        onChange={(e) => setBabyOptions({...babyOptions, eyeColor: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="auto">✨ Let AI Decide</option>
                        <option value="brown">🤎 Brown Eyes</option>
                        <option value="blue">💙 Blue Eyes</option>
                        <option value="green">💚 Green Eyes</option>
                        <option value="hazel">🌰 Hazel Eyes</option>
                      </select>
                    </div>

                    {/* Hair Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        💇 Hair Color
                      </label>
                      <select
                        value={babyOptions.hairColor}
                        onChange={(e) => setBabyOptions({...babyOptions, hairColor: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="auto">✨ Let AI Decide</option>
                        <option value="black">🖤 Black Hair</option>
                        <option value="brown">🤎 Brown Hair</option>
                        <option value="blonde">💛 Blonde Hair</option>
                        <option value="red">❤️ Red Hair</option>
                      </select>
                    </div>

                    {/* Skin Tone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🌟 Skin Tone
                      </label>
                      <select
                        value={babyOptions.skinTone}
                        onChange={(e) => setBabyOptions({...babyOptions, skinTone: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="auto">✨ Let AI Decide</option>
                        <option value="fair">🤍 Fair Skin</option>
                        <option value="medium">🤎 Medium Skin</option>
                        <option value="olive">🫒 Olive Skin</option>
                        <option value="dark">🤎 Dark Skin</option>
                      </select>
                    </div>

                    {/* Expression */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        😊 Expression
                      </label>
                      <select
                        value={babyOptions.expression}
                        onChange={(e) => setBabyOptions({...babyOptions, expression: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="auto">✨ Let AI Decide</option>
                        <option value="smiling">😊 Gentle Smile</option>
                        <option value="peaceful">😌 Peaceful</option>
                        <option value="curious">🤔 Curious Look</option>
                        <option value="sleepy">😴 Sleepy</option>
                      </select>
                    </div>

                    {/* Style */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🎨 Photo Style
                      </label>
                      <select
                        value={babyOptions.style}
                        onChange={(e) => setBabyOptions({...babyOptions, style: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="realistic">📸 Realistic Photo</option>
                        <option value="artistic">🎨 Artistic Style</option>
                        <option value="cute">🥰 Extra Cute</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-xs text-gray-500">
                      💡 These options help create more personalized results, but our AI will blend your features beautifully regardless!
                    </p>
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <div className="text-center">
                <button
                  onClick={handleContinueToPricing}
                  disabled={!canProceedToPricing()}
                  className={`px-12 py-4 rounded-full font-bold text-lg transition-all duration-200 ${
                    canProceedToPricing()
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canProceedToPricing() ? '✨ Continue to Plans' : '📸 Upload Both Photos First'}
                </button>

                {canProceedToPricing() && (
                  <p className="text-gray-600 text-sm mt-4">
                    Ready to see your beautiful future baby! 💕
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Choose Plan */}
        {currentStep === 'pricing' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Choose Your <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Perfect Plan</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Your photos are ready! Now choose how you'd like to meet your future baby 💕
              </p>
            </div>

            {/* Photo Preview */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-100">
              <div className="flex items-center justify-center space-x-8 mb-6">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-pink-200 mx-auto mb-2">
                    <img src={userImage?.preview} alt="You" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-sm text-gray-600">You</p>
                </div>
                <div className="text-3xl">💕</div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-200 mx-auto mb-2">
                    <img src={partnerImage?.preview} alt="Partner" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-sm text-gray-600">Partner</p>
                </div>
                <div className="text-3xl">=</div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-dashed border-pink-300 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">👶</span>
                  </div>
                  <p className="text-sm text-gray-600">Your Baby</p>
                </div>
              </div>
            </div>

            {/* Phase 1 Pricing Plans - TTS Version */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Experience Plan */}
              <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${selectedPlan === 'experience' ? 'border-pink-400 ring-2 ring-pink-200' : 'border-pink-100'}`}
                   onClick={() => setSelectedPlan('experience')}>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">📸</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Experience</h3>
                  <div className="text-3xl font-bold text-pink-600 mb-1">$7.90</div>
                  <p className="text-gray-600 text-sm">Perfect for trying</p>
                </div>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    📸 1 AI baby photo
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    🎧 1 TTS voice (30s)
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Basic quality
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    ⚡ Instant download
                  </li>
                </ul>

                <button className={`w-full py-3 px-4 rounded-2xl font-semibold transition-all duration-200 ${selectedPlan === 'experience' ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}>
                  {selectedPlan === 'experience' ? 'Selected ✓' : 'Select Plan'}
                </button>
              </div>

              {/* Standard Plan */}
              <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 relative ${selectedPlan === 'standard' ? 'border-purple-400 ring-2 ring-purple-200' : 'border-purple-100'}`}
                   onClick={() => setSelectedPlan('standard')}>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-xs font-bold">
                  MOST POPULAR
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🌟</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Standard</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-1">$14.90</div>
                  <p className="text-gray-600 text-sm">Best for couples</p>
                </div>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    📸 3 AI baby photos
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    🎧 1 TTS voice (60s)
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    HD quality
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    📝 Custom text + personality
                  </li>
                </ul>

                <button className={`w-full py-3 px-4 rounded-2xl font-semibold transition-all duration-200 ${selectedPlan === 'standard' ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>
                  {selectedPlan === 'standard' ? 'Selected ✓' : 'Select Plan'}
                </button>
              </div>

              {/* Gift Plan */}
              <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${selectedPlan === 'gift' ? 'border-blue-400 ring-2 ring-blue-200' : 'border-blue-100'}`}
                   onClick={() => setSelectedPlan('gift')}>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">💌</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Gift</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">$23.90</div>
                  <p className="text-gray-600 text-sm">Perfect gift</p>
                </div>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    ✅ All Standard features
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    💌 Online greeting card
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    🎬 HD video MV
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Dynamic subtitles
                  </li>
                </ul>

                <button className={`w-full py-3 px-4 rounded-2xl font-semibold transition-all duration-200 ${selectedPlan === 'gift' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
                  {selectedPlan === 'gift' ? 'Selected ✓' : 'Select Plan'}
                </button>
              </div>

              {/* Annual Plan */}
              <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 relative ${selectedPlan === 'annual' ? 'border-green-400 ring-2 ring-green-200' : 'border-green-100'}`}
                   onClick={() => setSelectedPlan('annual')}>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                  BEST VALUE
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Annual</h3>
                  <div className="text-3xl font-bold text-green-600 mb-1">$49.90</div>
                  <p className="text-gray-600 text-sm">per year</p>
                </div>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    📸 12 photo sets + 🎧 12 TTS
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    💌 2 greeting cards
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    🎬 1 video MV
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    🚀 Priority + holiday templates
                  </li>
                </ul>

                <button className={`w-full py-3 px-4 rounded-2xl font-semibold transition-all duration-200 ${selectedPlan === 'annual' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                  {selectedPlan === 'annual' ? 'Selected ✓' : 'Select Plan'}
                </button>
              </div>
            </div>

            {/* Continue Button */}
            <div className="text-center">
              <button
                onClick={() => selectedPlan && handlePlanSelection(selectedPlan)}
                disabled={!selectedPlan}
                className={`px-12 py-4 rounded-full font-bold text-lg transition-all duration-200 ${
                  selectedPlan
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedPlan ? '💳 Continue to Payment' : '📋 Select a Plan First'}
              </button>

              <button
                onClick={() => setCurrentStep('upload')}
                className="block mx-auto mt-4 text-gray-600 hover:text-gray-800 text-sm underline"
              >
                ← Back to Photos
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 'payment' && selectedPlan && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Complete Your <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Payment</span>
              </h2>
              <p className="text-gray-600 text-lg">
                You're almost there! Complete payment to meet your future baby 💕
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-pink-100 max-w-md mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {selectedPlan === 'one-time' ? 'One-Time Plan' :
                   selectedPlan === 'monthly' ? 'Monthly Plan' : 'Full-Year Plan'}
                </h3>
                <div className="text-3xl font-bold text-pink-600 mb-2">
                  {selectedPlan === 'one-time' ? '$5.90' :
                   selectedPlan === 'monthly' ? '$12.90/month' : '$49.90'}
                </div>
                <p className="text-gray-600 text-sm">
                  {selectedPlan === 'one-time' ? '1 AI Baby Photo + 1 Voice' :
                   selectedPlan === 'monthly' ? '3 Baby Generations per month' : '12 Baby Generations (all at once)'}
                </p>
              </div>

              {/* TTS Custom Message Input - For ALL Plans */}
              <div className="bg-red-100 border-4 border-red-500 rounded-2xl p-6 mb-6">
                <div className="bg-red-500 text-white p-2 rounded mb-4 text-center font-bold">
                  🔥 TTS CONFIGURATION AREA - IF YOU SEE THIS, IT'S WORKING! 🔥
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  🎧 Customize Voice Message
                </h3>

                <div className="space-y-4">
                  {/* Custom Text Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Message (60s max)
                    </label>
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Enter your custom message for the baby voice... (Leave empty for default blessing)"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      rows={3}
                      maxLength={300}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {customMessage.length}/300 characters
                    </div>
                  </div>

                  {/* Voice Selection */}
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

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleTTSPreview}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200"
                      disabled={ttsGenerating}
                    >
                      {ttsGenerating ? '🔄 Preview...' : '🎵 Preview'}
                    </button>

                    <button
                      onClick={() => setTtsConfigured(true)}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200"
                    >
                      ✅ Confirm
                    </button>
                  </div>

                  {ttsConfigured && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm font-medium">
                        ✅ TTS Configuration Confirmed! Ready for payment.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Simple TTS Test Area */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  🎧 TTS Voice Message Test
                </h3>

                <div className="space-y-4">
                  <div>
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Enter your custom message..."
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      rows={2}
                      maxLength={300}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {customMessage.length}/300 characters
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleTTSPreview}
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                      disabled={ttsGenerating}
                    >
                      {ttsGenerating ? '🔄 Testing...' : '🎵 Test TTS'}
                    </button>

                    <button
                      onClick={() => setTtsConfigured(true)}
                      className="bg-green-500 text-white py-2 px-4 rounded-lg"
                    >
                      ✅ Confirm
                    </button>
                  </div>

                  {ttsConfigured && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm font-medium">
                        ✅ TTS Ready! You can now purchase.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePlanPurchase}
                disabled={!ttsConfigured}
                className={`w-full font-bold py-4 px-6 rounded-2xl transition-all duration-200 mb-4 transform hover:scale-105 ${
                  ttsConfigured
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {ttsConfigured ? '💳 Purchase Plan' : '⚠️ Configure TTS First'}
              </button>

              {/* Payment Info */}
              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  Secure payment processing via PayPal
                </p>
              </div>

              <button
                onClick={() => setCurrentStep('pricing')}
                className="w-full text-gray-600 hover:text-gray-800 text-sm underline"
              >
                ← Back to Plans
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Generating */}
        {currentStep === 'generating' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Creating Your <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Future Baby</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Our AI is working its magic... ✨
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-pink-100 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-6xl mb-6 animate-bounce">👶</div>

                <div className="mb-6">
                  <div className="w-full bg-pink-200 rounded-full h-4 mb-2">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">{generationProgress}% complete</p>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>🧬 Analyzing your features...</p>
                  <p>🎨 Creating your baby's face...</p>
                  <p>🎵 Generating baby's voice...</p>
                  <p>💕 Adding love and magic...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Result */}
        {currentStep === 'result' && generationResult && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Meet Your <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Beautiful Baby</span>! 🎉
              </h2>
              <p className="text-gray-600 text-lg">
                Your future baby is absolutely adorable! 💕
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-pink-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Baby Photo */}
                <div className="text-center">
                  <div className="w-80 h-80 mx-auto rounded-3xl overflow-hidden border-4 border-pink-200 shadow-xl">
                    <img
                      src={generationResult.babyImageURL}
                      alt="Your future baby"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mt-4">{generationResult.babyName}</p>
                </div>

                {/* Baby Message & Controls */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-200">
                    <h4 className="text-lg font-bold text-purple-800 mb-3 text-center">Your baby says:</h4>
                    <p className="text-purple-800 italic text-center text-lg">
                      💕 "{generationResult.babyMessage}"
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handlePlayBabyVoice}
                      data-voice-button
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🔊 Play Baby's Voice
                    </button>

                    <button
                      onClick={handleDownloadPhoto}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-2xl transition-colors"
                    >
                      📱 Download Photo
                    </button>

                    <button
                      onClick={handleShareWithPartner}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-2xl transition-colors"
                    >
                      📤 Share with Partner
                    </button>
                  </div>

                  <div className="text-center pt-4">
                    <button
                      onClick={handleStartOver}
                      className="text-gray-600 hover:text-gray-800 text-sm underline"
                    >
                      ✨ Create Another Baby
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
      <FooterDisclaimer />
    </div>
  )
}
