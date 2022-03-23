import { Network } from "src/app/models/networks";

let apiOverride: string;

// apiOverride = 'https://v1-dev-api.opdex.com/v1';
// apiOverride = 'http://localhost:44391/v1';

export const environment = {
  production: false,
  network: Network.Devnet,
  apiOverride: apiOverride
};
