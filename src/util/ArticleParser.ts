import { load } from "cheerio";
import { NodeHtmlMarkdown } from "node-html-markdown";

function transformHtml(html: string) {
  const $ = load(html);
  const url = $("[property='og:url']").attr("content") as string;
  const author = $("header p").text();
  const title = $("h2");
  $("a[download]").each((_, element) => {
    $(element).after($(element).html() as string);
    $(element).remove();
  });
  title.after(`<p>by ${author}</p>`);

  $("form").remove();
  $("header").remove();
  $("footer").remove();

  const article = $("main").html();

  return {
    markdown: NodeHtmlMarkdown.translate(article as string),
    url,
  };
}

export function convertArticleToMd(html: string) {
  return transformHtml(html);
}
