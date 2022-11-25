import { load } from "cheerio";
import { NodeHtmlMarkdown } from "node-html-markdown";

function formatHtml(html: string) {
  const $ = load(html);
  const url = $("[property='og:url']").attr("content") as string;
  const author = $("header p").text();
  const titleElement = $("h2");

  // removes wrapper download link from images
  $("a[download]").each((_, element) => {
    $(element).after($(element).html() as string);
    $(element).remove();
  });

  titleElement.after(`<p>by ${author}</p>`);

  $("form").remove();
  $("header").remove();
  $("footer").remove();

  const article = $("main").html();

  return {
    markdown: NodeHtmlMarkdown.translate(article as string),
    url,
    title: titleElement.text().trim().replace(/\n/g, "") as string,
  };
}

export function convertArticleToMd(html: string) {
  return formatHtml(html);
}
