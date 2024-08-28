import http from "node:http";
import { randomUUID } from "node:crypto";
import { json } from "./middlewares/json.js";
import { Databaase } from "./database.js";

const database = new Databaase();

const server = http.createServer(async (request, response) => {
  const { method, url } = request;

  await json(request, response);

  if (method === "GET" && url === "/users") {
    const users = await database.select("users");
    return response
      .setHeader("Content-Type", "application/json")
      .end(JSON.stringify(users));
  }
  if (method === "POST" && url === "/users") {
    const { name, email } = request.body;
    const user = {
      id: randomUUID(),
      name: name,
      email: email,
    };
    database.insert("users", user);
    return response.writeHead(201).end();
  }
  return response.writeHead(404).end("Page not found");
});
server.listen(3333);
