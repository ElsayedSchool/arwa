import "axios";

declare module "axios" {
  // augment AxiosRequestConfig to support our custom flag used by our interceptors
  interface AxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }
}
