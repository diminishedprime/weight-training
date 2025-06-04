"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

export default function LiftsTable({ lifts, lift_type }: { lifts: any[]; lift_type: string }) {
  const searchParams = useSearchParams();
  const flashId = searchParams.get("flash");

  return (
    <>
      <style>{`
        .flash-row {
          animation: flash-bg 1.5s ease-in-out;
        }
        @keyframes flash-bg {
          0% { background-color: #fef08a; }
          50% { background-color: #fef08a; }
          100% { background-color: inherit; }
        }
      `}</style>
      <div className="overflow-x-auto mt-8">
        <table className="w-full table-auto border-separate border-spacing-x-8 border-spacing-y-2 bg-white shadow rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
              <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
              <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reps</th>
              <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {lifts.map((lift: any, idx: number) => (
              <tr
                key={lift.id || idx}
                className={
                  (idx % 2 === 0 ? "bg-white" : "bg-gray-50") +
                  (flashId && (lift.lift_id === flashId || lift.id === flashId)
                    ? " flash-row"
                    : "")
                }
              >
                <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-900">
                  {lift.performed_at
                    ? new Date(lift.performed_at).toLocaleString()
                    : "N/A"}
                </td>
                <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-900">
                  {lift.weight_value}
                </td>
                <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-900">
                  {lift.weight_unit}
                </td>
                <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-900">
                  {lift.reps}
                </td>
                <td className="px-8 py-4 whitespace-nowrap text-sm">
                  <a
                    href={`/exercise/${lift_type}/edit/${
                      lift.lift_id || lift.id
                    }`}
                    className="inline-block px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-xs font-semibold"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
