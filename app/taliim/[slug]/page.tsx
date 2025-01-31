import Player, { PlayerEntry } from "@/components/Player";
import { createClient, SupabaseClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

function Item({
  title,
  taliimSlug,
  url,
  slug,
  recorded_at,
}: {
  title: string;
  taliimSlug: string;
  url: string;
  slug: string;
  recorded_at: string;
}) {
  return (
    <div className="flex items-center border-b border-blue-400 gap-8 px-2 py-2 justify-between">
      <p>
        {format(new Date(recorded_at), "dd/MM/yy")} - {title}{" "}
      </p>
      <div className="inline-flex gap-2">
        <a href={url} className="underline text-blue-700" target="_blank">
          Link Audio
        </a>
        |
        <Link
          className="text-blue-700 underline"
          href={`/taliim/${taliimSlug}?tasjilat=${slug}`}
        >
          Putar
        </Link>
      </div>
    </div>
  );
}

async function getTaliim(client: SupabaseClient, slug: string) {
  const row = await client
    .from("taliims")
    .select(`*, tasjilaats(*), ustadhs(*)`)
    .eq("slug", slug)
    .maybeSingle();

  return row.data;
}

async function getMeta(
  client: SupabaseClient,
  {
    taliim_slug,
    tasjilat_slug,
  }: {
    taliim_slug: string;
    tasjilat_slug?: string;
  }
) {
  const query = client
    .from("taliims")
    .select(`kitab_title, slug, ustadhs(name), tasjilaats(title, slug)`)
    .eq("slug", taliim_slug);
  if (tasjilat_slug) {
    query.eq("tasjilaats.slug", tasjilat_slug);
  }
  const row = await query.maybeSingle();

  if (!row.data) return "Not found";
  let title = row.data.kitab_title;
  const tasjil =
    row.data.tasjilaats?.length === 1 ? row.data.tasjilaats[0].title : "";
  if (tasjil) title = `${tasjil} ${title}`;

  return `${title} - ${row.data.ustadhs.name}`;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tasjilat: string }>;
}): Promise<Metadata> {
  // read route params
  const slug = (await params).slug;
  const tasjilSlug = (await searchParams).tasjilat;
  const client = await createClient();

  const title = await getMeta(client, {
    taliim_slug: slug,
    tasjilat_slug: tasjilSlug,
  });

  return {
    title,
  };
}

export default async function TaliimDetail({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    tasjilat?: string;
  }>;
}) {
  const par = await params;
  const search = await searchParams;
  const client = await createClient();
  const taliim = await getTaliim(client, par.slug);

  if (!taliim) return <p>Tidak ditemukan</p>;

  const entries: PlayerEntry[] = taliim?.tasjilaats.map((t) => ({
    url: t.audio_url,
    slug: t.slug,
    ustadh: taliim.ustadhs.name!,
    title: t.title,
  }));

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <h1 className="text-lg font-bold">{taliim?.kitab_title}</h1>
          <div>{taliim?.kitab_title_ar}</div>
          <div>{taliim?.ustadhs.name} حفظه الله</div>
        </div>
        <div>
          {taliim?.tasjilaats.length === 0 && <div>--Belum ada rekaman--</div>}
          {taliim?.tasjilaats.map((tasjil) => (
            <Item
              key={tasjil.id}
              title={tasjil.title}
              url={tasjil.audio_url}
              taliimSlug={taliim.slug}
              slug={tasjil.slug}
              recorded_at={tasjil.recorded_at}
            />
          ))}
        </div>
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

      <Player entries={entries} defaultEntrySlug={search.tasjilat} />
    </div>
  );
}
