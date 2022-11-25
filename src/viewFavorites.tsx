import { Action, ActionPanel, List, useNavigation, Icon, showToast } from "@raycast/api";
import { useState } from "react";
import MarkdownArticle from "./components/MarkdownArticle";
import { useStore } from "./store/index";
import { Article } from "./types/Article";
import { parseFetchResponse } from "./util/ArticleParser";

export default function Command() {
  const [loading, setLoading] = useState(false);
  const [favoritedArticles, addToFavorites, removeFromFavorites, isFavorited] = useStore((state) => [
    state.favoritedArticles,

    state.addToFavorites,
    state.removeFromFavorites,
    state.isFavorited,
  ]);
  const { push } = useNavigation();

  async function fetchArticle(article: Article) {
    setLoading(true);
    const request = await fetch(article.url);
    const { markdown } = await parseFetchResponse(request);
    setLoading(false);

    push(<MarkdownArticle article={article} isLoading={false} markdown={markdown} />);
  }

  return (
    <List isLoading={loading}>
      {favoritedArticles.length > 0 ? (
        favoritedArticles.map((article) => {
          const isCurrentArticleFavorited = isFavorited(article);
          return (
            <List.Item
              title={article.title}
              key={article.url}
              actions={
                <ActionPanel>
                  <Action title="Open" onAction={() => fetchArticle(article)} />
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
        })
      ) : (
        <List.EmptyView icon={Icon.Star} title="You haven't added any articles to favorite yet" />
      )}
    </List>
  );
}
