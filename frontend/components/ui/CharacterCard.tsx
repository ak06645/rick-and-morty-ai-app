'use client';

import { Button } from './button';

interface Character {
  id: number | string;
  name: string;
  species: string;
  origin: { name: string };
  image: string;
  backstory?: string;
}

interface Personality {
  [trait: string]: string;
}

interface Episode {
  title: string;
  episode: string;
  reason: string;
}

interface Props {
  character: Character;
  selected?: boolean;
  onSelect?: () => void;
  backstory?: string;
  personality?: Personality;
  episodes?: Episode[];
  onViewBackstory?: () => void;
  onAnalyzePersonality?: () => void;
  onRecommendEpisodes?: () => void;
  loadingPersonality?: boolean;
  loadingEpisodes?: boolean;
}

export default function CharacterCard({
  character,
  selected,
  onSelect,
  backstory,
  personality,
  episodes,
  onViewBackstory,
  onAnalyzePersonality,
  onRecommendEpisodes,
  loadingPersonality,
  loadingEpisodes,
}: Props) {
  return (
    <div
      onClick={onSelect}
      className={`border rounded-xl p-4 shadow space-y-2 cursor-pointer ${
        selected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <img
        src={character.image}
        alt={character.name}
        className="rounded mb-2 w-full object-cover"
      />
      <h2 className="text-xl font-semibold">{character.name}</h2>
      <p>Species: {character.species}</p>
      <p>Origin: {character.origin?.name || 'Unknown'}</p>

      <div className="flex flex-col gap-2">
        {onViewBackstory && (
          <Button onClick={(e) => {
            e.stopPropagation();
            onViewBackstory();
          }}>
            {backstory ? 'View Backstory' : 'Generate Backstory'}
          </Button>
        )}

        {onAnalyzePersonality && (
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onAnalyzePersonality();
            }}
            disabled={loadingPersonality}
          >
            {loadingPersonality ? 'Analyzing...' : 'Analyze Personality'}
          </Button>
        )}

        {onRecommendEpisodes && (
          <Button
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onRecommendEpisodes();
            }}
            disabled={loadingEpisodes}
          >
            {loadingEpisodes ? 'Recommending...' : 'Recommend Episodes'}
          </Button>
        )}
      </div>

      {personality && (
        <div className="mt-3 p-3 bg-gray-100 rounded text-sm space-y-1">
          <p className="font-semibold">Personality Profile:</p>
          {Object.entries(personality).map(([trait, value]) => (
            <p key={trait}>
              <strong>{trait}:</strong> {value}
            </p>
          ))}
        </div>
      )}

      {episodes && (
        <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded text-sm space-y-2">
          <p className="font-semibold">Recommended Episodes:</p>
          {episodes.map((ep, idx) => (
            <div key={idx}>
              <p>📺 <strong>{ep.title}</strong> ({ep.episode})</p>
              <p className="text-xs italic text-gray-600">— {ep.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}