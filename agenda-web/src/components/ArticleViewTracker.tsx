"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface ArticleViewTrackerProps {
  slug: string;
  title: string;
}

export default function ArticleViewTracker({ slug, title }: ArticleViewTrackerProps) {
  useEffect(() => {
    trackEvent("article_view", {
      content_type: "article",
      item_id: slug,
      title,
    });
  }, [slug, title]);

  return null;
}
