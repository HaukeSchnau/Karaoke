import { handler } from "@src/utils/handler";
import { promises as fs, createReadStream } from "fs";

export default handler().get(async (req, res) => {
  const fileName = req.query.songId as string;
  const variant = req.query.variant as string;
  const path = `./audio/separated/${fileName}/${variant}.wav`;
  const stat = await fs.stat(path);

  const range = req.headers.range ?? "bytes=0-";
  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0] ?? "0", 10);
  const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
  const chunksize = end - start + 1;

  const file = createReadStream(path, { start, end });
  const head = {
    "Content-Range": `bytes ${start}-${end}/${stat.size}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunksize,
    "Content-Type": "audio/wav",
  };

  res.writeHead(206, head);
  file.pipe(res);
});
