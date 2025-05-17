'use client'
import { TasjiilRepo } from "@/utils/supabase/repo";
import { createClient } from "@/utils/supabase/server";
import { useState } from "react"

type AddTasjilDTO = {
  taalimId: number;
  title: string;
  file: File | null;
  recordedAt: string;
};

const client = createClient()

export function AdminForm() {
  const [form, setForm] = useState<AddTasjilDTO>({
    taalimId: 1,
    title: "",
    file: null,
    recordedAt: "",
  });
  const [creating, setCreating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files) {
      if (!form.title) {
        setForm(prev => ({ ...prev, title: files[0].name}))
      }
      setForm((prev) => ({ ...prev, file: files[0] }));
    } else if (type === "number") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, taalimId: Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // handle form submission here
    const repo = new TasjiilRepo(client)
    if (!form.file) return
    setCreating(true)
    await repo.addTasjiil({
      ...form,
      file: form.file!
    })
    setCreating(false)
    alert('Uploaded!')
  };

  return (
    <form
      className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-6"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block mb-1 font-medium" htmlFor="taalimId">
          Taalim ID
        </label>
        <select
          id="taalimId"
          name="taalimId"
          value={form.taalimId}
          onChange={handleSelectChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="1">Abu Hirr - Ajurumiyyah</option>
          <option value="2">Abu Hirr - Khulasoh Tadzim Ilm</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="file">
          Audio File
        </label>
        <input
          type="file"
          id="file"
          name="file"
          accept="audio/*"
          onChange={handleChange}
          className="w-full"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="title">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="recordedAt">
          Recorded At
        </label>
        <input
          type="datetime-local"
          id="recordedAt"
          name="recordedAt"
          value={form.recordedAt}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <button
        disabled={creating}
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {creating ? 'Uploading...' : 'Submit'}
      </button>
    </form>
  );
}

const AdminContent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOk, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setOk(true);
    }
  };

  if (isOk) {
    return <AdminForm />;
  }

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 bg-white rounded shadow">
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium" htmlFor="email">
            Email
          </label>
          <input
            className="w-full border px-4 py-2 rounded"
            placeholder="you@email.com"
            type="email"
            id="email"
            autoComplete="username"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="password">
            Password
          </label>
          <input
            className="w-full border px-4 py-2 rounded"
            placeholder="Your password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default AdminContent
