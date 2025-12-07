'use client';

import { useState, useRef } from 'react';
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedInIcon,
  YouTubeIcon,
  TikTokIcon,
  PinterestIcon,
  ThreadsIcon,
  GoogleIcon,
  BlueskyIcon,
  MastodonIcon
} from './PlatformIcons';



export interface CaptionResult {
  caption: string;
  tone: string;
  platform: string;
  hashtags?: string[];
}

interface CopiedState {
  index: number;
  type: 'all' | 'text';
}

interface AICaptionGeneratorProps {
  apiKey?: string;
  apiUrl?: string;
  onGenerate?: (captions: CaptionResult[]) => void;
  className?: string;
}

const TONES = [
  { value: 'casual', label: 'Casual', emoji: '😄' },
  { value: 'cheeky', label: 'Cheeky', emoji: '😏' },
  { value: 'cheerful', label: 'Cheerful', emoji: '😊' },
  { value: 'confident', label: 'Confident', emoji: '💪' },
  { value: 'direct', label: 'Direct', emoji: '🎯' },
  { value: 'dry', label: 'Dry', emoji: '😐' },
  { value: 'educational', label: 'Educational', emoji: '📚' },
  { value: 'firm', label: 'Firm', emoji: '👊' },
  { value: 'flowery', label: 'Flowery', emoji: '🌸' },
  { value: 'formal', label: 'Formal', emoji: '🎩' },
  { value: 'frank', label: 'Frank', emoji: '💬' },
  { value: 'friendly', label: 'Friendly', emoji: '👋' },
  { value: 'fun', label: 'Fun', emoji: '🎉' },
  { value: 'grumpy', label: 'Grumpy', emoji: '😤' },
  { value: 'helpful', label: 'Helpful', emoji: '🤝' },
  { value: 'inspirational', label: 'Inspirational', emoji: '⭐' },
];

const PLATFORMS = [
  { name: 'Facebook', Icon: FacebookIcon, value: 'facebook' },
  { name: 'Instagram', Icon: InstagramIcon, value: 'instagram' },
  { name: 'X/Twitter', Icon: TwitterIcon, value: 'twitter' },
  { name: 'LinkedIn', Icon: LinkedInIcon, value: 'linkedin' },
  { name: 'YouTube', Icon: YouTubeIcon, value: 'youtube' },
  { name: 'Google Posts', Icon: GoogleIcon, value: 'google' },
  { name: 'Pinterest', Icon: PinterestIcon, value: 'pinterest' },
  { name: 'TikTok', Icon: TikTokIcon, value: 'tiktok' },
  { name: 'Threads', Icon: ThreadsIcon, value: 'threads' },
  { name: 'Bluesky', Icon: BlueskyIcon, value: 'bluesky' },
  { name: 'Mastodon', Icon: MastodonIcon, value: 'mastodon' },
];

export function AICaptionGenerator({
  apiKey,
  apiUrl = '/api/gemini',
  onGenerate,
  className = ''
}: AICaptionGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [tone, setTone] = useState('casual');
  const [generateHashtags, setGenerateHashtags] = useState(true);
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState<CaptionResult[]>([]);
  const [error, setError] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);
  const [copiedState, setCopiedState] = useState<CopiedState | null>(null);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [toneOpen, setToneOpen] = useState(false);

  const handleGenerateCaptions = async () => {
    if (!topic.trim()) {
      setError('Please describe your content');
      return;
    }

    setError('');
    setLoading(true);
    setCaptions([]);

    try {
      let promptText = `Generate 5 different ${tone.trim()} social media captions for ${platform.trim()} about: "${topic}". `;

      if (generateHashtags) {
        promptText += `For each caption, also generate relevant hashtags. Return the response as a JSON array where each object has 'caption' (string) and 'hashtags' with # prefixed on each (array of strings).`;
      } else {
        promptText += `Return the response as a JSON array where each object has 'caption' (string).`;
      }

      const requestBody = { prompt: promptText };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey && { "Authorization": `Bearer ${apiKey}` }),
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (!data || typeof data.text !== 'string') {
        setError("API response format unexpected. Expected an object with a 'text' string field.");
        return;
      }

      const rawAiResponseString = data.text;
      const jsonMatch = rawAiResponseString.match(/```json\s*([\s\S]*?)\s*```/);
      const cleanedJsonString = jsonMatch ? jsonMatch[1].trim() : rawAiResponseString.trim();

      let generatedResults: { caption: string; hashtags?: string[] }[] = [];

      try {
        const parsed = JSON.parse(cleanedJsonString);

        if (!Array.isArray(parsed)) {
          throw new Error("AI response is not an array");
        }

        if (parsed.length === 0) {
          setError("AI generated no captions. Please try with different input.");
          return;
        }

        if (!parsed.every(item => typeof item === 'object' && item !== null && 'caption' in item)) {
          throw new Error("AI response format invalid: not all items have 'caption' field.");
        }

        generatedResults = parsed;
      } catch (jsonParseError: any) {
        setError(`Invalid response format: ${jsonParseError.message}. Please refine your input and try again.`);
        return;
      }

      const enhancedResults = generatedResults.slice(0, 5).map((result) => ({
        caption: result.caption,
        tone,
        platform,
        hashtags: Array.isArray(result.hashtags) ? result.hashtags : [],
      }));

      setCaptions(enhancedResults);
      onGenerate?.(enhancedResults);
    } catch (err) {
      let errorMessage = 'Failed to generate captions. Check console for details.';

      if (err instanceof TypeError) {
        errorMessage = 'Network error. Please check your connection or API endpoint.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number, type: 'all' | 'text') => {
    navigator.clipboard.writeText(text);
    setCopiedState({ index, type });
    setTimeout(() => setCopiedState(null), 2000);
  };

  const isCopied = (index: number, type: 'all' | 'text'): boolean => {
    return copiedState?.index === index && copiedState?.type === type;
  };

  const getToneName = (value: string) => {
    return TONES.find(t => t.value === value)?.label || value;
  };

  const getToneEmoji = (value: string) => {
    return TONES.find(t => t.value === value)?.emoji || '😄';
  };

  const getPlatformName = (value: string) => {
    return PLATFORMS.find(p => p.value === value)?.name || value;
  };

  const getPlatformIcon = (value: string) => {
    return PLATFORMS.find(p => p.value === value)?.Icon || InstagramIcon;
  };

  return (
    <div className={`ai-caption-generator ${className}`}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 md:p-10">
          <div className="space-y-7">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Caption Generator</h2>
              <p className="text-gray-600">Generate engaging captions for your social media posts</p>
            </div>

            <div className="group">
              <div className="flex items-center gap-2 mb-3">
                <label htmlFor="topic" className="block text-lg font-semibold text-gray-900">
                  What is your post about?
                </label>
                <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Required</span>
              </div>
              <textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Describe your content, topic, or what you want to post about..."
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none resize-none transition-colors duration-200 bg-gray-50 placeholder-gray-500 text-gray-900 font-medium"
                rows={3}
              />
              <div className="mt-2 text-xs text-gray-500">
                {topic.length} characters
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Platform
                </label>
                <div className="relative">
                  <button
                    onClick={() => setPlatformOpen(!platformOpen)}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white cursor-pointer font-medium text-gray-900 text-left flex items-center justify-between hover:border-gray-300 transition-colors duration-200"
                  >
                    <span>{getPlatformName(platform)}</span>
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${platformOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>

                  {platformOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden">
                      {PLATFORMS.map((p) => {
                        const Icon = p.Icon;
                        return (
                          <button
                            key={p.value}
                            onClick={() => {
                              setPlatform(p.value);
                              setPlatformOpen(false);
                            }}
                            className={`w-full px-5 py-4 text-left font-medium transition-colors duration-200 ${platform === p.value
                              ? 'bg-blue-100 text-blue-900 border-l-4 border-blue-600'
                              : 'text-gray-900 hover:bg-gray-100'
                              }`}
                          >
                            {p.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="group">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Tone
                </label>
                <div className="relative">
                  <button
                    onClick={() => setToneOpen(!toneOpen)}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white cursor-pointer font-medium text-gray-900 text-left flex items-center justify-between hover:border-gray-300 transition-colors duration-200"
                  >
                    <span>{getToneName(tone)}</span>
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${toneOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>

                  {toneOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-y-auto max-h-80">
                      {TONES.map((t) => (
                        <button
                          key={t.value}
                          onClick={() => {
                            setTone(t.value);
                            setToneOpen(false);
                          }}
                          className={`w-full px-5 py-4 text-left font-medium transition-colors duration-200 ${tone === t.value
                            ? 'bg-blue-100 text-blue-900 border-l-4 border-blue-600'
                            : 'text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center p-4 rounded-lg bg-gray-50 border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200 cursor-pointer group/checkbox">
              <input
                id="generateHashtags"
                type="checkbox"
                checked={generateHashtags}
                onChange={(e) => setGenerateHashtags(e.target.checked)}
                className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-2 border-purple-300 rounded cursor-pointer"
              />
              <label htmlFor="generateHashtags" className="ml-3 block font-semibold text-gray-900 cursor-pointer flex-1">
                Include relevant hashtags
              </label>
              <span className="text-blue-600 font-medium text-sm">✨ Recommended</span>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 font-medium max-w-full overflow-hidden">
                <div className="flex gap-3">
                  <span className="text-lg flex-shrink-0">⚠️</span>
                  <span className="break-words">{error}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleGenerateCaptions}
              disabled={loading || !topic.trim()}
              className="w-full py-3 px-6 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#7c3aed' }}
              onMouseEnter={(e) => {
                if (!loading && topic.trim()) {
                  e.currentTarget.style.backgroundColor = '#6d28d9';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && topic.trim()) {
                  e.currentTarget.style.backgroundColor = '#7c3aed';
                }
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"></circle>
                    <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating captions...
                </span>
              ) : (
                <>Generate Captions</>
              )}
            </button>
          </div>
        </div>
      </div>

      {captions.length > 0 && (
        <div ref={resultsRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  ✨ AI-Generated Results
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Your Captions Are Ready!
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose your favorite caption and customize as needed. All captions are optimized for {getPlatformName(platform)} with a {getToneName(tone)} tone.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {captions.map((caption, index) => {
                const PlatformIcon = getPlatformIcon(caption.platform);
                return (
                  <div
                    key={index}
                    className="group bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                  >
                    <div className="bg-gray-50 p-4 border-b-2 border-gray-200">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">
                          Option {index + 1}
                        </span>
                        <div className="flex items-center gap-1 px-3 py-1 bg-white border-2 border-gray-300 text-gray-700 rounded-full text-xs font-semibold">
                          <PlatformIcon className="w-4 h-4" />
                          {getPlatformName(caption.platform)}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-6 flex flex-col">
                      <div className="mb-5">
                        <p className="text-gray-800 leading-relaxed font-medium text-base">
                          {caption.caption}
                        </p>
                      </div>

                      {caption.hashtags && caption.hashtags.length > 0 && (
                        <div className="mb-6">
                          <p className="text-xs font-semibold text-gray-600 mb-3">Hashtags:</p>
                          <div className="flex flex-wrap gap-2">
                            {caption.hashtags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-block text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors cursor-default"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 mt-auto">
                        <button
                          onClick={() =>
                            copyToClipboard(
                              `${caption.caption}${caption.hashtags && caption.hashtags.length > 0 ? `\n\n${caption.hashtags.join(' ')}` : ''}`,
                              index,
                              'all'
                            )
                          }
                          className={`flex-1 px-4 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${isCopied(index, 'all')
                            ? 'bg-green-600'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                          {isCopied(index, 'all') ? (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy All
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(caption.caption, index, 'text')}
                          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${isCopied(index, 'text')
                            ? 'bg-green-100 text-green-700 border-2 border-green-300'
                            : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200'
                            }`}
                        >
                          {isCopied(index, 'text') ? (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Done
                            </>
                          ) : (
                            <>✂️ Text Only</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4 font-medium">Want more options?</p>
              <button
                onClick={() => {
                  setCaptions([]);
                  document.querySelector('textarea')?.focus();
                }}
                className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
              >
                ↻ Generate More Captions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AICaptionGenerator;