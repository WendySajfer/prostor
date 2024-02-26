import * as React from "react";
import { type UrlObject } from "url";

export type RouteTrackingState = {
  history: UrlObject[];
  getPreviousRoute: () => UrlObject | undefined;
}

export const RouteTrackingContext = React.createContext<RouteTrackingState>(
  {} as RouteTrackingState,
)

export function useRouteTracking() {
  return React.useContext(RouteTrackingContext);
}
