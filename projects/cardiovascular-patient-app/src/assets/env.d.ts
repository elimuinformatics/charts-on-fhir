declare global {
    interface Window {
      env: {
        clientId: string;
        appTitle: string;
        cdsicLogo: boolean;
      };
    }
  }
  export {};