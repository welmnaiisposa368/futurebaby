import FooterDisclaimer from '../components/FooterDisclaimer'
import PWAInstallPrompt from '../components/PWAInstallPrompt'
export default function Home() {
  return (
    <div suppressHydrationWarning style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #eff6ff 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* FORCE UPDATE BANNER */}
      <div style={{
        background: '#ef4444',
        color: 'white',
        textAlign: 'center',
        padding: '8px',
        fontWeight: 'bold'
      }}>
        🔥 UPDATED VERSION 2.0 - NEW TTS PRICING PLANS! 🔥
      </div>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(90deg, #fce7f3, #e9d5ff)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '80px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '2rem', marginRight: '12px' }}>👶</span>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>FutureBabe v2.0</span>
          </div>
          <nav style={{ display: 'flex', gap: '32px' }}>
            <a href="/generate" style={{ color: '#1f2937', textDecoration: 'none', fontWeight: '500' }}>Generate</a>
            <a href="/pricing" style={{ color: '#1f2937', textDecoration: 'none', fontWeight: '500' }}>Pricing</a>
            <a href="/dashboard" style={{ color: '#1f2937', textDecoration: 'none', fontWeight: '500' }}>Dashboard</a>
          </nav>
        </div>
      </header>
      {/* Hero Section */}
      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '24px',
            lineHeight: '1.1'
          }}>
            Meet Your <span style={{
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Future Baby</span>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#6b7280',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Upload your photos and create AI-generated baby images with custom voice messages. 
            No credits needed - simple pricing plans!
          </p>
        </div>
      </section>
      {/* Pricing Section */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px'
            }}>Choose Your Plan</h2>
            <div style={{ 
              background: '#10b981', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '20px', 
              display: 'inline-block', 
              fontSize: '14px', 
              fontWeight: 'bold',
              marginBottom: '16px'
            }}>
              ✨ NEW TTS PRICING - NO CREDITS NEEDED
            </div>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {/* Experience Plan */}
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '24px',
              textAlign: 'center',
              border: '2px solid #f9a8d4',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📸</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>
                Experience Plan
              </h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ec4899', marginBottom: '8px' }}>
                $7.90
              </div>
              <ul style={{ textAlign: 'left', marginBottom: '32px', color: '#374151' }}>
                <li style={{ marginBottom: '8px' }}>✅ 1 AI Baby Photo</li>
                <li style={{ marginBottom: '8px' }}>✅ 1 TTS Voice (30s)</li>
                <li style={{ marginBottom: '8px' }}>✅ Basic Quality</li>
              </ul>
            </div>
            {/* Standard Plan */}
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '24px',
              textAlign: 'center',
              border: '2px solid #60a5fa',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🌟</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>
                Standard Plan
              </h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
                $14.90
              </div>
              <ul style={{ textAlign: 'left', marginBottom: '32px', color: '#374151' }}>
                <li style={{ marginBottom: '8px' }}>✅ 3 AI Baby Photos</li>
                <li style={{ marginBottom: '8px' }}>✅ 1 TTS Voice (60s)</li>
                <li style={{ marginBottom: '8px' }}>✅ HD Quality</li>
              </ul>
            </div>
            {/* Gift Plan */}
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '24px',
              textAlign: 'center',
              border: '2px solid #0ea5e9',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💌</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>
                Gift Plan
              </h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#0ea5e9', marginBottom: '8px' }}>
                $23.90
              </div>
              <ul style={{ textAlign: 'left', marginBottom: '32px', color: '#374151' }}>
                <li style={{ marginBottom: '8px' }}>✅ All Standard Features</li>
                <li style={{ marginBottom: '8px' }}>✅ Greeting Card</li>
                <li style={{ marginBottom: '8px' }}>✅ HD Video MV</li>
              </ul>
            </div>
            {/* Annual Plan */}
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '24px',
              textAlign: 'center',
              border: '2px solid #22c55e',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎯</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>
                Annual Plan
              </h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#22c55e', marginBottom: '8px' }}>
                $49.90
              </div>
              <ul style={{ textAlign: 'left', marginBottom: '32px', color: '#374151' }}>
                <li style={{ marginBottom: '8px' }}>✅ 12 Photo Sets</li>
                <li style={{ marginBottom: '8px' }}>✅ 12 TTS Messages</li>
                <li style={{ marginBottom: '8px' }}>✅ Premium Quality</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section style={{ padding: '80px 20px', background: 'rgba(255, 255, 255, 0.5)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '12px'
            }}>
              🎵 What does the baby voice feature include? 
              <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', marginLeft: '8px' }}>
                UPDATED
              </span>
            </h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              Create custom voice messages for your future baby! Choose from different voice styles
              (child female, child male, etc.) and write personalized messages. Perfect for creating
              memorable keepsakes and sharing your excitement with family and friends.
            </p>
          </div>
        </div>
      </section>
      <PWAInstallPrompt />
      <FooterDisclaimer />
    </div>
  )
}