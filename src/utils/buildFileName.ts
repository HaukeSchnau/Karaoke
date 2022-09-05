export const buildFileName = (artist: string, title: string) =>
  `${artist}_${title}`.replace(/ /g, "_").replace(/(\(|\)|\.|\:|\"|\/)/g, "");
