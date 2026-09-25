"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(
  () => import("@/components/map-view").then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">
            Inicializando MapTap..
          </p>
        </div>
      </div>
    ),
  },
);

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <MapView />
    </main>
  );
}
