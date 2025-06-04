"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateLiftForUserAction } from "./actions";

export default function EditLiftForm({
  lift,
  user_id,
}: {
  lift: any;
  user_id: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [form, setForm] = useState({
    weight_value: lift.weight_value,
    weight_unit: lift.weight_unit,
    reps: lift.reps,
    performed_at: lift.performed_at
      ? new Date(lift.performed_at).toISOString().slice(0, 16)
      : "",
    warmup: lift.warmup,
    completion_status: lift.completion_status,
    lift_type: lift.lift_type,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const result = await updateLiftForUserAction({
      lift_id: lift.lift_id,
      user_id,
      lift_type: form.lift_type,
      weight_value: Number(form.weight_value),
      reps: Number(form.reps),
      performed_at: form.performed_at
        ? new Date(form.performed_at).toISOString()
        : null,
      weight_unit: form.weight_unit,
      warmup: form.warmup,
      completion_status: form.completion_status,
    });
    if (result?.error) {
      setError(result.error);
      return;
    }
    router.push(`/exercise/${form.lift_type}?flash=${lift.lift_id}`);
  }

  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Weight</label>
        <input
          type="number"
          name="weight_value"
          value={form.weight_value}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Unit</label>
        <select
          name="weight_unit"
          value={form.weight_unit}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="pounds">Pounds</option>
          <option value="kilograms">Kilograms</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Reps</label>
        <input
          type="number"
          name="reps"
          value={form.reps}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
          min="1"
          step="1"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Date/Time</label>
        <input
          type="datetime-local"
          name="performed_at"
          value={form.performed_at}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          name="warmup"
          checked={form.warmup}
          onChange={handleChange}
          className="mr-2"
        />
        <label className="font-medium">Warmup</label>
      </div>
      <div>
        <label className="block mb-1 font-medium">Completion Status</label>
        <select
          name="completion_status"
          value={form.completion_status}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="Completed">Completed</option>
          <option value="Not Completed">Not Completed</option>
          <option value="Failed">Failed</option>
          <option value="Skipped">Skipped</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Save Changes
      </button>
    </form>
  );
}
