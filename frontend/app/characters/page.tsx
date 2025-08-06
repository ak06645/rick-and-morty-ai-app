'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchWithAuth } from "@/lib/api";

interface Character {
  id: number;
  name: string;
  species: string;
  origin: { name: string };
  image: string;
}

interface Personality {
  Openness: string;
  Conscientiousness: string;
  Extraversion: string;
  Agreeableness: string;
  Neuroticism: string;
}

export default function CharacterSearch() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [backstories, setBackstories] = useState<Record<number, string>>({});
  const [personalities, setPersonalities] = useState<Record<number, Personality>>({});
  const [recommendedEpisodes, setRecommendedEpisodes] = useState<Record<number, any[]>>({});
  const [loadingPersonality, setLoadingPersonality] = useState<number | null>(null);
  const [loadingEpisodes, setLoadingEpisodes] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [relationships, setRelationships] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    setIsAuth(true);
  }, [router]);

  if (!isAuth) return null;

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const safeFetch = async (params: URLSearchParams): Promise<Character[]> => {
        try {
          const data = await fetchWithAuth(`/api/characters/search?${params}`);
          return (data.results || []) as Character[];
        } catch (err: any) {
          if (err.message.includes("Not Found")) return [];
          throw err;
        }
      };

      let allResults: Character[] = [];
      const parts = query.split(",").map(s => s.trim()).filter(Boolean);

      if (parts.length === 2) {
        const params = new URLSearchParams({ name: parts[0], species: parts[1] });
        allResults = await safeFetch(params);
      } else {
        const term = query.trim();
        const [byName, bySpecies]: Character[][] = await Promise.all([
          safeFetch(new URLSearchParams({ name: term })),
          safeFetch(new URLSearchParams({ species: term })),
        ]);
        const map = new Map<number, Character>();
        byName.concat(bySpecies).forEach((c: Character) => {
          map.set(c.id, c);
        });
        allResults = Array.from(map.values());
      }

      setResults(allResults);
    } catch (err: any) {
      console.error("Fetch error:", err);
      alert(err.message || "Failed to fetch characters");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchCharacters();
  };

  const getBackstory = async (char: Character) => {
    try {
      const { backstory } = await fetchWithAuth('/api/ai/backstory', {
        method: 'POST',
        body: JSON.stringify({
          name: char.name,
          species: char.species,
          origin: char.origin.name,
          traits: ''
        }),
      });
      setBackstories(prev => ({ ...prev, [char.id]: backstory }));
      alert(`Backstory for ${char.name}:\n\n${backstory}`);
    } catch {
      alert('Failed to generate backstory');
    }
  };

  const getPersonality = async (char: Character) => {
    const backstory = backstories[char.id];
    if (!backstory) return alert('Generate backstory first!');

    setLoadingPersonality(char.id);
    try {
      const { profile } = await fetchWithAuth('/api/ai/personality', {
        method: 'POST',
        body: JSON.stringify({ name: char.name, backstory }),
      });
      setPersonalities(prev => ({ ...prev, [char.id]: profile }));
    } catch {
      alert('Failed to analyze personality');
    } finally {
      setLoadingPersonality(null);
    }
  };

  const getEpisodes = async (char: Character) => {
    const backstory = backstories[char.id];
    if (!backstory) return alert('Generate backstory first!');

    setLoadingEpisodes(char.id);
    try {
      const { episodes } = await fetchWithAuth('/api/ai/episodes', {
        method: 'POST',
        body: JSON.stringify({
          name: char.name,
          traits: '',
          backstory
        }),
      });
      setRecommendedEpisodes(prev => ({ ...prev, [char.id]: episodes }));
    } catch {
      alert('Failed to recommend episodes');
    } finally {
      setLoadingEpisodes(null);
    }
  };

  const generateRelationship = async () => {
    const selectedChars = results.filter(c => selectedIds.has(c.id));
    try {
      const { relationship } = await fetchWithAuth('/api/ai/relationships', {
        method: 'POST',
        body: JSON.stringify({ characters: selectedChars }),
      });
      setRelationships(relationship);
      alert(`🤝 Suggested Relationship:\n\n${relationship}`);
    } catch {
      alert("Failed to predict relationship");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Search Rick & Morty Characters</h1>

      <form onSubmit={handleSearchSubmit} className="flex gap-4">
        <Input
          placeholder="e.g. Morty or Alien or Morty, Alien"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </Button>
      </form>

      {selectedIds.size >= 2 && (
        <div className="pb-4">
          <Button onClick={generateRelationship}>
            Generate Relationship
          </Button>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          {results.map((char) => (
            <div
              key={char.id}
              onClick={() => toggleSelect(char.id)}
              className={`border rounded-xl p-4 shadow space-y-2 cursor-pointer ${
                selectedIds.has(char.id) ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <img
                src={char.image}
                alt={char.name}
                className="rounded mb-2 w-full object-cover"
              />
              <h2 className="text-xl font-semibold">{char.name}</h2>
              <p>Species: {char.species}</p>
              <p>Origin: {char.origin.name}</p>

              <div className="flex flex-col gap-2">
                <Button onClick={(e) => { e.stopPropagation(); getBackstory(char); }}>
                  Generate Backstory
                </Button>
                <Button
                  variant="outline"
                  onClick={(e) => { e.stopPropagation(); getPersonality(char); }}
                  disabled={loadingPersonality === char.id}
                >
                  {loadingPersonality === char.id ? 'Analyzing...' : 'Analyze Personality'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={(e) => { e.stopPropagation(); getEpisodes(char); }}
                  disabled={loadingEpisodes === char.id}
                >
                  {loadingEpisodes === char.id ? 'Recommending...' : 'Recommend Episodes'}
                </Button>
              </div>

              {personalities[char.id] && (
                <div className="mt-3 p-3 bg-gray-100 rounded text-sm space-y-1">
                  <p className="font-semibold">Personality Profile:</p>
                  {Object.entries(personalities[char.id]).map(([trait, value]) => (
                    <p key={trait}>
                      <strong>{trait}:</strong> {value}
                    </p>
                  ))}
                </div>
              )}

              {recommendedEpisodes[char.id] && (
                <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded text-sm space-y-2">
                  <p className="font-semibold">Recommended Episodes:</p>
                  {recommendedEpisodes[char.id].map((ep, idx) => (
                    <div key={idx}>
                      <p>📺 <strong>{ep.title}</strong> ({ep.episode})</p>
                      <p className="text-xs italic text-gray-600">— {ep.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}