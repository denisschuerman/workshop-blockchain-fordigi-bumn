import React, { useState, useEffect } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import Markdown from "markdown-to-jsx";
import ReadMe from "../../README.md";

export const Route = createLazyFileRoute("/documentation")({
  component: Documentation,
});

function Documentation() {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch(ReadMe)
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        setMarkdown(text);
      });
    console.log(markdown);
  }, []);

  return <Markdown className="prose">{markdown}</Markdown>;
}
