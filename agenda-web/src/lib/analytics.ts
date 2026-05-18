"use client";

import { sendGAEvent } from "@next/third-parties/google";

type AnalyticsParams = Record<string, string | number | boolean | undefined | null>;

const cleanParams = (params: AnalyticsParams = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

export function trackEvent(eventName: string, params?: AnalyticsParams) {
  sendGAEvent("event", eventName, cleanParams(params));
}

export function trackSearch(searchTerm: string, params?: AnalyticsParams) {
  trackEvent("site_search", {
    search_term: searchTerm.trim(),
    ...params,
  });
}

export function trackFilter(filterType: string, filterValue: string | boolean) {
  trackEvent("filter_apply", {
    filter_type: filterType,
    filter_value: String(filterValue),
  });
}

export function trackContentClick(contentType: string, itemId: string, params?: AnalyticsParams) {
  trackEvent("select_content", {
    content_type: contentType,
    item_id: itemId,
    ...params,
  });
}

export function trackOutboundClick(destination: string, params?: AnalyticsParams) {
  trackEvent("outbound_click", {
    destination,
    ...params,
  });
}
