'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchWithAuth } from '@/lib/api';
import BackstoryModal from '@/components/ui/BackstoryModal';

const STATUS_OPTIONS = ['Alive', 'Dead', 'unknown'];
const GENDER_OPTIONS = ['Female', 'Male', 'Genderless', 'unknown'];

export default function EditCharacterPage() {
  const router = useRouter();
  const params = useParams();
  const characterId = params?.id as string;

  const [form, setForm] = useState({
    name: '',
    species: '',
    status: '',
    gender: '',
    origin: '',
    image: '',
  });

  const [backstory, setBackstory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCharacter = async () => {
      try {
        const data = await fetchWithAuth(`/api/characters/${characterId}`);
        const { name, species, status, gender, origin, image, backstory } = data;
        setForm({ name, species, status, gender, origin, image });
        setBackstory(backstory || '');
      } catch (err) {
        alert('Character not found');
        router.push('/custom');
      } finally {
        setLoading(false);
      }
    };

    if (characterId) loadCharacter();
  }, [characterId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await fetchWithAuth(`/api/characters/${characterId}`, {
        method: 'PUT',
        body: JSON.stringify({ ...form }),
      });
      router.push('/custom');
    } catch {
      alert('Failed to update character');
    }
  };

  const generateBackstory = async () => {
    try {
      const { backstory: generated } = await fetchWithAuth('/api/ai/backstory', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          species: form.species,
          origin: form.origin,
          traits: '',
          characterId,
        }),
      });
      setBackstory(generated);
      setShowModal(true);
    } catch {
      alert('Failed to generate backstory');
    }
  };

  const deleteBackstory = async () => {
    try {
      await fetchWithAuth(`/api/characters/${characterId}/backstory`, {
        method: 'DELETE',
      });
      setBackstory('');
      setShowModal(false);
    } catch {
      alert('Failed to delete backstory');
    }
  };

  if (loading) return <p className="p-4">Loading…</p>;

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Edit Character</h1>

      {/* Text inputs */}
      <Input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />
      <Input
        name="species"
        placeholder="Species"
        value={form.species}
        onChange={handleChange}
      />

      {/* Status dropdown */}
      <div>
        <label className="block font-medium mb-1">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Status</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Gender dropdown */}
      <div>
        <label className="block font-medium mb-1">Gender</label>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Gender</option>
          {GENDER_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Origin */}
      <Input
        name="origin"
        placeholder="Origin"
        value={form.origin}
        onChange={handleChange}
      />

      {/* Image URL */}
      <Input
        name="image"
        placeholder="Image URL"
        value={form.image}
        onChange={handleChange}
      />

      {/* Backstory section */}
      {backstory ? (
        <Button variant="default" onClick={() => setShowModal(true)}>
          View Backstory
        </Button>
      ) : (
        <Button variant="default" onClick={generateBackstory}>
          Generate Backstory
        </Button>
      )}

      <Button onClick={handleSubmit} className="w-full">
        Save Changes
      </Button>

      <BackstoryModal
        open={showModal}
        onClose={() => setShowModal(false)}
        name={form.name}
        backstory={backstory}
        isCustom={true}
        onDelete={deleteBackstory}
        onRegenerate={generateBackstory}
      />
    </div>
  );
}