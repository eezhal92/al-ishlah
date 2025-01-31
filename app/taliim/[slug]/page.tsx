import { createClient, SupabaseClient } from "@/utils/supabase/server";
import Image from "next/image";

function Item({ title, url }: { title: string; url: string }) {
  return (
    <div className="flex items-center gap-8 bg-blue-100 mb-4 px-4 py-2 rounded">
      <p>
        {title} -{" "}
        <a href={url} className="underline text-blue-700" target="_blank">
          Link Audio
        </a>
      </p>
      <audio controls src={url}></audio>
    </div>
  );
}

async function getTaliim(client: SupabaseClient, slug: string) {
  const row = await client
    .from("taliims")
    .select(`*, tasjilaats(*), ustadhs(*)`)
    .eq("slug", slug)
    .maybeSingle();

  return row.data
}

export default async function TaliimDetail({ params }: { params: Promise<{ slug: string }>}) {
  const par = await params
  const client = await createClient();
  const taliim = await getTaliim(client, par.slug)

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <h1 className="text-lg font-bold">{taliim?.kitab_title}</h1>
          <div>{taliim?.kitab_title_ar}</div>
          <div>{taliim?.ustadhs.name} حفظه الله</div>
        </div>
        {taliim?.tasjilaats.length === 0 && (
          <div>--Belum ada rekaman--</div>
        )}
        {taliim?.tasjilaats.map((tasjil) => (
          <Item key={tasjil.id} title={tasjil.title} url={tasjil.audio_url} />
        ))}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
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
        </a>
      </footer>
    </div>
  );
}
