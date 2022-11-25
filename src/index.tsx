import { Detail } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { convertArticleToMd } from "./util/ArticleParser";

export default function Command() {
  const { data, isLoading } = useFetch("https://world.hey.com/~shuffle", {
    parseResponse: parseFetchResponse,
  });

  return <Detail navigationTitle="Hello world" isLoading={isLoading} markdown={data?.markdown} />;
}

async function parseFetchResponse(response: Response) {
  const html = await response.text();
  const markdown = convertArticleToMd(html);

  return markdown;
}
