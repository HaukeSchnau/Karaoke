// src/server/router/index.ts
import { t } from "../trpc";
import { z } from "zod";
import spotify from "@src/server/util/spotify";
import { getSyncedLyrics } from "@src/server/util/lyrics";
import { downloadSong } from "@src/server/util/youtube";
import { buildFileName } from "@src/utils/buildFileName";

export const appRouter = t.router({
  search: t.procedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      const { accessToken } = ctx.req.cookies;
      if (!accessToken) throw new Error("No accessToken found in cookies");
      return spotify.search(input.query, accessToken);
    }),
  spotifySongData: t.procedure
    .input(
      z.object({
        spotifyId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      const { accessToken } = ctx.req.cookies;
      if (!accessToken) throw new Error("No accessToken found in cookies");
      return spotify.getSongById(input.spotifyId, accessToken);
    }),
  playlist: t.procedure.query(({ ctx }) => {
    const { accessToken } = ctx.req.cookies;
    if (!accessToken) throw new Error("No accessToken found in cookies");
    return spotify.getPlaylist(accessToken);
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
  removeTrack: t.procedure
    .input(
      z.object({
        uri: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { uri } = input;
      const { accessToken } = ctx.req.cookies;
      if (!accessToken) throw new Error("No accessToken found in cookies");
      await spotify.removeTrack(uri, accessToken);
    }),
  authorizeUrl: t.procedure.query(({ ctx }) => {
    const { accessToken } = ctx.req.cookies;

    if (accessToken) return null;

    return spotify.getAuthorizeUrl();
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
