declare global {
    interface Window {
      env: {
        clientId: string;
        appTitle: string;
      };
    }
  }
  export {};