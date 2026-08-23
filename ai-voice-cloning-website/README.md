# VoxAI - AI Voice Cloning & Text-to-Speech

VoxAI is a professional-grade AI Voice Cloning and Text-to-Speech platform powered by Fish Audio.

## Features

- **AI Voice Cloning**: Create a digital twin of any voice with just a few samples.
- **Text-to-Speech**: High-quality, natural-sounding speech generation.
- **Voice Library**: Manage and reuse your cloned voices.
- **Generation History**: Track and download your previous generations.
- **Modern UI**: Dark-themed, responsive dashboard built with Next.js and Tailwind CSS.
- **Secure Integration**: Server-side API integration to protect your Fish Audio API key.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js
- **API**: Fish Audio API
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Fish Audio API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd vox-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env.local` and fill in the values.

4. Push the database schema:
   ```bash
   npx drizzle-kit push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `FISH_AUDIO_API_KEY` | Your secret API key from Fish Audio |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js session encryption |
| `NEXTAUTH_URL` | Base URL of the application (e.g., http://localhost:3000) |

## Security Notes

- The Fish Audio API key is never exposed to the frontend.
- Voice ownership is enforced; users can only use and manage their own voices.
- Input validation is performed on both frontend and backend.

## License

This project is for demonstration purposes. Only support lawful, consent-based voice cloning.
