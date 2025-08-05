export type Route<TParams> = {
  path: string;
  getHref: TParams extends never ? () => string : (params: TParams) => string;
};

type RouteParamsMap = {
  HOME: void;
  TRIVIA_SCRIPT: void;
  LOGIN: void;
  DASHBOARD: void;
  DASHBOARD_PROFILE: void;
  WORLD_PRAGMA: void;
  WORLD_PRAGMA_ACCOUNT: { id: string };
  PROFILE: void;
};

export const ROUTE_PATHS: { [K in keyof RouteParamsMap]: Route<RouteParamsMap[K]> } = {
  HOME: { path: "/", getHref: () => "/" },
  LOGIN: { path: "/login", getHref: () => "/login" },
  DASHBOARD: { path: "/dashboard", getHref: () => "/dashboard" },
  DASHBOARD_PROFILE: { path: "/dashboard/profile", getHref: () => "/dashboard/profile" },
  WORLD_PRAGMA: { path: "/mundo-pragma", getHref: () => "/mundo-pragma" },
  WORLD_PRAGMA_ACCOUNT: { path: "/mundo-pragma/cuenta/:id", getHref: ({ id }) => `/mundo-pragma/cuenta/${id}` },
  TRIVIA_SCRIPT: { path: "/mundo-pragma/triviascript", getHref: () => `/mundo-pragma/triviascript` },
  PROFILE: { path: "/profile", getHref: () => "/profile" },
} as const;

// Routes required authentication
export const PROTECTED_ROUTES: string[] = [
  ROUTE_PATHS.HOME.getHref(),
  ROUTE_PATHS.WORLD_PRAGMA.getHref(),
  ROUTE_PATHS.PROFILE.getHref(),
];
