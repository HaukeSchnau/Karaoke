import { handler } from "@src/utils/handler";
import { promises as fs, createReadStream } from "fs";

export default handler().get(async (req, res) => {
  const fileName = req.query.songId as string;
  const variant = req.query.variant as string;
  const path = `./audio/separated/${fileName}/${variant}.wav`;
  const stat = await fs.stat(path);

  res.writeHead(200, {
    "Content-Type": "audio/wav",
    "Content-Length": stat.size,
  });

  const readStream = createReadStream(path);
  readStream.pipe(res);
});
