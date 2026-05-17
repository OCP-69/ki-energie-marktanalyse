/**
 * S3-Speicher-Hilfsfunktionen
 * Nutzt die vorkonfigurierten Forge-API-Endpunkte für Datei-Uploads
 */

const FORGE_BASE_URL = (process.env.BUILT_IN_FORGE_API_URL || "").replace(/\/+$/, "");
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY || "";

export async function storagePut(
  relKey: string,
  data: Buffer,
  contentType: string = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  // Presigned PUT URL holen
  const presignUrl = new URL("v1/storage/presign/put", FORGE_BASE_URL + "/");
  presignUrl.searchParams.set("path", relKey);
  presignUrl.searchParams.set("content_type", contentType);

  const presignResp = await fetch(presignUrl.toString(), {
    headers: { Authorization: `Bearer ${FORGE_KEY}` },
  });

  if (!presignResp.ok) {
    const text = await presignResp.text();
    throw new Error(`Presign PUT failed: ${presignResp.status} ${text}`);
  }

  const { url: putUrl } = (await presignResp.json()) as { url: string };

  // Datei hochladen
  const uploadResp = await fetch(putUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: data,
  });

  if (!uploadResp.ok) {
    throw new Error(`S3 upload failed: ${uploadResp.status}`);
  }

  return { key: relKey, url: `/manus-storage/${relKey}` };
}

export async function storageGet(
  relKey: string,
  expiresIn: number = 3600
): Promise<{ key: string; url: string }> {
  const presignUrl = new URL("v1/storage/presign/get", FORGE_BASE_URL + "/");
  presignUrl.searchParams.set("path", relKey);
  presignUrl.searchParams.set("expires_in", String(expiresIn));

  const presignResp = await fetch(presignUrl.toString(), {
    headers: { Authorization: `Bearer ${FORGE_KEY}` },
  });

  if (!presignResp.ok) {
    throw new Error(`Presign GET failed: ${presignResp.status}`);
  }

  const { url } = (await presignResp.json()) as { url: string };
  return { key: relKey, url };
}

export async function storageDelete(relKey: string): Promise<void> {
  const deleteUrl = new URL("v1/storage/delete", FORGE_BASE_URL + "/");
  deleteUrl.searchParams.set("path", relKey);

  const resp = await fetch(deleteUrl.toString(), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${FORGE_KEY}` },
  });

  if (!resp.ok) {
    throw new Error(`Storage delete failed: ${resp.status}`);
  }
}
