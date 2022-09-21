// src/server/router/index.ts
import { t } from "../trpc";
import { z } from "zod";
import spotify from "@src/server/util/spotify";
import { getSyncedLyrics } from "@src/server/util/lyrics";
import { downloadSong } from "@src/server/util/youtube";
import { separate } from "@src/server/util/spleeter";
import { buildFileName } from "@src/utils/buildFileName";

export const appRouter = t.router({
  search: t.procedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(({ input }) => {
      return spotify.search(input.query);
    }),
  spotifySongData: t.procedure
    .input(
      z.object({
        spotifyId: z.string(),
      })
    )
    .query(({ input }) => {
      return spotify.getSongById(input.spotifyId);
    }),
  lyrics: t.procedure
    .input(
      z
        .object({
          artist: z.string(),
          album: z.string(),
          title: z.string(),
          id: z.string(),
        })
        .optional()
    )
    .query(({ input }) => {
      if (!input) return null;

      return getSyncedLyrics(input);
    }),
  prepare: t.procedure
    .input(
      z.object({
        artist: z.string(),
        title: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { artist, title } = input;
      const fileName = buildFileName(artist, title);
      await downloadSong(artist, title, fileName);
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
