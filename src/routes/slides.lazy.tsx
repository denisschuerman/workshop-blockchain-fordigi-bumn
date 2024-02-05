import React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/slides")({
  component: Slides,
});

function Slides() {
  return (
    <div className="flex items-center justify-center">
      <iframe
        className="h-[80vh] w-[60vw]"
        loading="lazy"
        src="https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAF70LFc2ao&#x2F;5zJKm6TiaBCzIVOlgArgwQ&#x2F;view?embed"
        allowFullScreen={true}
        allow="fullscreen"
      ></iframe>
    </div>
  );
}
