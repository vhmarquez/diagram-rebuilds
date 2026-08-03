const viteBaseUrl = (
  import.meta as ImportMeta & { env?: { BASE_URL?: string } }
).env?.BASE_URL;

const baseUrl = viteBaseUrl?.endsWith("/") ? viteBaseUrl : `${viteBaseUrl ?? "/"}/`;

export function withBasePath(path: string) {
  return `${baseUrl}${path.replace(/^\/+/, "")}`;
}
