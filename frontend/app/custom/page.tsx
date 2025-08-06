"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchWithAuth } from "@/lib/api";

interface Character {
  _id?: string;
  name: string;
  species: string;
  status?: string;
  gender?: string;
  origin?: string;
  image?: string;
  backstory?: string;
}

export default function MyCharactersPage() {
  const router = useRouter();
  const [chars, setChars] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);

  // fetch the user’s custom characters
  const loadChars = async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth("/api/characters"); // your CRUD route
//        const data = await fetchWithAuth("/api/custom-characters");
      setChars(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load your characters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChars();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Characters</h1>
      <Button onClick={() => router.push("/custom/new")}>
        + Add New Character
      </Button>

      {loading && <p>Loading…</p>}

      {!loading && chars.length === 0 && (
        <p className="text-gray-500">You have no custom characters yet.</p>
      )}

      <ul className="space-y-2">
        {chars.map((c) => (
          <li key={c._id} className="border rounded p-4 flex justify-between">
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm">Species: {c.species}</p>
            </div>
            <div className="space-x-2">
              <Button size="sm" onClick={() => router.push(`/custom/${c._id}`)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={async () => {
                  if (!confirm("Delete this character?")) return;
                  await fetchWithAuth(`/api/characters/${c._id}`, { method: "DELETE" });
                  loadChars();
                }}
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
