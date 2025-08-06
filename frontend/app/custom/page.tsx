'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fetchWithAuth } from "@/lib/api";
import CharacterCard from "@/components/ui/CharacterCard";

interface Character {
  _id: string;
  name: string;
  species: string;
  status?: string;
  gender?: string;
  origin?: string;
  image: string;
  backstory?: string;
}

export default function MyCharactersPage() {
  const router = useRouter();
  const [chars, setChars] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChars();
  }, []);

  const loadChars = async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth("/api/characters");
      setChars(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load your characters");
    } finally {
      setLoading(false);
    }
  };

  const deleteChar = async (id: string) => {
    if (!confirm("Delete this character?")) return;
    try {
      await fetchWithAuth(`/api/characters/${id}`, { method: "DELETE" });
      loadChars();
    } catch {
      alert("Failed to delete character");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Characters</h1>
        <Button onClick={() => router.push("/custom/new")}>
          + Add New Character
        </Button>
      </div>

      {loading && <p>Loading…</p>}
      {!loading && chars.length === 0 && (
        <p className="text-gray-500">You have no custom characters yet.</p>
      )}

      {!loading && chars.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {chars.map((char) => (
            <div key={char._id} className="flex flex-col gap-2">
              <CharacterCard
                character={{
                  id: char._id,
                  name: char.name,
                  species: char.species,
                  origin: { name: char.origin || "Unknown" },
                  image: char.image,
                  backstory: char.backstory,
                }}
              />

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => router.push(`/custom/${char._id}`)}
                >
                  Edit
                </Button>
                <Button
                  className="flex-1"
                  variant="destructive"
                  onClick={() => deleteChar(char._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}