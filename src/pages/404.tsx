import type { NextPage } from "next";

const NotFound: NextPage = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <h1 className="m-auto text-5xl font-bold text-white">
        404 - Diese Seite wurde nicht gefunden
      </h1>
    </div>
  );
};

export default NotFound;
