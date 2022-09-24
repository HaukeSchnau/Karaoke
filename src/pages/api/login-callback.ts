import spotify from "src/server/util/spotify";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const code = req.query.code;

  const { body } = await spotify.getCredentials(code as string);
  const { access_token: accessToken, refresh_token: refreshToken } = body;

  res.setHeader(
    "Set-Cookie",
    `accessToken=${accessToken}; path=/; expires=${new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 365
    ).toUTCString()}; HttpOnly; SameSite=Lax; Secure`
  );

  res.redirect("/playlist");
};
