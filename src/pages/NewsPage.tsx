import React, { useEffect } from "react";
import NewsHero from "../components/news/NewsHero";
import NewsListSection from "../components/news/NewsListSection";
import useKillScrollTriggersOnUnmount from "../hooks/useKillScrollTriggersOnUnmount";

const NewsPage: React.FC = () => {
  useKillScrollTriggersOnUnmount();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="news-page">
      <NewsHero />
      <NewsListSection />
    </div>
  );
};

export default NewsPage;
