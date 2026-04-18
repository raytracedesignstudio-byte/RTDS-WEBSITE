const API_BASE = import.meta.env.VITE_API_URL || "/api";

function getHeaders(auth?: string): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (auth) headers["Authorization"] = `Bearer ${auth}`;
  return headers;
}

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers: getHeaders(token) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  token?: string,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPut<T>(
  path: string,
  body: unknown,
  token?: string,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiDelete(path: string, token?: string): Promise<void> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function uploadImage(file: File, token: string): Promise<string> {
  const urlRes = await fetch(`${API_BASE}/storage/uploads/request-url`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({
      name: file.name,
      size: file.size,
      contentType: file.type,
    }),
  });
  if (!urlRes.ok) throw new Error("Failed to get upload URL");
  const { uploadURL, uploadParams } = await urlRes.json();

  const formData = new FormData();
  formData.append("file", file);
  for (const [key, value] of Object.entries(
    uploadParams as Record<string, string>,
  )) {
    formData.append(key, value);
  }

  const uploadRes = await fetch(uploadURL, {
    method: "POST",
    body: formData,
  });
  if (!uploadRes.ok) {
    throw new Error("Failed to upload image to Cloudinary");
  }

  const uploaded = await uploadRes.json();
  if (!uploaded?.secure_url) {
    throw new Error("Cloudinary did not return a secure URL");
  }

  return uploaded.secure_url as string;
}
