import { useState } from "react";
import { addNewSuperblock } from "@/app/superblock/_components/NewSuperblock/actions";
import { useRouter } from "next/navigation"; // Added for redirection

/**
 * API for NewSuperblock component logic.
 * @field name - The name of the new superblock.
 * @field setName - Setter for the name field.
 * @field notes - The notes for the new superblock (optional).
 * @field setNotes - Setter for the notes field.
 * @field error - Error message, if any.
 * @field loading - Whether the creation is in progress.
 * @field handleSubmit - Form submit handler for creating a new superblock.
 */
export interface NewSuperblock {
  name: string;
  setName: (name: string) => void;
  notes: string | undefined;
  setNotes: (notes: string | undefined) => void;
  error: string | null;
  loading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * Hook to encapsulate AddNewSuperblock logic and state.
 * Use as: const api = useAddNewSuperblockAPI();
 */
export const useNewSuperblock = (): NewSuperblock => {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState<string | undefined>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Added for redirection

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error } = await addNewSuperblock({ name, notes });
    setName("");
    setNotes("");
    if (data) {
      // Redirect to the new superblock's page
      router.push(`/superblock/${data.id}`);
    }
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return {
    name,
    setName,
    notes,
    setNotes,
    error,
    loading,
    handleSubmit,
  };
};
