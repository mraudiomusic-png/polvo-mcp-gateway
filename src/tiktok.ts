/**
 * 🐙 POLVO DIGITAL — TIKTOK LAB
 *
 * Integração experimental com o servidor MCP oficial
 * do TikTok for Business.
 *
 * IMPORTANTE:
 * Este módulo permanece isolado do núcleo do Polvo
 * até concluirmos os testes de autenticação.
 */

export const TIKTOK_MCP_SERVER = "tt-ads-mcp-layer";

export const TIKTOK_MCP_BASE_URL =
  `https://business-api.tiktok.com/open_mcp/${TIKTOK_MCP_SERVER}`;

export const TIKTOK_OAUTH_BASE_URL =
  `${TIKTOK_MCP_BASE_URL}/oauth`;

export function getTikTokOAuthDiscoveryUrl(): string {
  return `${TIKTOK_OAUTH_BASE_URL}/.well-known/openid-configuration`;
}

export function getTikTokMcpUrl(): string {
  return TIKTOK_MCP_BASE_URL;
}
export const TIKTOK_REDIRECT_URI =
  "https://polvo-mcp-gateway.mraudiomusic.workers.dev/oauth/tiktok/callback";

export async function registerTikTokClient() {
  const response = await fetch(`${TIKTOK_OAUTH_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_name: "Polvo Digital TikTok Lab",
      redirect_uris: [TIKTOK_REDIRECT_URI],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `TikTok DCR falhou (${response.status}): ${JSON.stringify(data)}`,
    );
  }

  return data;
}
