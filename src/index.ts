import { createMcpHandler } from "agents/mcp/server";
import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

function createServer() {
  const server = new McpServer({
    name: "Polvo Digital MCP Gateway",
    version: "1.1.0",
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
        "Repete uma mensagem recebida para testar a comunicação entre o Claude e o Polvo Digital.",
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

  return server;
}

export default {
  fetch(request, env, ctx) {
    return createMcpHandler(createServer)(request, env, ctx);
  },
};
