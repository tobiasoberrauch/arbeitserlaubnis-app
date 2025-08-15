# Arbeitserlaubnis Application Assistant

A multilingual, chatbot-supported web application for helping non-German speakers complete German work permit forms ("Erklärung zum Beschäftigungsverhältnis").

## Features

- 🌍 **Multilingual Support**: Available in German, English, Ukrainian, Turkish, Arabic, and Polish
- 💬 **Chatbot Interface**: Step-by-step guidance through the form filling process
- ✅ **Automatic Validation**: Real-time validation and plausibility checks
- 📄 **PDF Generation**: Automatic generation of official German PDF forms
- 👀 **Dual Preview**: View your application in both German and your native language
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: i18next
- **PDF Generation**: pdf-lib
- **Form Management**: React Hook Form
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd arbeitserlaubnis-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
arbeitserlaubnis-app/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── LandingPage.tsx    # Landing page with features
│   ├── ChatbotInterface.tsx # Chat-based form interface
│   ├── FormPreview.tsx    # Form preview and confirmation
│   └── LanguageSelector.tsx # Language switching component
├── lib/                   # Utility functions
│   ├── i18n.ts           # i18n configuration
│   ├── formQuestions.ts  # Form questions by language
│   └── pdfGenerator.ts   # PDF generation logic
├── locales/              # Translation files
│   ├── de/              # German translations
│   ├── en/              # English translations
│   └── uk/              # Ukrainian translations
└── styles/              # Global styles
    └── globals.css      # Global CSS with Tailwind

```

## User Journey

1. **Awareness**: Users discover the service through social media or community recommendations
2. **Landing Page**: Clear value proposition with multilingual support
3. **Language Selection**: Choose from 6 supported languages
4. **Chatbot Interaction**: Answer questions in a conversational interface
5. **Automatic Translation**: Responses are translated to German in real-time
6. **Preview**: Review the complete form in both languages
7. **PDF Generation**: Download the official German PDF form
8. **Success**: Option to start a new application or share experience

## Deployment

### Deploy to Vercel

The easiest way to deploy is using Vercel:

1. Push your code to GitHub
2. Import the project to Vercel
3. Deploy with one click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Deployment

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Environment Variables

No environment variables are required for the basic functionality. For advanced features like AI translation, add:

```env
# Optional: For AI-powered translations
OPENAI_API_KEY=your_api_key_here
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Support

For questions or support, please open an issue in the GitHub repository.