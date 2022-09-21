import React, { CSSProperties } from "react";

interface LoadingProps {
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({ color }) => {
  return (
    <div
      className="lds-roller"
      style={{ "--color": color ?? "#000000aa" } as CSSProperties}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loading;
