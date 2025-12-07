# Contributing to AI Caption Generator

Thank you for your interest in contributing to the AI Caption Generator! This is the **open-source version** of a feature from [Social Nest AI](https://socialnestai.com), and we welcome contributions from the community.

## About This Project

This is an open-source component of Social Nest AI, an AI-powered social media management platform. The tool is designed to help users generate engaging social media captions and hashtags using AI. **This same technology powers the caption generator on our live platform at socialnestai.com.**

**Live Demo:** [https://socialnestai.com/tools/ai-caption-generator/](https://socialnestai.com/tools/ai-caption-generator/)

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on GitHub with:
- A clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Your environment (OS, Node version, browser, etc.)

### Suggesting Features

We welcome feature suggestions! Please open an issue with:
- A clear description of the feature
- Why it would be useful
- Any implementation ideas you have

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Submit a pull request** with a clear description of your changes

#### Coding Standards

- Use TypeScript for type safety
- Follow the existing code style (we use ESLint)
- Use Tailwind CSS for styling (avoid inline styles)
- Write clear, descriptive commit messages
- Add comments for complex logic

#### Testing

Before submitting a PR:
```bash
# Install dependencies
pnpm install

# Run the development server
pnpm run dev

# Build the project
pnpm run build

# Run linting
pnpm run lint

# Type checking
pnpm run type-check
```

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/socialnest/ai-caption-generator.git
   cd ai-caption-generator
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your GEMINI_API_KEY to .env.local
   ```

4. **Run the development server**
   ```bash
   pnpm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── api/         # API routes
│   ├── layout.tsx   # Root layout
│   └── page.tsx     # Home page
├── components/       # React components
│   ├── AICaptionGenerator.tsx  # Main component
│   ├── Header.tsx              # Header component
│   ├── Footer.tsx              # Footer component
│   └── PlatformIcons.tsx       # Social media icons
└── index.ts         # Component exports
```

## Questions?

If you have questions about contributing, feel free to:
- Open an issue on GitHub
- Contact us at [support@socialnest.ai](mailto:support@socialnest.ai)
- Visit our website at [https://socialnestai.com](https://socialnestai.com)

## License

By contributing to this project, you agree that your contributions will be licensed under the GNU General Public License v3.0.

---

**Note:** The references to socialnestai.com throughout this codebase are legitimate attributions to the parent project and are not link spam. **This open-source tool contains the same AI technology used on the Social Nest AI platform.**
