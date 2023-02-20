declare global {
  interface Window { env: any; }
}
export const environment = {
  production: true,
  clientState: undefined,
  appTitle: window.env.appTitle
};
