import { Elysia, t } from "elysia";
import { logger } from "@grotto/logysia";
import swaggerDocs from "./swagger";
import { dayController } from "./controllers/day.controller";
import { ApiResponse } from "./base.response";
import { scheduleController } from "./controllers/schedule.controller";

export const app = new Elysia();

app
  .state("version", "2023.11.7")
  .use(logger())
  .use(swaggerDocs)
  .onError(({ code, error, set }) => {
    let errorResponse;
    switch (code) {
      case "NOT_FOUND":
        set.status = 404;
        errorResponse = ApiResponse.error(error.message, set.status);
        break;
      case "VALIDATION":
        set.status = 400;
        const message = error.message.split("\n")[0];
        errorResponse = ApiResponse.error(message, set.status);
        break;
      default:
        set.status = 500;
        errorResponse = ApiResponse.error(error.message, set.status);
        break;
    }
    return errorResponse;
  })
  .get("/", ({ store: { version } }) => `Hello Schedule App V.${version}`, {
    detail: {
      description: "description",
      operationId: "operationId",
      tags: ["App"],
      responses: {
        200: {
          description: "Success",
          content: {
            "text/html": {
              schema: t.String({ example: "Hello Schedule App V.2023.11.7" }),
            },
          },
        },
      },
    },
  })
  .use(dayController)
  .use(scheduleController)
  .listen(3000, () => {
    console.log(
      `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
    );
  });
