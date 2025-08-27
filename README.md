# 🛡️ InfoWise - AI-Powered Digital Literacy Platform

**InfoWise** is an innovative web application that empowers users to navigate the digital information landscape safely through AI-powered detection of misinformation and scams, combined with interactive educational content.

## 🎯 Problem Statement

In today's digital age, misinformation and online scams are proliferating at an unprecedented rate, particularly targeting vulnerable communities. Traditional media literacy approaches fail to keep pace with sophisticated deception tactics, leaving users defenseless against digital threats.

## 💡 Our Solution

InfoWise combines cutting-edge AI technology with engaging educational content to create a comprehensive digital literacy platform that:

### ✨ Core Features

- **🔍 AI-Powered Fake News Detection**: Real-time analysis of content credibility using Google Gemini AI
  - Content reliability scoring (0-100 scale)
  - Detailed explanations for credibility assessments
  - Multi-factor analysis including source credibility and language patterns

- **🛡️ Scam Shield Protection**: Advanced scam detection system
  - Analysis of suspicious links, emails, and text content
  - Instant threat assessment and user warnings
  - Protection against phishing and fraud attempts

- **🎧 Interactive Podcast Platform**: Educational content delivery through multimedia
  - Searchable podcast library with categorization
  - AI-generated transcriptions for accessibility
  - Video content support with automatic transcription

- **🧠 AI-Generated Quizzes**: Intelligent learning assessment system
  - Automatic quiz generation from podcast/video transcriptions
  - Multiple-choice questions testing deep comprehension
  - Critical thinking and interpretation-focused assessments

- **📱 User-Friendly Interface**: Modern, responsive design
  - Dark/light mode support
  - Mobile-first responsive design
  - Intuitive navigation and accessibility features

### 🛠️ Technology Stack

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui component library
- **AI Integration**: 
  - Google Gemini API for content analysis and quiz generation
  - AssemblyAI for video/audio transcription
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: Better Auth for secure user management
- **Animations**: Framer Motion for smooth interactions
- **Deployment**: Vercel Platform

## 🚀 Installation and Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- API keys for Google Gemini and AssemblyAI

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Database
DATABASE_URL="your_postgresql_url"

# AI Services
NEXT_PUBLIC_GEMINI_API_KEY="your_gemini_api_key"
ASSEMBLYAI_API_KEY="your_assemblyai_api_key"

# Authentication
BETTER_AUTH_SECRET="your_auth_secret"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth (optional)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/infowise.git
cd infowise
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Setup database**
```bash
npx prisma generate
npx prisma db push
```

4. **Run development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open application**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### 1. **Fake News Detection**
- Navigate to the "Fake News AI" section
- Paste suspicious content or URLs
- Receive instant credibility analysis with detailed explanations

### 2. **Scam Protection**
- Use the "Scam Shield" feature
- Input suspicious emails, links, or messages
- Get immediate threat assessment and safety recommendations

### 3. **Educational Content**
- Browse the podcast library by categories
- Watch videos with automatic transcription
- Take AI-generated quizzes to test comprehension

### 4. **Learning Assessment**
- Complete interactive quizzes based on content
- Receive immediate feedback on understanding
- Track learning progress over time

## 🌟 Impact and Benefits

InfoWise contributes to digital safety by:

- **Protecting Users**: Real-time detection of scams and misinformation
- **Educating Communities**: Interactive learning experiences for all ages
- **Building Resilience**: Critical thinking skills development
- **Promoting Safety**: Proactive defense against digital threats
- **Empowering Literacy**: Advanced media literacy tools

## 🔧 Technical Features

### AI Capabilities
- **Natural Language Processing**: Advanced content analysis
- **Machine Learning**: Pattern recognition for threat detection
- **Audio Transcription**: Multi-language support with AssemblyAI
- **Quiz Generation**: Intelligent question creation from content

### Security Features
- **Content Sanitization**: Safe handling of potentially malicious inputs
- **Rate Limiting**: API protection against abuse
- **Secure Authentication**: Industry-standard user protection
- **Privacy Protection**: No storage of sensitive analyzed content

### Performance Optimizations
- **Turbopack**: Fast development and build processes
- **API Optimization**: Efficient AI service integration
- **Responsive Design**: Optimized for all device types
- **Caching Strategy**: Improved load times and user experience

## 🤝 Contributing

We welcome contributions to InfoWise! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests for new features
- Maintain consistent code formatting
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for advanced content analysis capabilities
- **AssemblyAI** for high-quality transcription services
- **Vercel** for seamless deployment platform
- **UNESCO** for supporting digital literacy initiatives
- **Open source community** for invaluable tools and libraries

## 📞 Support

For questions, issues, or contributions:

- 📧 Email: info@infowise.app
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/infowise/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/infowise/discussions)

---

**Built with ❤️ for a safer digital world**
