import { Action, ActionPanel, Detail, Icon, showToast } from "@raycast/api";
import { useStore } from "../store/index";
import { Article } from "../types/Article";

interface Props {
  isLoading: boolean;
  markdown: string;
  article: Article;
  handleRefresh?: () => void;
}

export default function MarkdownArticle({ isLoading, markdown, article, handleRefresh }: Props) {
  const [isFavorited, addToFavorites, removeFromFavorites] = useStore((state) => [
    state.isFavorited,
    state.addToFavorites,
    state.removeFromFavorites,
  ]);

  const isCurrentArticleFavorited = isFavorited(article);

  return (
    <Detail
      isLoading={isLoading}
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser url={article.url} />
          {handleRefresh && (
            <Action
              title="Get new article"
              shortcut={{
                modifiers: ["cmd"],
                key: "r",
              }}
              icon={{ source: Icon.RotateClockwise }}
              onAction={handleRefresh}
            />
          )}
          {!isCurrentArticleFavorited && (
            <Action
              title="Add to favorites"
              shortcut={{
                modifiers: ["cmd"],
                key: "b",
              }}
              icon={{ source: Icon.Star }}
              onAction={() => {
                addToFavorites(article);
                showToast({
                  title: "Article added to favorites",
                });
              }}
            />
          )}
          {isCurrentArticleFavorited && (
            <Action
              title="Remove from favorites"
              shortcut={{
                modifiers: ["cmd"],
                key: "b",
              }}
              icon={{ source: Icon.StarDisabled }}
              onAction={() => {
                removeFromFavorites(article);
                showToast({
                  title: "Article removed from favorites",
                });
              }}
            />
          )}
        </ActionPanel>
      }
    />
  );
}
