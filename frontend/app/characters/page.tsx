'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchWithAuth } from "@/lib/api";
import BackstoryModal from '@/components/ui/BackstoryModal';
import RelationshipModal from "@/components/ui/RelationshipModal";
import CharacterCard from "@/components/ui/CharacterCard";

interface Character {
  id: number;
  name: string;
  species: string;
  origin: { name: string };
  image: string;
  backstory?: string;
}

interface Personality {
  [trait: string]: string;
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
  const [modalChar, setModalChar] = useState<Character | null>(null);
  const [relationshipText, setRelationshipText] = useState<string | null>(null);

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
      const backstoryMap: Record<number, string> = {};
      allResults.forEach(c => {
        if (c.backstory) backstoryMap[c.id] = c.backstory;
      });
      setBackstories(backstoryMap);

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
    const isCustom = typeof char.id === 'string';

    try {
      const { backstory } = await fetchWithAuth('/api/ai/backstory', {
        method: 'POST',
        body: JSON.stringify({
          name: char.name,
          species: char.species,
          origin: char.origin.name,
          traits: '',
          characterId: isCustom ? char.id : undefined,
        }),
      });

      setBackstories(prev => ({ ...prev, [char.id]: backstory }));
      setModalChar({ ...char, backstory });

    } catch {
      alert('Failed to generate backstory');
    }
  };

  const deleteBackstory = async (char: Character) => {
    const isCustom = typeof char.id === 'string';
    if (!isCustom) return alert("Only custom characters can have deletable backstories.");

    try {
      await fetchWithAuth(`/api/characters/${char.id}/backstory`, { method: 'DELETE' });
      setBackstories(prev => {
        const copy = { ...prev };
        delete copy[char.id];
        return copy;
      });
      setModalChar(null);
    } catch {
      alert('Failed to delete backstory');
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
      setRelationshipText(relationship);
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
            <CharacterCard
              key={char.id}
              character={char}
              selected={selectedIds.has(char.id)}
              onSelect={() => toggleSelect(char.id)}
              backstory={backstories[char.id]}
              personality={personalities[char.id]}
              episodes={recommendedEpisodes[char.id]}
              onViewBackstory={() =>
                backstories[char.id]
                  ? setModalChar({ ...char, backstory: backstories[char.id] })
                  : getBackstory(char)
              }
              onAnalyzePersonality={() => getPersonality(char)}
              onRecommendEpisodes={() => getEpisodes(char)}
              loadingPersonality={loadingPersonality === char.id}
              loadingEpisodes={loadingEpisodes === char.id}
            />
          ))}
        </div>
      )}

      {modalChar && (
        <BackstoryModal
          open={!!modalChar}
          onClose={() => setModalChar(null)}
          name={modalChar.name}
          backstory={modalChar.backstory || ''}
          isCustom={typeof modalChar.id === 'string'}
          onDelete={
            typeof modalChar.id === 'string'
              ? () => deleteBackstory(modalChar)
              : undefined
          }
          onRegenerate={
            typeof modalChar.id !== 'string'
              ? () => getBackstory(modalChar)
              : undefined
          }
        />
      )}

      {relationshipText && (
        <RelationshipModal
          open={!!relationshipText}
          onClose={() => setRelationshipText(null)}
          relationship={relationshipText}
        />
      )}
    </div>
  );
}