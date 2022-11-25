import { useEffect, useState } from "react";
import { useFetch } from "@raycast/utils";
import { parseFetchResponse } from "./util/ArticleParser";
import MarkdownArticle from "./components/MarkdownArticle";

export default function Command() {
  const [shouldFetch, setShouldFetch] = useState(true);
  const { data, isLoading } = useFetch("https://world.hey.com/~shuffle", {
    parseResponse: parseFetchResponse,
    execute: shouldFetch,
  });

  useEffect(() => {
    setShouldFetch(false);
  }, [data]);

  return (
    <MarkdownArticle
      isLoading={isLoading}
      article={{ title: data?.title as string, url: data?.url as string }}
      markdown={data?.markdown as string}
      handleRefresh={() => setShouldFetch(true)}
    />
  );
}
