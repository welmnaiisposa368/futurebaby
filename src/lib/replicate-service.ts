import Replicate from 'replicate'

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

export interface BabyGenerationOptions {
  style?: 'realistic' | 'artistic' | 'cute'
  age?: 'newborn' | 'baby' | 'toddler'
  gender?: 'auto' | 'male' | 'female'
  quality?: 'standard' | 'high'
  eyeColor?: string
  hairColor?: string
  skinTone?: string
  expression?: string
}

export interface BabyGenerationResult {
  id: string
  imageUrl: string
  status: 'processing' | 'completed' | 'failed'
  error?: string
  processingTime?: number
}

// Convert uploaded images to base64 data URLs for Replicate
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Generate smart prompt based on user options
function generateSmartPrompt(options: {
  age: string
  gender: string
  style: string
  eyeColor: string
  hairColor: string
  skinTone: string
  expression: string
}): { prompt: string; negativePrompt: string } {
  // Base description
  let prompt = `A beautiful ${options.age}`

  // Add gender if specified
  if (options.gender !== 'auto') {
    prompt += ` ${options.gender === 'male' ? 'boy' : 'girl'}`
  }

  // Collect specific features
  const features = []

  // Eye color
  if (options.eyeColor !== 'auto') {
    const eyeColorMap = {
      brown: 'warm brown eyes',
      blue: 'bright blue eyes',
      green: 'beautiful green eyes',
      hazel: 'lovely hazel eyes'
    }
    features.push(eyeColorMap[options.eyeColor] || `${options.eyeColor} eyes`)
  }

  // Hair color
  if (options.hairColor !== 'auto') {
    const hairColorMap = {
      black: 'soft black hair',
      brown: 'beautiful brown hair',
      blonde: 'golden blonde hair',
      red: 'adorable red hair'
    }
    features.push(hairColorMap[options.hairColor] || `${options.hairColor} hair`)
  }

  // Skin tone
  if (options.skinTone !== 'auto') {
    const skinToneMap = {
      fair: 'fair skin tone',
      medium: 'medium skin tone',
      olive: 'olive skin tone',
      dark: 'beautiful dark skin tone'
    }
    features.push(skinToneMap[options.skinTone] || `${options.skinTone} skin`)
  }

  // Expression
  if (options.expression !== 'auto') {
    const expressionMap = {
      smiling: 'gentle smile, happy expression',
      peaceful: 'peaceful, serene expression',
      curious: 'curious, alert look',
      sleepy: 'sleepy, drowsy expression'
    }
    features.push(expressionMap[options.expression] || `${options.expression} expression`)
  }

  // Add features to prompt
  if (features.length > 0) {
    prompt += ` with ${features.join(', ')}`
  }

  // Add style description
  const styleMap = {
    realistic: 'photorealistic, professional photography, natural lighting',
    artistic: 'artistic style, soft focus, beautiful composition',
    cute: 'adorable, extra cute, sweet, charming'
  }

  prompt += `, that combines facial features from both parents, ${styleMap[options.style] || styleMap.realistic}`
  prompt += ', soft lighting, warm colors, innocent baby features, high resolution, detailed, professional quality, safe for work, family friendly'

  // Enhanced negative prompt
  const negativePrompt = [
    'adult, teenager, child over 3 years old',
    'scary, dark, horror, inappropriate',
    'low quality, blurry, distorted',
    'multiple faces, extra limbs',
    'text, watermark, signature',
    'ugly, deformed, bad anatomy'
  ].join(', ')

  return { prompt, negativePrompt }
}

// Generate baby photo using Replicate SDXL
export async function generateBabyWithReplicate(
  parentImage1: File,
  parentImage2: File,
  options: BabyGenerationOptions = {}
): Promise<BabyGenerationResult> {
  try {
    const startTime = Date.now()
    
    // Convert images to data URLs
    const parent1DataUrl = await fileToDataUrl(parentImage1)
    const parent2DataUrl = await fileToDataUrl(parentImage2)
    
    // Create detailed prompt for baby generation
    const styleMap = {
      realistic: 'photorealistic, high quality, professional photography',
      artistic: 'artistic, beautiful, stylized',
      cute: 'adorable, cute, sweet, charming'
    }
    
    const ageMap = {
      newborn: 'newborn baby, 0-3 months old',
      baby: 'baby, 6-12 months old',
      toddler: 'toddler, 1-2 years old'
    }
    
    const genderMap = {
      auto: '',
      male: 'baby boy',
      female: 'baby girl'
    }
    
    const style = styleMap[options.style || 'realistic']
    const age = ageMap[options.age || 'baby']
    const gender = genderMap[options.gender || 'auto']
    
    // Generate smart prompt with user options
    const smartPrompt = generateSmartPrompt({
      age,
      gender,
      style,
      eyeColor: options.eyeColor || 'auto',
      hairColor: options.hairColor || 'auto',
      skinTone: options.skinTone || 'auto',
      expression: options.expression || 'auto'
    })

    const prompt = smartPrompt.prompt
    
    const negativePrompt = smartPrompt.negativePrompt

    console.log('Generating baby with prompt:', prompt)
    
    // Call Replicate API
    const output = await replicate.run(
      process.env.REPLICATE_MODEL_VERSION as any,
      {
        input: {
          prompt: prompt,
          negative_prompt: negativePrompt,
          width: 512,
          height: 512,
          num_outputs: 1,
          num_inference_steps: 30,
          guidance_scale: 7.5,
          scheduler: "DPMSolverMultistep",
          seed: Math.floor(Math.random() * 1000000),
          // Note: SDXL doesn't directly support image input for face blending
          // We'll use the prompt to describe the desired features
        }
      }
    )

    const processingTime = Date.now() - startTime
    
    // Extract the generated image URL
    const imageUrl = Array.isArray(output) ? output[0] : output
    
    if (!imageUrl || typeof imageUrl !== 'string') {
      throw new Error('No image generated')
    }

    return {
      id: `replicate_${Date.now()}`,
      imageUrl: imageUrl,
      status: 'completed',
      processingTime
    }

  } catch (error) {
    console.error('Replicate generation error:', error)
    return {
      id: `replicate_${Date.now()}`,
      imageUrl: '',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Alternative: Use a face-blending specific model
export async function generateBabyWithFaceBlending(
  parentImage1: File,
  parentImage2: File,
  options: BabyGenerationOptions = {}
): Promise<BabyGenerationResult> {
  try {
    const startTime = Date.now()
    
    // Convert images to data URLs
    const parent1DataUrl = await fileToDataUrl(parentImage1)
    const parent2DataUrl = await fileToDataUrl(parentImage2)
    
    // Use a face-blending model (example with a hypothetical model)
    const output = await replicate.run(
      "lucataco/realistic-vision-v5:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4" as any,
      {
        input: {
          prompt: `A beautiful baby that combines features from both parents, ${options.age || 'baby'}, ${options.style || 'realistic'}, high quality, professional photography`,
          negative_prompt: "adult, teenager, scary, inappropriate, low quality, blurry",
          image: parent1DataUrl,
          width: 512,
          height: 512,
          num_outputs: 1,
          num_inference_steps: 20,
          guidance_scale: 7.5,
        }
      }
    )

    const processingTime = Date.now() - startTime
    const imageUrl = Array.isArray(output) ? output[0] : output

    if (!imageUrl || typeof imageUrl !== 'string') {
      throw new Error('No image generated')
    }

    return {
      id: `replicate_blend_${Date.now()}`,
      imageUrl: imageUrl,
      status: 'completed',
      processingTime
    }

  } catch (error) {
    console.error('Face blending generation error:', error)
    return {
      id: `replicate_blend_${Date.now()}`,
      imageUrl: '',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Check if Replicate is properly configured
export function isReplicateConfigured(): boolean {
  return !!process.env.REPLICATE_API_TOKEN && !!process.env.REPLICATE_MODEL_VERSION
}
