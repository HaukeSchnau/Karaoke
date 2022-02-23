import React from "react";
import "./SongIcon.css";
import classNames from "classnames";

interface SongIconProps {
  imgUrl?: string;
  isPlaying?: boolean;
}

const SongIcon: React.FC<SongIconProps> = ({ imgUrl, isPlaying }) => {
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
};

export default SongIcon;
