"use client";
import { useRouter, useSearchParams } from "next/navigation";

type MovieFilterPanelProps = {
  genres: { name: string }[];
  directors: string[];
  actors: string[];
};

export default function MovieFilterPanel({
  genres,
  directors,
  actors,
}: MovieFilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    // Reset director and actor when genre changes
    if (key === "genre") {
      params.delete("director");
      params.delete("actor");
    }
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/movies?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex flex-wrap gap-4">
      {/* Genre */}
      <div>
        <label className="block mb-2 font-semibold">Genre</label>
        <select
          value={searchParams.get("genre") ?? ""}
          onChange={(e) => updateParam("genre", e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          {genres.map((g) => (
            <option key={g.name} value={g.name}>
              {g.name}
            </option>
          ))}
        </select>
      </div>
      {/* Director */}
      <div>
        <label className="block mb-2 font-semibold">Director</label>
        <select
          value={searchParams.get("director") ?? ""}
          onChange={(e) => updateParam("director", e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          {directors.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      {/* Actor */}
      <div>
        <label className="block mb-2 font-semibold">Actor</label>
        <select
          value={searchParams.get("actor") ?? ""}
          onChange={(e) => updateParam("actor", e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          {actors.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
