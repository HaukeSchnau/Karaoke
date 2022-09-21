import type { Image } from "@src/types";

export const getSize = (image: Image) => {
  if (image.width && image.height) return image.width * image.height;
  if (image.width) return image.width;
  if (image.height) return image.height;
  return 0;
};

export const getImgUrl = (images: Image[]) => {
  return images.sort((a, b) => getSize(b) - getSize(a))[0]?.url;
};
