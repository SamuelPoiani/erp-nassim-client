'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineArrowLeft, AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { toast } from 'react-toastify';

interface PostData {
  title: string;
  description: string;
  content: string;
  image: string;
}

interface GenerateOptions {
  urls: string[];
  llm: string | null;
  length: number;
  custom_prompt: string[];
  temperature: string;
}

export default function NewPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [postData, setPostData] = useState<PostData>({
    title: '',
    description: '',
    content: '',
    image: ''
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generateOptions, setGenerateOptions] = useState<GenerateOptions>({
    urls: [],
    llm: null,
    length: 1000,
    custom_prompt: [],
    temperature: "0.70"
  });

  const generateContent = async () => {
    if (!url) {
      toast.error('Please enter a URL to generate content');
      return;
    }

    setLoading(true);
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const payload = {
        urls: [url],
        llm: null, // Keep as null
        length: generateOptions.length,
        custom_prompt: generateOptions.custom_prompt.length > 0 
          ? generateOptions.custom_prompt 
          : "",
        temperature: generateOptions.temperature
      };

      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.result) {
        setPostData(prev => ({
          ...prev,
          content: data.result
        }));
        toast.success('Content generated successfully!');
      } else {
        toast.error(data.message || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Network error: Could not generate content');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('http://localhost:3001/api/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Post created successfully!');
        router.push('/dashboard/posts');
      } else {
        toast.error(data.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Network error: Could not create post');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrompt = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      const value = input.value.trim();
      
      if (value) {
        setGenerateOptions(prev => ({
          ...prev,
          custom_prompt: [...prev.custom_prompt, value]
        }));
        input.value = '';
      }
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

        <div className="mb-6">
          <label className="block mb-2">URL to Generate Content:</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="https://example.com/article"
            />
            <button
              onClick={generateContent}
              disabled={loading || !url}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mt-2 text-sm"
          >
            {showAdvanced ? <AiOutlineUp /> : <AiOutlineDown />}
            Advanced Options
          </button>

          {showAdvanced && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-4">
              <div>
                <label className="block text-sm mb-1">Content Length:</label>
                <input
                  type="number"
                  value={generateOptions.length}
                  onChange={(e) => setGenerateOptions(prev => ({
                    ...prev,
                    length: parseInt(e.target.value)
                  }))}
                  className="w-full p-2 border rounded"
                  min="100"
                  max="1000"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Temperature:</label>
                <input
                  type="range"
                  value={parseFloat(generateOptions.temperature) * 100}
                  onChange={(e) => setGenerateOptions(prev => ({
                    ...prev,
                    temperature: (parseInt(e.target.value) / 100).toFixed(2)
                  }))}
                  className="w-full"
                  min="1"
                  max="100"
                />
                <div className="text-sm text-gray-600 mt-1">
                  {generateOptions.temperature} (Lower = more focused, Higher = more creative)
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Custom Prompts:</label>
                <div className="flex gap-2 relative">
                  <input
                    type="text"
                    placeholder="Type a prompt and press Enter to add"
                    className="flex-1 p-2 pr-24 border rounded" // Added pr-20 for right padding
                    onKeyDown={handleAddPrompt}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs bg-white px-1 pointer-events-none select-none">
                    Press Enter ↵
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Add multiple prompts by pressing Enter after each one
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {generateOptions.custom_prompt.map((prompt, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full flex items-center gap-1"
                    >
                      {prompt}
                      <button
                        onClick={() => setGenerateOptions(prev => ({
                          ...prev,
                          custom_prompt: prev.custom_prompt.filter((_, i) => i !== index)
                        }))}
                        className="hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Title:</label>
            <input
              type="text"
              value={postData.title}
              onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Description:</label>
            <input
              type="text"
              value={postData.description}
              onChange={(e) => setPostData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Image URL:</label>
            <input
              type="url"
              value={postData.image}
              onChange={(e) => setPostData(prev => ({ ...prev, image: e.target.value }))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Content:</label>
            <textarea
              value={postData.content}
              onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full p-2 border rounded min-h-[190px]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
}