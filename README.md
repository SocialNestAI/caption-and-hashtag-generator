# AI Caption and Hashtag Generator

> **Part of [Social Nest AI](https://socialnestai.com)** - This feature is available on our platform and open-sourced here for the developer community.

**🚀 Live Demo:** [https://socialnestai.com/tools/ai-caption-generator/](https://socialnestai.com/tools/ai-caption-generator/)

An open-source AI-powered caption and hashtag generator for social media. Built with TypeScript, Next.js 14, and Google's Gemini AI. **This is the open-source version of a feature from [Social Nest AI](https://socialnestai.com)**, released to help developers integrate AI caption generation into their applications.

## About Social Nest AI

This tool is developed and maintained by [Social Nest AI](https://socialnestai.com), an AI-powered social media management platform. **This is the open-source version of our AI Caption Generator feature** that's available on the Social Nest AI platform. We've released this component as open-source to help developers or even competitors in social media management tools space to quickly integrate AI powered social media post/caption/hashtag generation into their own websites and applications. The references to socialnestai.com throughout this codebase are preserved from the original implementation on our platform.

## Features

- 🚀 **AI-Powered**: Uses Google's Gemini AI for intelligent caption generation
- 🎯 **Platform Optimized**: Tailored captions for 11+ social media platforms
- 🎨 **16 Different Tones**: Choose from casual, professional, funny, and more
- 🏷️ **Auto Hashtags**: Automatically generates relevant hashtags
- 📱 **Responsive Design**: Works beautifully on all devices
- ⚡ **TypeScript Support**: Full TypeScript support with type definitions
- 🎭 **Customizable**: Easily customize styles, options, and behavior
- 🔒 **Secure**: API key handling with proper security practices

## Installation

### Clone and Use Locally

```bash
# Clone the repository
git clone https://github.com/socialnest/ai-caption-generator.git
cd ai-caption-generator

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local

# Run the development server
pnpm run dev
```

### Use as a Component in Your Project

You can copy the components from this repository into your own Next.js project:

1. Copy the `src/components/` directory to your project
2. Copy the `src/app/api/gemini/route.ts` API route
3. Install required dependencies:
   ```bash
   pnpm add @google/generative-ai
   ```
4. Set up your `GEMINI_API_KEY` in `.env.local`

## Quick Start

### 1. Basic Usage

```tsx
import { AICaptionGenerator } from '@socialnest/ai-caption-generator';

function App() {
  return (
    <div>
      <AICaptionGenerator />
    </div>
  );
}
```

### 2. With Custom API Configuration

```tsx
import { AICaptionGenerator } from '@socialnest/ai-caption-generator';

function App() {
  return (
    <div>
      <AICaptionGenerator
        apiKey="your-gemini-api-key"
        apiUrl="/api/gemini"
        onGenerate={(captions) => {
          console.log('Generated captions:', captions);
        }}
      />
    </div>
  );
}
```

### 3. API Setup (Next.js App Router)

Create `app/api/gemini/route.ts`:

```tsx
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp"
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return NextResponse.json({
      error: error.message || 'Failed to generate caption'
    }, { status: 500 });
  }
}
```

## Props

### AICaptionGenerator

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiKey` | `string` | - | Your Gemini API key (if not using environment variable) |
| `apiUrl` | `string` | `'/api/gemini'` | The API endpoint for generating captions |
| `onGenerate` | `(captions: CaptionResult[]) => void` | - | Callback function when captions are generated |
| `className` | `string` | `''` | Additional CSS classes for the component |

### Header Component

```tsx
import { Header } from '@socialnest/ai-caption-generator';

<Header
  title="My App"
  logo="/logo.webp"
  navigationItems={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' }
  ]}
  ctaButton={{
    label: 'Get Started',
    onClick: () => console.log('Clicked!')
  }}
/>
```

### Footer Component

```tsx
import { Footer } from '@socialnest/ai-caption-generator';

<Footer
  companyName="My Company"
  companyTagline="Your tagline here"
  logo="/logo.webp"
  socialLinks={[
    {
      platform: "Twitter",
      url: "https://twitter.com/mycompany",
      icon: <TwitterIcon />
    }
  ]}
/>
```

## Supported Platforms

- Facebook
- Instagram
- X/Twitter
- LinkedIn
- YouTube
- Google Posts
- Pinterest
- TikTok
- Threads
- Bluesky
- Mastodon

## Available Tones

- Casual
- Cheeky
- Cheerful
- Confident
- Direct
- Dry
- Educational
- Firm
- Flowery
- Formal
- Frank
- Friendly
- Fun
- Grumpy
- Helpful
- Inspirational

## Styling

The component uses Tailwind CSS classes internally. You can customize the appearance by:

1. Overriding the default styles with your own CSS
2. Using the `className` prop to add custom classes
3. Modifying the CSS variables (if using CSS custom properties)

```css
/* Custom CSS example */
.ai-caption-generator {
  --primary-color: #6366f1;
  --secondary-color: #ec4899;
}
```

## TypeScript Support

Full TypeScript support is included:

```tsx
import { AICaptionGenerator, CaptionResult } from '@socialnest/ai-caption-generator';

const handleGenerate = (captions: CaptionResult[]) => {
  captions.forEach(caption => {
    console.log(caption.caption); // string
    console.log(caption.platform); // string
    console.log(caption.tone); // string
    console.log(caption.hashtags); // string[]
  });
};
```

## Environment Variables

Create a `.env.local` file in your project root:

```
GEMINI_API_KEY=your-gemini-api-key-here
```

## Development

```bash
# Clone the repository
git clone https://github.com/socialnest/ai-caption-generator.git

# Install dependencies
npm install

# Run the example app
cd example
npm install
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

GNU General Public License v3.0 © [Innovism Enterprises LLP](https://innovism.net)

This project is licensed under the GNU GPL v3 License - see the [LICENSE](LICENSE) file for details.

## Attribution

This project is part of [Social Nest AI](https://socialnestai.com), developed by Innovism Enterprises LLP. **This open-source repository contains the same AI caption generation technology used on our live platform.** The references to socialnestai.com throughout this codebase are legitimate attributions to our platform and are not link spam.

## Support

- 📧 Email: support@socialnest.ai
- 🐛 Issues: [GitHub Issues](https://github.com/socialnest/ai-caption-generator/issues)
- 📖 Documentation: [Full Docs](https://socialnest.ai/docs)