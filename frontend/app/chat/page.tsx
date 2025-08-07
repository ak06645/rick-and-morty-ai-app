'use client';

import { useEffect, useState, FormEvent, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Character {
  id: number;
  name: string;
}

export default function ChatPage() {
  const [prompt, setPrompt] = useState('');
  const [character, setCharacter] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    const fetchCharacters = async () => {
      let allCharacters: Character[] = [];
      let page = 1;
      let hasNextPage = true;

      try {
        while (hasNextPage) {
          const res = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
          const data = await res.json();
          const pageCharacters = data.results.map((char: any) => ({
            id: char.id,
            name: char.name,
          }));

          allCharacters = [...allCharacters, ...pageCharacters];

          hasNextPage = !!data.info?.next;
          page++;
        }

        setCharacters(allCharacters);
        setCharacter(allCharacters[0]?.name || '');
      } catch (err) {
        console.error('Failed to fetch characters:', err);
      }
    };

    fetchCharacters();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('Thinking...');

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          character,
          message: prompt
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error: ${res.status} – ${errorText}`);
      }

      const data = await res.json();
      setResponse(data.response || 'No response received.');
    } catch (error) {
      console.error('Chat Error:', error);
      setResponse('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🧠 Chat with a Rick & Morty Character</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Character</label>
          <select
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {characters.map((char) => (
              <option key={char.id} value={char.name}>
                {char.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Your Message</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something like: What do you think of humans?"
            className="min-h-[100px]"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Thinking...' : `Ask ${character}`}
        </Button>
      </form>

      {response && (
        <div className="bg-gray-100 p-4 rounded shadow mt-6 whitespace-pre-wrap">
          <p className="text-sm text-gray-500 mb-2 font-semibold">{character} says:</p>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}