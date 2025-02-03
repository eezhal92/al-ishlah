import { createClient, SupabaseClient } from "@/utils/supabase/server";
// import Image from "next/image";
import Link from "next/link";

async function getUstadhs(client: SupabaseClient) {
  const row = await client.from("ustadhs").select(`*, taliims(*)`);

  return row.data;
}

function Ustad({
  ustadh,
  taliims,
}: {
  ustadh: { id: number; name: string | null };
  taliims: Array<{ id: number; kitab_title: string; slug: string }>;
}) {
  return (
    <div className="mb-6">
      <h2 className="mb-2 font-bold text-lg">{ustadh.name}</h2>

      <div>
        {taliims.map((t, i) => (
          <div key={t.id}>
            <Link className="text-blue-500 underline" href={`/taliim/${t.slug}`}>
              {i + 1}) {t.kitab_title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  const client = await createClient();
  const ustadhs = await getUstadhs(client);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Daar Al-Ishlah</h1>
        <div>
          {ustadhs?.map((u) => (
            <Ustad key={u.id} ustadh={u} taliims={u.taliims} />
          ))}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/* <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a> */}
      </footer>
    </div>
  );
}
