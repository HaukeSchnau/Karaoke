import clsx from "clsx";

interface SongIconProps {
  imgUrl?: string;
  isPlaying?: boolean;
}

const SongIcon: React.FC<SongIconProps> = ({ imgUrl, isPlaying }) => {
  return (
    <div className="relative aspect-square w-full ">
      <div className="bg-sleeve relative z-10 h-full w-full rounded-2xl bg-white"></div>
      <img
        className={clsx(
          "rotate-23 absolute top-1/2 right-[-70%] h-4/5 -translate-y-1/2 rotate-90",
          {
            "is-playing": isPlaying,
          }
        )}
        src="/img/record.png"
        alt="Placeholder sleeve"
      />
      <img
        src={imgUrl}
        className={clsx(
          "absolute inset-0 z-20 h-full w-full rounded-2xl object-cover opacity-0 transition-opacity",
          { "opacity-100": !!imgUrl }
        )}
        alt="Cover"
      />
    </div>
  );
};

export default SongIcon;
