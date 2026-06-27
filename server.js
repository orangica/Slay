const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const port = Number(process.env.PORT || 8787);
const env = loadEnv(path.join(root, ".env"));
const apiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || env.GEMINI_MODEL || "gemini-2.5-flash";
const thinkingBudget = Number(process.env.GEMINI_THINKING_BUDGET || env.GEMINI_THINKING_BUDGET || 1024);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
};

function loadEnv(file) {
  if (!fs.existsSync(file)) return {};
  return fs
    .readFileSync(file, "utf8")
    .split(/\r?\n/)
    .reduce((values, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return values;
      const equals = trimmed.indexOf("=");
      if (equals === -1) return values;
      const key = trimmed.slice(0, equals).trim();
      const rawValue = trimmed.slice(equals + 1).trim();
      values[key] = rawValue.replace(/^['"]|['"]$/g, "");
      return values;
    }, {});
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100_000) {
        request.destroy();
        reject(new Error("Request too large"));
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function serveStatic(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const pathname = decodeURIComponent(requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname);
  const filePath = path.normalize(path.join(root, pathname));

  if (!filePath.startsWith(root) || path.basename(filePath) === ".env") {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(content);
  });
}

function buildPrompt(payload) {
  const history = (payload.messages || [])
    .filter((message) => message.text)
    .slice(-6)
    .map((message) => `${message.type === "user" ? "Player" : payload.demonName}: ${message.text}`)
    .join("\n");

  return `You are writing one in-character chat bubble for Slay, a cozy emotional RPG.\n\nDemon: ${payload.demonName}\nMode: ${payload.mode || "fight"}\nTags/personality: ${(payload.tags || []).join(", ") || "inner obstacle"}\nSelected attack context: ${payload.attackContext || "none yet"}\nPlayer message: ${payload.userText || "none"}\nRecent chat:\n${history || "none"}\n\nRules:\n- Return only the demon's next line, no labels or quotes.\n- 1 sentence, max 18 words.\n- Playful, emotionally specific, not therapy advice.\n- No gore, cruelty, self-harm encouragement, or real-world diagnosis.\n- Keep the demon's flavor distinct and tied to the selected attack context.\n- If mode is fight, sound like an inner demon attack the user can resist.\n- If mode is date, sound vulnerable/curious rather than hostile.`;
}

function extractGeminiText(data) {
  return (data.candidates || [])
    .flatMap((candidate) => candidate.content?.parts || [])
    .map((part) => part.text || "")
    .join(" ")
    .trim();
}

function sanitizeReply(text) {
  return text
    .replace(/^['"“”]+|['"“”]+$/g, "")
    .replace(/\s+/g, " ")
    .slice(0, 180)
    .trim();
}

async function callGemini(payload) {
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: buildPrompt(payload) }] }],
      generationConfig: {
        temperature: 0.95,
        maxOutputTokens: Math.max(1200, thinkingBudget + 160),
        thinkingConfig: { thinkingBudget },
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || `Gemini request failed: ${response.status}`);
  }

  const reply = sanitizeReply(extractGeminiText(data));
  if (!reply) throw new Error("Gemini returned an empty reply");
  return reply;
}

const server = http.createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/healthz") {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "POST" && request.url === "/api/demon-chat") {
    try {
      const payload = await readJson(request);
      const reply = await callGemini(payload);
      sendJson(response, 200, { reply, model, source: "gemini" });
    } catch (error) {
      sendJson(response, 500, { error: error.message });
    }
    return;
  }

  if (request.method === "GET") {
    serveStatic(request, response);
    return;
  }

  response.writeHead(405);
  response.end("Method not allowed");
});

server.listen(port, () => {
  console.log(`Slay running at http://localhost:${port}`);
  console.log(`Gemini model: ${model}, thinking budget: ${thinkingBudget}`);
});
