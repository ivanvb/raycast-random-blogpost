import create from "zustand";
import fs from "fs";
import { environment } from "@raycast/api";
import { Article } from "../types/Article";

export interface StoreState {
  favoritedArticles: Array<Article>;
  addToFavorites: (article: Article) => void;
  removeFromFavorites: (article: Article) => void;
  isFavorited: (article: Article) => boolean;
}

const dataPath = `${environment.supportPath}/favorites.json`;

export const useStore = create<StoreState>((set, get) => ({
  favoritedArticles: (() => {
    if (!fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath, "[]", "utf-8");

      return [];
    } else {
      const favorites: Array<Article> = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

      return favorites;
    }
  })(),
  addToFavorites: (article: Article) => {
    set((state) => {
      const updatedFavoritedArticles = [...state.favoritedArticles, article];
      fs.writeFileSync(dataPath, JSON.stringify(updatedFavoritedArticles), "utf-8");
      return { favoritedArticles: updatedFavoritedArticles };
    });
  },
  removeFromFavorites: (article: Article) => {
    set((state) => {
      const updatedFavoritedArticles = state.favoritedArticles.filter(
        (favoritedArt) => favoritedArt.url !== article.url
      );
      fs.writeFileSync(dataPath, JSON.stringify(updatedFavoritedArticles), "utf-8");

      return {
        favoritedArticles: updatedFavoritedArticles,
      };
    });
  },
  isFavorited: (article: Article): boolean => {
    return !!get().favoritedArticles.find((favoritedArticle) => favoritedArticle.url === article.url);
  },
}));
