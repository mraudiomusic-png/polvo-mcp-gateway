import { createMcpHandler } from "agents/mcp/server";
import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

function createServer() {
  const server = new McpServer({
    name: "Polvo Digital MCP Gateway",
    version: "1.2.0",
  });

  server.registerTool(
    "polvo_status",
    {
      description: "Verifica se o gateway MCP do Polvo Digital está online.",
      inputSchema: {
        mensagem: z.string().optional(),
      },
    },
    async ({ mensagem }) => ({
      content: [
        {
          type: "text",
          text: mensagem
            ? `🐙 Polvo Digital MCP está ONLINE. Mensagem recebida: ${mensagem}`
            : "🐙 Polvo Digital MCP está ONLINE e pronto para receber ferramentas.",
        },
      ],
    }),
  );

  server.registerTool(
    "polvo_echo",
    {
      description:
        "Repete uma mensagem recebida para testar a comunicação entre o cliente e o Polvo Digital.",
      inputSchema: {
        mensagem: z.string(),
      },
    },
    async ({ mensagem }) => ({
      content: [
        {
          type: "text",
          text: `🐙 Eco do Polvo: ${mensagem}`,
        },
      ],
    }),
  );

  server.registerTool(
    "polvo_info",
    {
      description:
        "Mostra informações do Polvo Digital MCP Gateway, versão, ferramentas e estado atual.",
      inputSchema: {},
    },
    async () => ({
      content: [
        {
          type: "text",
          text:
            "🐙💥 CENTRAL DE COMANDO DO POLVO DIGITAL\n\n" +
            "Versão: 1.2.0\n" +
            "Status: ONLINE ✅\n" +
            "Hospedagem: Cloudflare Workers ☁️\n" +
            "Deploy: GitHub Actions 🚀\n" +
            "Protocolo: MCP\n" +
            "Autenticação atual: Sem login ⚠️\n\n" +
            "Tentáculos ativos:\n" +
            "1. polvo_status — diagnóstico de disponibilidade\n" +
            "2. polvo_echo — teste de comunicação\n" +
            "3. polvo_info — central de comando\n\n" +
            "🎊 Sistema operacional. Polvo vivo. Confete autorizado.",
        },
      ],
    }),
  );

  return server;
}

export default {
  fetch(request, env, ctx) {
    return createMcpHandler(createServer)(request, env, ctx);
  },
};
