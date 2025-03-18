// all routes
export enum ROUTE_PATHS {
  HOME = "/",
  LOGIN = "/login",
}

// Routes required authentication
export const PROTECTED_ROUTES: string[] = [ROUTE_PATHS.HOME];
