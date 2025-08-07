'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchWithAuth } from '@/lib/api';

const STATUS_OPTIONS = ['Alive', 'Dead', 'unknown'];
const GENDER_OPTIONS = ['Female', 'Male', 'Genderless', 'unknown'];

export default function NewCharacterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    species: '',
    status: '',
    gender: '',
    origin: '',
    image: '',
  });

  const [useUpload, setUseUpload] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result?.toString() || '';
      setForm(prev => ({ ...prev, image: base64 }));
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    try {
      await fetchWithAuth('/api/characters', {
        method: 'POST',
        body: JSON.stringify({ ...form }),
      });
      router.push('/custom');
    } catch {
      alert('Failed to create character');
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Add Custom Character</h1>

      {/* Name */}
      <Input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />

      {/* Species */}
      <Input
        name="species"
        placeholder="Species"
        value={form.species}
        onChange={handleChange}
      />

      {/* Status Dropdown */}
      <div>
        <label className="block font-medium mb-1">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Status</option>
          {STATUS_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Gender Dropdown */}
      <div>
        <label className="block font-medium mb-1">Gender</label>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Gender</option>
          {GENDER_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
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

      {/* Image upload / URL */}
      <div>
        <label className="block font-medium mb-1">Image</label>
        <div className="flex items-center gap-4 mb-2">
          <Button
            type="button"
            variant={useUpload ? 'outline' : 'default'}
            onClick={() => setUseUpload(false)}
          >
            Use URL
          </Button>
          <Button
            type="button"
            variant={useUpload ? 'default' : 'outline'}
            onClick={() => setUseUpload(true)}
          >
            Upload File
          </Button>
        </div>

        {useUpload ? (
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
        ) : (
          <Input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
          />
        )}

        {(form.image || imagePreview) && (
          <img
            src={imagePreview || form.image}
            alt="Character preview"
            className="mt-3 w-32 h-32 object-cover rounded"
          />
        )}
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Create
      </Button>
    </div>
  );
}