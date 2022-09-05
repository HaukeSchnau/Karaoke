import type { NextPage } from "next";
import { useState } from "react";
import { useDebounce } from "@src/hooks/useDebounce";
import { trpc } from "@src/utils/trpc";
import Suggestion from "@src/components/Suggestion";
import clsx from "clsx";

const Home: NextPage = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: results } = trpc.proxy.search.useQuery(
    { query },
    {
      onSettled(data, error) {
        setIsLoading(false);
      },
    }
  );

  const debounce = useDebounce(async (e) => {
    setQuery(e.target.value);
  });

  return (
    <div className="mx-auto my-8 flex h-full max-w-4xl flex-col">
      <h1 className="mb-8 text-7xl font-bold text-white">
        Welchen Song möchtest du singen?
      </h1>
      <div className="relative mb-14 flex w-full flex-grow flex-col">
        <input
          className="z-10 rounded-[2rem] py-[1em] px-[2em] text-2xl shadow-lg"
          placeholder="Suche einen Song, Künstler oder Album..."
          onChange={(e) => {
            setIsLoading(true);
            debounce(e);
          }}
          autoFocus
        />{" "}
        {(results?.length || isLoading) && (
          <ul
            className={clsx(
              "no-scrollbar absolute inset-0 bottom-auto grid max-h-full place-items-center gap-8 overflow-auto rounded-[2rem] bg-white px-8 py-4 pt-28",
              {
                "grid-cols-1": isLoading,
                "grid-cols-8rem": !isLoading,
              }
            )}
          >
            {isLoading && (
              <div className="lds-roller mb-4">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}

            {!isLoading &&
              results?.map((item) => <Suggestion song={item} key={item.id} />)}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
