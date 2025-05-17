import { SupabaseClient } from "./server";

export type UploadTasjiilDTO = {
  file: File;
  /**
   * @example abu-huraerah
   */
  ustadhSlug: string;
  /**
   * @example ajurumiyyah
   */
  darsSlug: string;
};

type AddTasjilDTO = {
  taalimId: number;
  title: string;
  file: File;
  /**
   * ISO date string
   */
  recordedAt: string;
};

export class TasjiilRepo {
  private client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  public async addTasjiil(payload: AddTasjilDTO) {
    const taliim = await this.client
      .from("taliims")
      .select("*, ustadh:ustadh_id(*)")
      .eq("id", payload.taalimId)
      .maybeSingle();

    if (!taliim.data) return Promise.reject(new Error("Taliim was not found"));
    const upload = await this.uploadFile({
      darsSlug: taliim.data.slug,
      ustadhSlug: taliim.data.ustadh.slug,
      file: payload.file,
    });

    const tasjiilSlug = `${taliim.data.slug}-${slugify(payload.title)}`;

    const { error } = await this.client.from("tasjilaats").insert({
      audio_url: upload.publicURL,
      taliim_id: payload.taalimId,
      title: payload.title,
      slug: tasjiilSlug,
      recorded_at: payload.recordedAt,
    });

    if (error) {
      return Promise.reject(new Error(error.message))
    }
  }

  /**
   * @param tasjil
   * @param file
   * @returns The promise of file URL
   */
  public async uploadFile(
    tasjil: UploadTasjiilDTO
  ): Promise<{ publicURL: string }> {
    const { file } = tasjil;
    const allowedFileMime = [
      "audio/mpeg",
      "audio/mp4",
      "audio/ogg",
      "audio/webm",
      "audio/x-m4a",
    ];

    if (!allowedFileMime.includes(file.type))
      return Promise.reject(new Error("Unsupported audio file type"));

    const { darsSlug, ustadhSlug } = tasjil;
    const filepath = `${ustadhSlug}/${darsSlug}/${file.name}`;
    const { error } = await this.client.storage
      .from("tasjilaats")
      .upload(filepath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) return Promise.reject(error);
    const publicURL = await getPublicURL(this.client, filepath);

    return {
      publicURL,
    };
  }
}

async function getPublicURL(client: SupabaseClient, filepath: string) {
  const { data } = await client.storage
    .from("tasjilaats")
    .getPublicUrl(filepath);

  return data.publicUrl;
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-") // Replace spaces and non-word chars with hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}
