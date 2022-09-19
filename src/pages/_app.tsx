import "@src/styles/globals.css";
import type { AppType } from "next/dist/shared/lib/utils";
import { trpc } from "@src/utils/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { configure } from "mobx";
import { useEffect, useState } from "react";

configure({
  enforceActions: "never",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  const [hasInteracted, setInteracted] = useState(false);

  const onClick = () => {
    setInteracted(true);
    document.removeEventListener("click", onClick);
  };

  useEffect(() => {
    document.addEventListener("click", onClick);
  }, []);

  return (
    <>
      <div className="bg grid h-screen overflow-hidden">
        <div className="m-20 overflow-hidden border-[12px] border-white">
          <Component {...pageProps} hasInteracted={hasInteracted} />
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
};

export default trpc.withTRPC(MyApp);
