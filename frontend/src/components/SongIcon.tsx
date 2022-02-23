import React from "react";
import "./SongIcon.css";
import classNames from "classnames";

type IconProps = {
  imgUrl?: string;
  isPlaying?: boolean;
};

export default function SongIcon({ imgUrl, isPlaying }: IconProps) {
  return (
    <div className="song-icon">
      <div className="song-sleeve"></div>
      <img
        className={classNames("record", { "is-playing": isPlaying })}
        src="/img/record.png"
      />
      <img
        src={imgUrl}
        className={classNames("cover", { visible: !!imgUrl })}
      />
    </div>
  );
}
