"use client";
import React from "react";

export default function AddRandomLiftButton({
  addRandomLift,
}: {
  addRandomLift: (formData: FormData) => void;
}) {
  return (
    <form action={addRandomLift}>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors duration-150"
      >
        Add random lift
      </button>
    </form>
  );
}
