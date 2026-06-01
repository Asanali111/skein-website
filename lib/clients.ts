export type ClientId =
  | "claude-code"
  | "claude-desktop"
  | "cursor"
  | "vscode"
  | "windsurf"
  | "zed"
  | "cline"
  | "roo-code"
  | "codex"
  | "gemini-cli"
  | "antigravity"
  | "opencode"
  | "goose"
  | "crush"
  | "gptme"
  | "hermes"
  | "continue"
  | "kiro"
  | "junie"
  | "amazon-q"
  | "warp";

export type ClientScope = "project" | "global";

export type ClientInstall =
  | { kind: "command"; cmd: string; note?: string }
  | { kind: "config"; path: string; content: string; lang: "json" | "toml" | "yaml" };

export type Client = {
  id: ClientId;
  name: string;
  blurb: string;
  /** project = written into the repo (re-wired per project); global = once per machine. */
  scope: ClientScope;
  /** Shown on the landing page. The rest live only on /integrations. */
  featured?: boolean;
  install: ClientInstall;
  config?: ClientInstall;
};

const WEVEX_URL = "http://127.0.0.1:8765/mcp";

// One command. `wevex up` auto-connects every detected client on first run, so
// the install line is uniform — the per-client `note` says where the config
// lands and the `config` block shows the exact wire format for hand-wiring.
const up = (note: string): ClientInstall => ({ kind: "command", cmd: "wevex up", note });

export const CLIENTS: Client[] = [
  // ---- Featured (also shown on the landing page) ----
  {
    id: "claude-code",
    name: "Claude Code",
    blurb: "Anthropic's official CLI. Registered machine-wide via the claude CLI.",
    scope: "global",
    featured: true,
    install: up("Auto-connected on `wevex up` via `claude mcp add` — registered machine-wide, bearer token in the header."),
    // No file: Claude Code stores MCP servers via its own CLI, not a project file.
  },
  {
    id: "cursor",
    name: "Cursor",
    blurb: "AI-first IDE. Wevex writes a per-project `.cursor/mcp.json`.",
    scope: "project",
    featured: true,
    install: up("Writes `.cursor/mcp.json` in the project (added to `.git/info/exclude` so the token stays out of git)."),
    config: {
      kind: "config",
      path: ".cursor/mcp.json",
      lang: "json",
      content: `{
  "mcpServers": {
    "wevex": {
      "url": "${WEVEX_URL}",
      "type": "http",
      "headers": {
        "Authorization": "Bearer $WEVEX_TOKEN"
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
    scope: "project",
    featured: true,
    install: up("Writes `.vscode/mcp.json` in the project — one entry covers Copilot Chat."),
    config: {
      kind: "config",
      path: ".vscode/mcp.json",
      lang: "json",
      content: `{
  "mcpServers": {
    "wevex": {
      "url": "${WEVEX_URL}",
      "type": "http",
      "headers": {
        "Authorization": "Bearer $WEVEX_TOKEN"
      }
    }
  }
}`,
    },
  },
  {
    id: "windsurf",
    name: "Windsurf",
    blurb: "Codeium's AI-native IDE. Uses the `serverUrl` key, not `url`.",
    scope: "project",
    featured: true,
    install: up("Writes `.windsurf/mcp.json` in the project."),
    config: {
      kind: "config",
      path: ".windsurf/mcp.json",
      lang: "json",
      content: `{
  "mcpServers": {
    "wevex": {
      "serverUrl": "${WEVEX_URL}",
      "headers": {
        "Authorization": "Bearer $WEVEX_TOKEN"
      }
    }
  }
}`,
    },
  },
  {
    id: "zed",
    name: "Zed",
    blurb: "High-performance native editor. Bridged to MCP via npx mcp-remote.",
    scope: "project",
    featured: true,
    install: up("Writes `.zed/settings.json`. Zed speaks stdio, so the bridge needs Node/npx on PATH."),
    config: {
      kind: "config",
      path: ".zed/settings.json",
      lang: "json",
      content: `{
  "context_servers": {
    "wevex": {
      "source": "custom",
      "command": "npx",
      "args": [
        "-y", "mcp-remote", "${WEVEX_URL}", "--allow-http",
        "--header", "Authorization:\${WEVEX_AUTH_HEADER}"
      ],
      "env": { "WEVEX_AUTH_HEADER": "Bearer $WEVEX_TOKEN" }
    }
  }
}`,
    },
  },

  // ---- Full roster (/integrations only) ----
  {
    id: "claude-desktop",
    name: "Claude Desktop",
    blurb: "Anthropic's desktop app. Bridged to the local daemon via npx mcp-remote.",
    scope: "global",
    install: up("Writes `claude_desktop_config.json`. Claude Desktop's remote connectors route through Anthropic's cloud and can't reach 127.0.0.1, so Wevex uses the local mcp-remote stdio bridge (needs Node/npx)."),
    config: {
      kind: "config",
      path: "~/Library/Application Support/Claude/claude_desktop_config.json",
      lang: "json",
      content: `{
  "mcpServers": {
    "wevex": {
      "command": "npx",
      "args": [
        "-y", "mcp-remote", "${WEVEX_URL}", "--allow-http",
        "--header", "Authorization:\${WEVEX_AUTH_HEADER}"
      ],
      "env": { "WEVEX_AUTH_HEADER": "Bearer $WEVEX_TOKEN" }
    }
  }
}`,
    },
  },
  {
    id: "cline",
    name: "Cline",
    blurb: "Autonomous coding agent (VS Code extension). One global settings file.",
    scope: "global",
    install: up("Writes Cline's global `cline_mcp_settings.json` (shared across all projects)."),
    config: {
      kind: "config",
      path: "…/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json",
      lang: "json",
      content: `{
  "mcpServers": {
    "wevex": {
      "url": "${WEVEX_URL}",
      "headers": { "Authorization": "Bearer $WEVEX_TOKEN" },
      "disabled": false,
      "autoApprove": []
    }
  }
}`,
    },
  },
  {
    id: "roo-code",
    name: "Roo Code",
    blurb: "Autonomous coding agent (VS Code extension, Cline fork). Per-project.",
    scope: "project",
    install: up("Writes `.roo/mcp.json` — Roo requires an explicit `type`."),
    config: {
      kind: "config",
      path: ".roo/mcp.json",
      lang: "json",
      content: `{
  "mcpServers": {
    "wevex": {
      "type": "streamable-http",
      "url": "${WEVEX_URL}",
      "headers": { "Authorization": "Bearer $WEVEX_TOKEN" }
    }
  }
}`,
    },
  },
  {
    id: "codex",
    name: "Codex CLI",
    blurb: "OpenAI Codex CLI. TOML config — transport inferred from `url` (iter 18.6).",
    scope: "project",
    install: up("Appends a `[[mcpServers]]` block to `.codex/config.toml`."),
    config: {
      kind: "config",
      path: ".codex/config.toml",
      lang: "toml",
      content: `[[mcpServers]]
name = "wevex"
url = "${WEVEX_URL}"

[mcpServers.headers]
Authorization = "Bearer $WEVEX_TOKEN"`,
    },
  },
  {
    id: "gemini-cli",
    name: "Gemini CLI",
    blurb: "Google's command-line agent. Sunset June 18 2026 — use Antigravity.",
    scope: "global",
    install: up("Writes `~/.gemini/settings.json`."),
    config: {
      kind: "config",
      path: "~/.gemini/settings.json",
      lang: "json",
      content: `{
  "mcpServers": {
    "wevex": {
      "url": "${WEVEX_URL}",
      "headers": { "Authorization": "Bearer $WEVEX_TOKEN" }
    }
  }
}`,
    },
  },
  {
    id: "antigravity",
    name: "Antigravity",
    blurb: "Google's Electron-based agent IDE. Uses `serverUrl` instead of `url`.",
    scope: "global",
    install: up("Writes `~/.gemini/antigravity/mcp_config.json`."),
    config: {
      kind: "config",
      path: "~/.gemini/antigravity/mcp_config.json",
      lang: "json",
      content: `{
  "mcpServers": {
    "wevex": {
      "serverUrl": "${WEVEX_URL}",
      "headers": { "Authorization": "Bearer $WEVEX_TOKEN" }
    }
  }
}`,
    },
  },
  {
    id: "opencode",
    name: "opencode",
    blurb: "Open-source TUI for AI coding agents. Same wire format, nested schema.",
    scope: "global",
    install: up("Writes `~/.config/opencode/config.json`."),
    config: {
      kind: "config",
      path: "~/.config/opencode/config.json",
      lang: "json",
      content: `{
  "mcp": {
    "servers": {
      "wevex": {
        "url": "${WEVEX_URL}",
        "headers": { "Authorization": "Bearer $WEVEX_TOKEN" }
      }
    }
  }
}`,
    },
  },
  {
    id: "goose",
    name: "Goose",
    blurb: "Block's open-source local-first agent. `streamable_http` extension.",
    scope: "global",
    install: up("Writes `~/.config/goose/config.yaml`."),
    config: {
      kind: "config",
      path: "~/.config/goose/config.yaml",
      lang: "yaml",
      content: `extensions:
  wevex:
    enabled: true
    type: streamable_http
    name: wevex
    uri: ${WEVEX_URL}
    headers:
      Authorization: Bearer $WEVEX_TOKEN
    timeout: 300`,
    },
  },
  {
    id: "crush",
    name: "Crush",
    blurb: "Charm's terminal coding agent. Requires an explicit \"type\": \"http\".",
    scope: "project",
    install: up("Writes the project-local `.crush.json`."),
    config: {
      kind: "config",
      path: ".crush.json",
      lang: "json",
      content: `{
  "mcp": {
    "wevex": {
      "type": "http",
      "url": "${WEVEX_URL}",
      "headers": { "Authorization": "Bearer $WEVEX_TOKEN" }
    }
  }
}`,
    },
  },
  {
    id: "gptme",
    name: "gptme",
    blurb: "Autonomous terminal agent. TOML `[[mcp.servers]]` block.",
    scope: "global",
    install: up("Appends a `[[mcp.servers]]` block to `~/.config/gptme/config.toml`."),
    config: {
      kind: "config",
      path: "~/.config/gptme/config.toml",
      lang: "toml",
      content: `[[mcp.servers]]
name = "wevex"
enabled = true
url = "${WEVEX_URL}"
headers = {Authorization = "Bearer $WEVEX_TOKEN"}`,
    },
  },
  {
    id: "hermes",
    name: "Hermes",
    blurb: "Nous Research's autonomous agent. Token lives in an env var, not the YAML.",
    scope: "global",
    install: up("Writes `~/.hermes/config.yaml` and stores the token in `~/.hermes/.env`."),
    config: {
      kind: "config",
      path: "~/.hermes/config.yaml  (token in ~/.hermes/.env)",
      lang: "yaml",
      content: `mcp_servers:
  wevex:
    url: ${WEVEX_URL}
    headers:
      Authorization: Bearer \${MCP_WEVEX_API_KEY}`,
    },
  },
  {
    id: "continue",
    name: "Continue.dev",
    blurb: "Open-source assistant for VS Code / JetBrains. Dedicated block file.",
    scope: "global",
    install: up("Writes a dedicated block file at `~/.continue/mcpServers/wevex.yaml`."),
    config: {
      kind: "config",
      path: "~/.continue/mcpServers/wevex.yaml",
      lang: "yaml",
      content: `name: Wevex
version: 0.0.1
schema: v1
mcpServers:
  - name: wevex
    type: streamable-http
    url: ${WEVEX_URL}
    requestOptions:
      headers:
        Authorization: Bearer $WEVEX_TOKEN`,
    },
  },
  {
    id: "kiro",
    name: "Kiro",
    blurb: "AWS's spec-first AI IDE. Note the extra settings/ path segment.",
    scope: "project",
    install: up("Writes `.kiro/settings/mcp.json` in the project."),
    config: {
      kind: "config",
      path: ".kiro/settings/mcp.json",
      lang: "json",
      content: `{
  "mcpServers": {
    "wevex": {
      "url": "${WEVEX_URL}",
      "headers": { "Authorization": "Bearer $WEVEX_TOKEN" }
    }
  }
}`,
    },
  },
  {
    id: "junie",
    name: "JetBrains Junie",
    blurb: "JetBrains' AI agent (IntelliJ, PyCharm, GoLand, …). Shared JSON format.",
    scope: "project",
    install: up("Writes `.junie/mcp/mcp.json` (project scope; same format as the IDE plugin)."),
    config: {
      kind: "config",
      path: ".junie/mcp/mcp.json",
      lang: "json",
      content: `{
  "mcpServers": {
    "wevex": {
      "url": "${WEVEX_URL}",
      "headers": { "Authorization": "Bearer $WEVEX_TOKEN" }
    }
  }
}`,
    },
  },
  {
    id: "amazon-q",
    name: "Amazon Q Developer",
    blurb: "AWS's AI assistant (q CLI). Remote type: \"http\"; OAuth may be required.",
    scope: "project",
    install: up("Writes `.amazonq/mcp.json`. Amazon Q leads with OAuth for remote auth, so the static bearer header is best-effort."),
    config: {
      kind: "config",
      path: ".amazonq/mcp.json",
      lang: "json",
      content: `{
  "mcpServers": {
    "wevex": {
      "type": "http",
      "url": "${WEVEX_URL}",
      "headers": { "Authorization": "Bearer $WEVEX_TOKEN" }
    }
  }
}`,
    },
  },
  {
    id: "warp",
    name: "Warp",
    blurb: "Agentic terminal / dev environment. Config edits need in-app approval.",
    scope: "project",
    install: up("Writes `.warp/.mcp.json`. Warp requires you to approve the config edit in-app before the server activates."),
    config: {
      kind: "config",
      path: ".warp/.mcp.json",
      lang: "json",
      content: `{
  "mcpServers": {
    "wevex": {
      "url": "${WEVEX_URL}",
      "headers": { "Authorization": "Bearer $WEVEX_TOKEN" }
    }
  }
}`,
    },
  },
];

export const FEATURED_CLIENTS = CLIENTS.filter((c) => c.featured);

export const getClient = (id: string): Client | undefined =>
  CLIENTS.find((c) => c.id === id);
