---
title: 'What Is MCP? The Model Context Protocol, Explained Simply'
description: MCP is not a model, it is a plug. The Model Context Protocol is an open standard for connecting AI applications to the tools and data they need. What hosts, clients and servers are, what a server offers, and four common mix-ups.
pubDate: '2026-10-26T11:00:28Z'
section: terms
topic: mcp
relatedVideos:
  - id: Explainer
    title: 'What is MCP? Model Context Protocol, explained simply'
    youtubeId: PNwPw8CVp8Q
    pubDate: '2026-10-26T11:00:28Z'
relatedShorts:
  - title: '3 AI apps, 4 tools: how many integrations?'
    youtubeId: hPk_SMLOIjY
codeUrl: https://github.com/mnafshin/termsplained-demos/tree/main/short-mcp-tools-list
draft: true
---

MCP, the Model Context Protocol, is an open standard for connecting AI applications to the tools and data they need. Despite the name, it is not a model and it does not make a model any smarter. It is a plug: one shared way for an AI app to reach a calendar, a file store or a company system. That is why the three letters now show up wherever AI assistants start doing things.

## The problem it solves

On its own, an AI assistant only knows its training data and what is in your chat. It cannot see your calendar, your files or your database.

For a long time, every app that wanted to reach a tool built its own custom connector. Three AI apps and four tools could mean twelve separate integrations, each built and maintained on its own. When Anthropic [open-sourced MCP](https://www.anthropic.com/news/model-context-protocol) in November 2024, it described exactly this: every new data source needed its own custom implementation. MCP replaces those one-off connectors with one shared protocol. Build the connection once, and any app that speaks MCP can use it.

## Hosts, clients and servers

The [official documentation](https://modelcontextprotocol.io/docs/getting-started/intro) compares MCP to a USB-C port for AI applications: it does not care what is on either end, it only defines how the two connect. There are three roles ([architecture overview](https://modelcontextprotocol.io/docs/learn/architecture)):

- The **host** is the AI application you use, such as Claude, ChatGPT or Visual Studio Code.
- Inside the host, an **MCP client** keeps one dedicated connection to one server.
- An **MCP server** is a program that offers something: your files, a database, a calendar or a company system.

The model is still the model. MCP is how its app reaches the outside world.

## What a server offers

The protocol defines three main things a server can offer. **Tools** are actions the AI can call, such as running a search or creating a ticket. **Resources** are information the app can read, such as a file or a database schema. **Prompts** are reusable templates for common tasks.

This is a whole MCP server with one tool, a calendar action. The description in the docstring is what the AI app will read:

```python
from mcp.server.mcpserver import MCPServer
mcp = MCPServer("calendar")

@mcp.tool()
def create_event(title: str, date: str) -> str:
    """Add an event to the calendar."""
    return f"created {title} on {date}"
```

[short-mcp-tools-list/server.py](https://github.com/mnafshin/termsplained-demos/blob/main/short-mcp-tools-list/server.py)

When the app connects, it asks the server what it has, and the server answers with a list that includes each tool's description and the inputs it needs, here a title and a date. The model reads those descriptions and decides when a tool would help. The app then makes the call and hands the result back to the model.

## MCP does not replace APIs

An API is the door into one specific service, and every service has its own door with its own rules. An MCP tool can be as simple as a call to an existing API; the API still does the work. What MCP adds is one common way to describe it, so any AI app that speaks MCP can discover and use it. The real choice is between a one-off integration and one that every compatible app can pick up.

## Not just an Anthropic thing

Anthropic created MCP and released it as open source in November 2024. In December 2025, it [donated MCP to the Agentic AI Foundation](https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/), a fund under the Linux Foundation co-founded with Block and OpenAI. At that point, the maintainers reported more than 97 million SDK downloads a month and 10,000 active servers. The documentation lists support in assistants such as Claude and ChatGPT and in developer tools such as Visual Studio Code and Cursor.

## MCP does not make a tool safe

The [specification](https://modelcontextprotocol.io/specification/2026-07-28) says tools represent arbitrary code execution and must be treated with caution. The host must get the user's explicit consent before invoking any tool and before exposing user data to a server. Descriptions of how a tool behaves should be treated as untrusted unless they come from a trusted server.

The specification also says plainly that MCP itself cannot enforce these principles; the apps that use it have to. A connected server is only as trustworthy as the people who built it and the permissions you give it.

## Recap

- MCP is an open standard plug between AI apps and outside tools and data, not a model.
- Hosts are the apps, servers offer tools, resources and prompts, and clients connect the two.
- It does not replace APIs; it gives them one common description any MCP app can discover.
- It is open and widely supported, not tied to one vendor.
- It does not make anything safe on its own: connect only servers you trust, and check what each one may do.
