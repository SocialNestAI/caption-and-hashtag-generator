'use client';

import { useState } from 'react';
import { AICaptionGenerator, Header, Footer, CaptionResult } from '@/components';

export default function Home() {
  const [generatedCaptions, setGeneratedCaptions] = useState<CaptionResult[]>([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Tool Hero */}
      <section style={{ paddingTop: '96px', paddingBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>
          Caption and Hashtag Generator
        </h1>
        <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto 16px' }}>
          Generate engaging social media captions instantly with AI.
        </p>
        <p style={{ fontSize: '14px', color: '#888', maxWidth: '700px', margin: '0 auto' }}>
          Part of <a href="https://socialnestai.com" target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', textDecoration: 'underline' }}>Social Nest AI</a> • Open-sourced for developers •
          <a href="https://github.com/socialnest/ai-caption-generator" target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', textDecoration: 'underline', marginLeft: '4px' }}>View on GitHub</a>
        </p>
      </section>

      {/* Tool Interface */}
      <section className="pb-10">
        <AICaptionGenerator
          onGenerate={(captions) => setGeneratedCaptions(captions)}
        />
      </section>

      <Footer />
    </div>
  );
}