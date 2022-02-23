import { useRef } from "react";

export const useDebounce = (
  callback: (e: React.ChangeEvent<HTMLInputElement>) => void,
  timeout?: number
) => {
  const timeoutHandle = useRef(0);
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timeoutHandle.current) clearTimeout(timeoutHandle.current);

    const handle = setTimeout(async () => {
      callback(e);
    }, timeout ?? 1000);
    timeoutHandle.current = handle;
  };
};
