export type ClientId =
  | "claude-code"
  | "cursor"
  | "codex"
  | "gemini-cli"
  | "antigravity"
  | "opencode"
  | "vscode";

export type ClientInstall =
  | { kind: "command"; cmd: string; note?: string }
  | { kind: "config"; path: string; content: string; lang: "json" | "toml" };

export type Client = {
  id: ClientId;
  name: string;
  blurb: string;
  install: ClientInstall;
  config?: ClientInstall;
};

const SKEIN_URL = "http://127.0.0.1:8765/mcp";

export const CLIENTS: Client[] = [
  {
    id: "claude-code",
    name: "Claude Code",
    blurb: "Anthropic's official CLI. Shared memory across every Claude session.",
    install: {
      kind: "command",
      cmd: `claude mcp add skein --transport http ${SKEIN_URL} --header "Authorization: Bearer $SKEIN_TOKEN"`,
      note: "Run once — Claude Code stores MCPs in its own settings. Use `skein doctor` to print your bearer token.",
    },
  },
  {
    id: "cursor",
    name: "Cursor",
    blurb: "AI-first IDE. Skein writes a per-project `.cursor/mcp.json`.",
    install: {
      kind: "command",
      cmd: "skein connect cursor",
      note: "Writes `.cursor/mcp.json` in the current project.",
    },
    config: {
      kind: "config",
      path: ".cursor/mcp.json",
      lang: "json",
      content: `{
  "mcpServers": {
    "skein": {
      "url": "${SKEIN_URL}",
      "type": "http",
      "headers": {
        "Authorization": "Bearer $SKEIN_TOKEN"
      }
    }
  }
}`,
    },
  },
  {
    id: "codex",
    name: "Codex CLI",
    blurb: "OpenAI Codex CLI / ChatGPT Desktop. TOML config — no `transport` key (iter 18.6).",
    install: {
      kind: "command",
      cmd: "skein connect codex",
      note: "Appends a `[[mcpServers]]` block to `.codex/config.toml`.",
    },
    config: {
      kind: "config",
      path: ".codex/config.toml",
      lang: "toml",
      content: `[[mcpServers]]
name = "skein"
url = "${SKEIN_URL}"

[mcpServers.headers]
Authorization = "Bearer $SKEIN_TOKEN"`,
    },
  },
  {
    id: "gemini-cli",
    name: "Gemini CLI",
    blurb: "Google's command-line Gemini agent. No `transport` key (iter 18.1 fix).",
    install: {
      kind: "command",
      cmd: "skein connect gemini-cli",
      note: "Writes `~/.gemini/settings.json`. Transport is inferred from `url`.",
    },
    config: {
      kind: "config",
      path: "~/.gemini/settings.json",
      lang: "json",
      content: `{
  "mcpServers": {
    "skein": {
      "url": "${SKEIN_URL}",
      "headers": {
        "Authorization": "Bearer $SKEIN_TOKEN"
      }
    }
  }
}`,
    },
  },
  {
    id: "antigravity",
    name: "Antigravity",
    blurb: "Google's Electron-based agent IDE. Uses `serverUrl` instead of `url`.",
    install: {
      kind: "command",
      cmd: "skein connect antigravity",
      note: "Writes `~/.gemini/antigravity/mcp_config.json`.",
    },
    config: {
      kind: "config",
      path: "~/.gemini/antigravity/mcp_config.json",
      lang: "json",
      content: `{
  "mcpServers": {
    "skein": {
      "serverUrl": "${SKEIN_URL}",
      "headers": {
        "Authorization": "Bearer $SKEIN_TOKEN"
      }
    }
  }
}`,
    },
  },
  {
    id: "opencode",
    name: "opencode",
    blurb: "Open-source TUI for AI coding agents. Same MCP wire format, different schema.",
    install: {
      kind: "command",
      cmd: "skein connect opencode",
      note: "Writes `~/.config/opencode/config.json`.",
    },
    config: {
      kind: "config",
      path: "~/.config/opencode/config.json",
      lang: "json",
      content: `{
  "mcp": {
    "servers": {
      "skein": {
        "url": "${SKEIN_URL}",
        "headers": {
          "Authorization": "Bearer $SKEIN_TOKEN"
        }
      }
    }
  }
}`,
    },
  },
  {
    id: "vscode",
    name: "VS Code / Copilot",
    blurb: "Visual Studio Code with GitHub Copilot Chat. Per-workspace MCP.",
    install: {
      kind: "command",
      cmd: "skein connect vscode",
      note: "Writes `.vscode/mcp.json` in the current project.",
    },
    config: {
      kind: "config",
      path: ".vscode/mcp.json",
      lang: "json",
      content: `{
  "mcpServers": {
    "skein": {
      "url": "${SKEIN_URL}",
      "type": "http",
      "headers": {
        "Authorization": "Bearer $SKEIN_TOKEN"
      }
    }
  }
}`,
    },
  },
];

export const getClient = (id: string): Client | undefined =>
  CLIENTS.find((c) => c.id === id);
