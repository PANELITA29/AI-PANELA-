
import React, { useState, useCallback } from 'react';
import { generatePanelaImage } from './services/geminiService';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SparklesIcon, ExclamationTriangleIcon } from './components/Icons';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("An epic and powerful background for a block of panela (unrefined raw cane sugar). The panela should be the centerpiece, glowing with a warm, golden light. The background should be dramatic, with sun rays breaking through dark clouds over a vast sugarcane field. The mood should be strong and majestic.");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = useCallback(async () => {
    if (!prompt || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const url = await generatePanelaImage(prompt);
      setImageUrl(url);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Failed to generate image: ${err.message}`);
      } else {
        setError("An unknown error occurred.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-600">
            Panela Power Image Generator
          </h1>
          <p className="text-gray-400 mt-2">Create a powerful background for a panela using Gemini.</p>
        </header>

        <main className="bg-gray-800/50 rounded-2xl shadow-2xl p-6 backdrop-blur-sm border border-gray-700">
          <div className="flex flex-col gap-4">
            <label htmlFor="prompt-input" className="font-semibold text-gray-300">
              Your Vision
            </label>
            <textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
              className="w-full h-32 p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all resize-none"
              disabled={isLoading}
            />
            <button
              onClick={handleGenerateImage}
              disabled={isLoading || !prompt}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon />
                  Generate Image
                </>
              )}
            </button>
          </div>

          <div className="mt-8">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg flex items-center gap-3">
                <ExclamationTriangleIcon />
                <p>{error}</p>
              </div>
            )}

            <div className="w-full aspect-video bg-gray-900/50 rounded-lg mt-4 border border-gray-700 flex items-center justify-center overflow-hidden">
              {isLoading && (
                <div className="flex flex-col items-center text-gray-400">
                  <LoadingSpinner />
                  <p className="mt-2">The model is creating your masterpiece...</p>
                </div>
              )}
              {!isLoading && imageUrl && (
                <img src={imageUrl} alt="Generated panela background" className="object-contain w-full h-full" />
              )}
              {!isLoading && !imageUrl && !error && (
                <div className="text-center text-gray-500">
                  <p>Your generated image will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
