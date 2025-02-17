// all routes
export enum ROUTE_PATHS {
  HOME = "/",
  LOGIN = "/login",
  SIGNUP = "/signup",
  PROFILE = "/profile",
}

// Routes required authentication
export const PROTECTED_ROUTES: string[] = [ROUTE_PATHS.PROFILE];
