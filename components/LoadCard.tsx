"use client";

import { LoadItem } from "@/lib/mockApi";

interface LoadCardProps {
  load: LoadItem;
  onDelete: (id: string) => void;
}

export default function LoadCard({ load, onDelete }: LoadCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {load.status}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(load.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
          {load.origin} &rarr; {load.destination}
        </h3>
        <p className="text-sm text-gray-600 mb-4">Weight: {load.weight}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs font-mono text-gray-400">ID: {load.id}</span>
        <button
          onClick={() => onDelete(load.id)}
          className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
