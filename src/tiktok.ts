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
