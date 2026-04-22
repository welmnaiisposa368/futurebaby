# FutureBabe - AI Baby Generation Platform

A Next.js application that uses AI to generate images of future babies based on photos of couples.

## 🚀 Features

### ✅ Completed Features

- **Authentication System**
  - User registration and login with Supabase Auth
  - Protected routes and session management
  - User profile management

- **Database Architecture**
  - Complete PostgreSQL schema with Supabase
  - User profiles, generations, subscriptions, and feedback tables
  - Row Level Security (RLS) policies
  - Database helper functions

- **User Interface**
  - Responsive design with Tailwind CSS
  - Modern gradient backgrounds and animations
  - Loading states and error handling
  - Toast notifications system

- **Page Structure**
  - Landing page with hero section and features
  - Login/Signup pages with form validation
  - Protected dashboard for authenticated users
  - Generate page (placeholder for AI functionality)

- **Error Handling & Loading States**
  - Custom loading spinner component
  - Error message component with retry functionality
  - Async state management hooks
  - Toast notification system

### 🚧 In Development

- **AI Generation Engine**
  - Image upload and processing
  - AI model integration (placeholder implemented)
  - Generation status tracking
  - Result display and download

## 📁 Project Structure

```
FutureBabe/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── layout.tsx         # Root layout with AuthProvider
│   │   ├── page.tsx           # Landing page
│   │   ├── login/page.tsx     # Login page
│   │   ├── signup/page.tsx    # Registration page
│   │   ├── dashboard/page.tsx # User dashboard
│   │   └── generate/page.tsx  # AI generation interface
│   └── components/            # Reusable components
│       ├── ProtectedRoute.tsx # Route protection
│       ├── LoadingSpinner.tsx # Loading states
│       └── ErrorMessage.tsx   # Error handling
├── contexts/                  # React contexts
│   ├── AuthContext.tsx       # Authentication state
│   └── ToastContext.tsx      # Notification system
├── lib/                      # Utility libraries
│   ├── supabase.ts          # Supabase client
│   ├── database.ts          # Database operations
│   └── ai-generation.ts     # AI generation logic
├── hooks/                   # Custom React hooks
│   └── useAsync.ts         # Async state management
├── database/               # Database schema
│   └── schema.sql         # PostgreSQL schema
└── .env.local            # Environment variables
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage
- **Deployment**: Ready for Vercel

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Environment Variables
Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_AI_API_KEY=your_ai_api_key
NEXT_PUBLIC_AI_API_URL=your_ai_api_url
```

### Installation

1. **Clone and install dependencies**
   ```bash
   cd FutureBabe
   npm install
   ```

2. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `database/schema.sql`
   - Set up storage buckets for images

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open http://localhost:3000
   - Register a new account or login

## 📊 Database Schema

### Core Tables

- **users**: Extended user profiles with subscription info
- **generations**: AI generation requests and results
- **subscriptions**: Payment and subscription tracking
- **feedback**: User feedback and ratings

### Key Features

- Row Level Security for data protection
- Automatic user profile creation on signup
- Credit system for free users
- Subscription management
- Generation history tracking

## 🔐 Authentication Flow

1. User registers/logs in via Supabase Auth
2. AuthContext manages authentication state
3. ProtectedRoute component guards sensitive pages
4. User profile automatically created in database
5. Session persisted across browser refreshes

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Aesthetics**: Gradient backgrounds, rounded corners, shadows
- **Interactive Elements**: Hover effects, animations, transitions
- **Loading States**: Spinners and skeleton screens
- **Error Handling**: User-friendly error messages with retry options
- **Toast Notifications**: Success/error feedback

## 🚀 Deployment

The application is ready for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🔮 Future Enhancements

- **AI Integration**: Connect to real AI services (Replicate, OpenAI, etc.)
- **Payment System**: Stripe integration for subscriptions
- **Social Features**: Share generations, user galleries
- **Mobile App**: React Native version
- **Advanced AI**: Multiple styles, ages, voice generation
- **Analytics**: User behavior tracking and insights

## 📝 Development Notes

### Current Status
- ✅ Complete authentication system
- ✅ Database architecture implemented
- ✅ UI/UX foundation complete
- ✅ Error handling and loading states
- 🚧 AI generation (mock implementation)
- 🚧 Payment integration
- 🚧 Advanced features

### Testing
The application is ready for testing:
1. Start the development server
2. Register a new account
3. Navigate through all pages
4. Test authentication flows
5. Verify protected routes work correctly

### Next Steps
1. Integrate real AI generation service
2. Implement payment system
3. Add comprehensive testing
4. Performance optimization
5. SEO improvements

## 📞 Support

For development questions or issues, please check:
- Database schema in `database/schema.sql`
- API functions in `lib/database.ts`
- Authentication logic in `contexts/AuthContext.tsx`
- Component documentation in respective files

---

**FutureBabe** - Bringing families together through AI technology 👶✨
