import { toFetchResponse, toReqRes } from "./fetch-to-node-broken/http-server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

export default {
  async fetch(request) {
    const { req, res } = toReqRes(request);

    const server = new McpServer(
      {
        name: "stateless-streamable-http-server",
        version: "1.0.0",
      },
      { capabilities: { logging: {} } }
    );

    const transport: StreamableHTTPServerTransport =
      new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });

    await server.connect(transport);

    await transport.handleRequest(req, res, await request.json());

    res.on("close", () => {
      console.log("Request closed");
      transport.close();
      server.close();
    });

    return toFetchResponse(res);
  },
} satisfies ExportedHandler<Env>;
