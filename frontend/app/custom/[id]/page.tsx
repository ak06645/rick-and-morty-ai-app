'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchWithAuth } from '@/lib/api';

interface CharacterForm {
  name: string;
  species: string;
  status: string;
  gender: string;
  origin: string;
  image: string;
  backstory: string;
}

export default function EditCharacterPage() {
  const router = useRouter();
  const params = useParams();
  const characterId = params?.id as string;

  const [form, setForm] = useState<CharacterForm>({
    name: '',
    species: '',
    status: '',
    gender: '',
    origin: '',
    image: '',
    backstory: '',
  });

  const [loading, setLoading] = useState(true);

  // Load character data
  useEffect(() => {
    const loadCharacter = async () => {
      try {
        const data = await fetchWithAuth(`/api/characters/${characterId}`);

        // Destructure only the fields we want
        const {
          name = '',
          species = '',
          status = '',
          gender = '',
          origin = '',
          image = '',
          backstory = '',
        } = data;

        setForm({ name, species, status, gender, origin, image, backstory });
      } catch (err) {
        console.error('Failed to load character:', err);
        alert('Character not found');
        router.push('/custom');
      } finally {
        setLoading(false);
      }
    };

    if (characterId) loadCharacter();
  }, [characterId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await fetchWithAuth(`/api/characters/${characterId}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      router.push('/custom');
    } catch (err) {
      console.error('Failed to update character:', err);
      alert('Failed to update character');
    }
  };

  if (loading) return <p className="p-4">Loading…</p>;

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Edit Character</h1>

      {Object.entries(form).map(([key, value]) => (
        <Input
          key={key}
          name={key}
          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          value={value}
          onChange={handleChange}
        />
      ))}

      <Button onClick={handleSubmit} className="w-full">
        Save Changes
      </Button>
    </div>
  );
}