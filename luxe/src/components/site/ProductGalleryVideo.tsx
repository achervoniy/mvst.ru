import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  poster?: string;
  mode: "card" | "lightbox";
  className?: string;
  videoClassName?: string;
};

export function ProductGalleryVideo({ src, poster, mode, className, videoClassName }: Props) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setReady(false);
    setError(false);
  }, [src]);

  const onReady = useCallback(() => {
    setReady(true);
  }, []);

  const isCard = mode === "card";

  if (isCard) {
    return (
      <div
        className={cn(
          "absolute inset-0 size-full overflow-hidden bg-background isolate",
          className,
        )}
      >
        {poster ? (
          <img
            src={poster}
            alt=""
            decoding="async"
            className={cn(
              "absolute inset-0 z-0 size-full object-contain mix-blend-multiply transition-opacity duration-500",
              ready && !error ? "opacity-0" : "opacity-100",
            )}
            aria-hidden
          />
        ) : null}
        {!(ready || error) && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <div className="flex items-center justify-center rounded-full bg-background/35 px-2.5 py-2 backdrop-blur-[1px]">
              <Loader2
                className="size-7 shrink-0 text-foreground/35 motion-safe:animate-spin"
                strokeWidth={1.5}
                aria-hidden
              />
            </div>
          </div>
        )}
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={onReady}
          onCanPlay={onReady}
          onError={() => {
            setError(true);
            setReady(true);
          }}
          className={cn(
            "absolute inset-0 z-10 size-full object-contain transition-opacity duration-500 select-none",
            ready ? "opacity-100" : "opacity-0",
            videoClassName,
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex min-h-[30vh] items-center justify-center bg-background isolate",
        !poster && "min-h-[50vh]",
        className,
      )}
    >
      {poster ? (
        <img
          src={poster}
          alt=""
          decoding="async"
          className={cn(
            "relative z-0 max-h-[92vh] max-w-[92vw] object-contain mix-blend-multiply transition-opacity duration-500",
            ready && !error ? "opacity-0" : "opacity-100",
          )}
          aria-hidden
        />
      ) : null}
      {!(ready || error) && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="flex items-center justify-center rounded-full bg-background/35 px-2.5 py-2 backdrop-blur-[1px]">
            <Loader2
              className="size-7 shrink-0 text-foreground/35 motion-safe:animate-spin"
              strokeWidth={1.5}
              aria-hidden
            />
          </div>
        </div>
      )}
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={onReady}
        onCanPlay={onReady}
        onError={() => {
          setError(true);
          setReady(true);
        }}
        className={cn(
          "absolute left-1/2 top-1/2 z-10 max-h-[92vh] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 object-contain transition-opacity duration-500 select-none",
          ready ? "opacity-100" : "opacity-0",
          videoClassName,
        )}
      />
    </div>
  );
}
