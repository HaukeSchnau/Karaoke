import "@src/styles/globals.css";
import type { AppType } from "next/dist/shared/lib/utils";
import { trpc } from "@src/utils/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { configure } from "mobx";

configure({
  enforceActions: "never",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <div className="bg grid h-screen overflow-hidden">
        <div className="m-20 overflow-hidden border-[12px] border-white">
          <Component {...pageProps} />
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
};

export default trpc.withTRPC(MyApp);
