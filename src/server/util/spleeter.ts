import p from "path";
import { execa } from "execa";
import fsExtra from "fs-extra";

export async function separate(fileName: string) {
  const dir = "./audio/separated";
  if (await fsExtra.pathExists(p.join(dir, fileName))) {
    return "";
  }

  const { stdout } = await execa("./separate.sh", [
    p.join("./audio/full", fileName),
  ]);
  return stdout;
}
