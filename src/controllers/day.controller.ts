import { Elysia, t } from "elysia";
import DayRepositoryImpl from "../repository/day.repository";
import { DaySchedule } from "../model/day.model";
import ScheduleRepositoryImpl from "../repository/schedule.repository";

const DayDto = t.Object({
  day: t.String(),
  position: t.Number({ minimum: 1, maximum: 7 }),
});

export const dayController = (elysia: Elysia) => {
  return elysia
    .state("dayRepository", new DayRepositoryImpl())
    .state("scheduleRepository", new ScheduleRepositoryImpl())
    .group("/days", (app) =>
      app
        .post(
          "/",
          async ({ store: { dayRepository }, body }) => {
            const { day, position } = body;
            const daySchedule = new DaySchedule();
            daySchedule.day = day;
            daySchedule.position = position;
            return await dayRepository.postDay(daySchedule);
          },
          {
            body: DayDto,
            detail: {
              summary: "Create a new day",
              tags: ["Day"],
              // ! Got unknown error here, but it works
              // responses: {
              //   200: {
              //     description: "Success",
              //     content: {
              //       "application/json": {
              //         schema: t.Object({
              //           code: t.Number({ example: 200 }),
              //           message: t.String({
              //             example: "Day created successfully",
              //           }),
              //           data: t.Object({
              //             id: t.String({ example: "123456" }),
              //             createdAt: t.String({
              //               example: "2022-01-01T00:00:00.000Z",
              //             }),
              //             day: t.String({ example: "Monday" }),
              //             position: t.Number({ example: 1 }),
              //           }),
              //         }),
              //       },
              //     },
              //   },
              // },
            },
          }
        )
        .get(
          "/",
          async ({ store: { dayRepository }, query }) => {
            console.log(query);
            const { page, limit } = query;

            let newPage = page ?? 1;
            let pageSize = limit ?? 10;
            newPage = newPage < 1 ? 1 : newPage;
            pageSize = pageSize < 10 ? 10 : pageSize;
            console.log(newPage, pageSize);

            return await dayRepository.getDays(newPage, pageSize);
          },
          {
            query: t.Object({
              page: t.Optional(
                t.Number({
                  minimum: 1,
                  default: 1,
                })
              ),
              limit: t.Optional(
                t.Number({
                  default: 10,
                  minimum: 10,
                })
              ),
            }),
            transform({ query }) {
              const newPage = +(query.page || 1);
              const newLimit = +(query.limit ?? 10);

              if (!Number.isNaN(newPage)) query.page = newPage;
              if (!Number.isNaN(newLimit)) query.limit = newLimit;
            },
            detail: { tags: ["Day"], summary: "Get all days" },
          }
        )
        .get(
          "/:id",
          async ({ store: { dayRepository }, params: { id } }) =>
            await dayRepository.getDay(id),
          {
            params: t.Object({
              id: t.String({}),
            }),
            detail: { tags: ["Day"], summary: "Get a day by id" },
          }
        )
        .put(
          "/:id",
          async ({
            store: { dayRepository },
            params: { id },
            body: { day, position },
          }) => {
            const daySchedule = new DaySchedule();
            daySchedule.day = day;
            daySchedule.position = position;
            return await dayRepository.updateDay(id, daySchedule);
          },
          {
            params: t.Object({ id: t.String() }),
            body: DayDto,
            detail: { tags: ["Day"], summary: "Update a day by id" },
          }
        )
        .delete(
          "/:id",
          async ({ store: { dayRepository }, params }) => {
            const { id } = params;
            return await dayRepository.deleteDay(id);
          },
          {
            params: t.Object({ id: t.String() }),
            detail: { tags: ["Day"], summary: "Delete a day by id" },
          }
        )
        .get(
          "/:id/schedules",
          async ({
            store: { scheduleRepository },
            query: { page, limit },
            params: { id },
          }) => {
            let newPage = page ?? 1;
            let pageSize = limit ?? 10;
            newPage = newPage < 1 ? 1 : newPage;
            pageSize = pageSize < 10 ? 10 : pageSize;
            return await scheduleRepository.getSchedules(id, newPage, pageSize);
          },
          {
            params: t.Object({
              id: t.String({}),
            }),
            query: t.Object({
              page: t.Optional(
                t.Number({
                  minimum: 1,
                  default: 1,
                })
              ),
              limit: t.Optional(
                t.Number({
                  default: 10,
                  minimum: 10,
                })
              ),
            }),
            transform({ query }) {
              const newPage = +(query.page || 1);
              const newLimit = +(query.limit ?? 10);

              if (!Number.isNaN(newPage)) query.page = newPage;
              if (!Number.isNaN(newLimit)) query.limit = newLimit;
            },
            detail: {
              tags: ["Day"],
              description: "This endpoint is used to Get schedules of a day",
              summary: "Get schedules of a day",
            },
          }
        )
    );
};
