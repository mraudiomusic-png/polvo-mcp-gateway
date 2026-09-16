import { createMcpHandler } from "agents/mcp/server";
import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { registerTikTokClient } from "./tiktok";

const POLVO_VERSION = "1.3.0";
const POLVO_AI_MODEL = "@cf/zai-org/glm-4.7-flash";

function extractAiText(result: any): string {
  const candidates = [
    result?.response,
    result?.result?.response,
    result?.choices?.[0]?.message?.content,
    result?.choices?.[0]?.text,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return JSON.stringify(result);
}

function createServer(env: any) {
  const server = new McpServer({
    name: "Polvo Digital MCP Gateway",
    version: POLVO_VERSION,
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
    "polvo_ia",
    {
      description:
        "Envia uma pergunta para o primeiro cérebro externo do Polvo Digital usando Cloudflare Workers AI.",
      inputSchema: {
        pergunta: z.string().min(1),
      },
    },
    async ({ pergunta }) => {
      try {
        const result = await env.AI.run(POLVO_AI_MODEL, {
          messages: [
            {
              role: "system",
              content:
                "Você é um tentáculo de inteligência do Polvo Digital. Responda em português do Brasil, com clareza, objetividade e sem inventar fatos.",
            },
            {
              role: "user",
              content: pergunta,
            },
          ],
        });

        const resposta = extractAiText(result);

        return {
          content: [
            {
              type: "text",
              text:
                `🐙🧠 Resposta do cérebro externo (${POLVO_AI_MODEL}):\n\n` +
                resposta,
            },
          ],
        };
      } catch (error) {
        const detalhe =
          error instanceof Error ? error.message : String(error);

        return {
          isError: true,
          content: [
            {
              type: "text",
              text:
                "🐙⚠️ O Polvo recebeu a tarefa, mas o Workers AI não respondeu corretamente.\n\n" +
                `Detalhe técnico: ${detalhe}`,
            },
          ],
        };
      }
    },
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
            `Versão: ${POLVO_VERSION}\n` +
            "Status: ONLINE ✅\n" +
            "Hospedagem: Cloudflare Workers ☁️\n" +
            "Deploy: GitHub Actions 🚀\n" +
            "Protocolo: MCP\n" +
            "Autenticação atual: Sem login ⚠️\n" +
            `Cérebro externo: Workers AI — ${POLVO_AI_MODEL} 🧠\n\n` +
            "Tentáculos ativos:\n" +
            "1. polvo_status — diagnóstico de disponibilidade\n" +
            "2. polvo_echo — teste de comunicação\n" +
            "3. polvo_info — central de comando\n" +
            "4. polvo_ia — consulta ao primeiro cérebro externo\n\n" +
            "🎊 Sistema operacional. Polvo vivo. Quarto tentáculo autorizado. Confete liberado.",
        },
      ],
    }),
  );

  return server;
}

export default {
  async fetch(request: Request, env: any, ctx: any) {
    const url = new URL(request.url);

    // 🧪 TikTok Lab — registro DCR temporário
    if (url.pathname === "/lab/tiktok/register") {
      try {
        const registration: any = await registerTikTokClient();

        return Response.json({
          ok: true,
          message: "🐙🎵 Polvo registrado no TikTok MCP com sucesso.",
          client_id: registration.client_id,
        });
      } catch (error) {
        const detalhe =
          error instanceof Error ? error.message : String(error);

        return Response.json(
          {
            ok: false,
            message: "🐙⚠️ Falha no registro DCR do TikTok.",
            detalhe,
          },
          { status: 500 },
        );
      }
    }

    // 🐙🎵 Callback OAuth do TikTok for Business
    if (url.pathname === "/oauth/tiktok/callback") {
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      if (error) {
        return new Response(
          `🐙⚠️ TikTok não autorizou a conexão.\nErro: ${error}`,
          {
            status: 400,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          },
        );
      }

      if (!code) {
        return new Response(
          "🐙 TikTok Lab: callback ONLINE. Aguardando autorização.",
          {
            status: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          },
        );
      }

      return new Response(
        "🐙🎵 TikTok autorizou o Polvo e enviou o código de autorização. Próxima etapa: troca segura por tokens.",
        {
          status: 200,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        },
      );
    }

    // Mantém o MCP atual funcionando normalmente
    return createMcpHandler(() => createServer(env))(request, env, ctx);
  },
};
