import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";

const swaggerDocs = (app: Elysia) =>
  app.use(
    swagger({
      documentation: {
        info: {
          title: "Schedule API Documentation",
          version: "2023.11.7",
        },
        tags: [
          { name: "App", description: "App Endpoints" },
          { name: "Day", description: "Day Endpoints" },
          {
            name: "Schedule",
            description: "Schedule Endpoints",
          },
        ],
      },
    })
  );

export default swaggerDocs;
