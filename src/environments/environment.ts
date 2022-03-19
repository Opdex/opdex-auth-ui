import { Network } from "src/app/models/networks";

// const api = 'http://localhost:44391/v1';
// const api = 'https://dev-auth-api.opdex.com/v1';
const api = 'https://v1-dev-api.opdex.com/v1';

export const environment = {
  production: false,
  apiOverride: api,
  networkOverride: Network.Devnet
};
