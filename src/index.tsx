import { useEffect, useState } from "react";
import { Action, ActionPanel, Detail, Icon } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { convertArticleToMd } from "./util/ArticleParser";

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
    <Detail
      isLoading={isLoading}
      markdown={data?.markdown}
      actions={
        <ActionPanel>
          <Action
            title="Get new article"
            shortcut={{
              modifiers: ["cmd"],
              key: "r",
            }}
            icon={{ source: Icon.RotateClockwise }}
            onAction={() => setShouldFetch(true)}
          />
        </ActionPanel>
      }
    />
  );
}

async function parseFetchResponse(response: Response) {
  const html = await response.text();
  const markdown = convertArticleToMd(html);

  return markdown;
}
