import Elysia, { t } from "elysia";
import ScheduleRepositoryImpl from "../repository/schedule.repository";
import { Schedule, ScheduleTime } from "../model/schedule.model";

const ScheduleDto = t.Object({
  dayId: t.String(),
  title: t.String(),
  description: t.Optional(t.String()),
  time: t.Object({
    hour: t.Number({ minimum: 0, maximum: 23 }),
    minute: t.Number({ minimum: 0, maximum: 59 }),
    second: t.Optional(t.Number({ minimum: 0, maximum: 59 })),
  }),
});

export const scheduleController = (elysia: Elysia) =>
  elysia
    .state("scheduleRepository", new ScheduleRepositoryImpl())
    .group("/schedules", (app) => {
      return app
        .post(
          "/",
          async ({ store: { scheduleRepository }, body }) => {
            const { dayId, title, description, time } = body;
            const schedule = new Schedule(
              undefined,
              dayId,
              title,
              description,
              new ScheduleTime(time.hour, time.minute, time.second)
            );
            return await scheduleRepository.postSchedule(schedule);
          },
          {
            body: ScheduleDto,
            detail: { tags: ["Schedule"], summary: "Create a new schedule" },
          }
        )
        .get(
          "/days/:id",
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
              tags: ["Schedule"],
              description: "This endpoint is used to Get schedules of a day",
              summary: "Get schedules of a day",
            },
          }
        )
        .get(
          "/:id",
          async ({ store: { scheduleRepository }, params: { id } }) => {
            return await scheduleRepository.getSchedule(id);
          },
          {
            params: t.Object({
              id: t.String({}),
            }),
            detail: {
              tags: ["Schedule"],
              summary: "Get a schedule",
            },
          }
        )
        .put(
          "/:id",
          async ({ store: { scheduleRepository }, params: { id }, body }) => {
            const { dayId, title, description, time } = body;
            const schedule = new Schedule(
              id,
              dayId,
              title,
              description ?? null,
              new ScheduleTime(time.hour, time.minute, time.second)
            );
            return await scheduleRepository.updateSchedule(id, schedule);
          },
          {
            params: t.Object({
              id: t.String({}),
            }),
            body: ScheduleDto,
            detail: {
              tags: ["Schedule"],
              summary: "Update a schedule",
            },
          }
        )
        .delete(
          "/:id",
          async ({ store: { scheduleRepository }, params: { id } }) => {
            return await scheduleRepository.deleteSchedule(id);
          },
          {
            params: t.Object({
              id: t.String({}),
            }),
            detail: {
              tags: ["Schedule"],
              summary: "Delete a schedule",
            },
          }
        );
    });
