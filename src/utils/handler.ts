import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";

export const handler = () =>
  nc<NextApiRequest, NextApiResponse>({
    onError: (err, req, res) => {
      res.status(500).send(err);
    },
  });
