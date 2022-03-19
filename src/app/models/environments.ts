import { Network } from "./networks";

export interface IEnvironment {
  apiUrl: string;
  network: Network;
}

export const environments: IEnvironment[] = [
  {
    apiUrl: 'https://dev-auth-api.opdex.com/v1',
    network: Network.Devnet
  },
  {
    apiUrl: 'https://test-auth-api.opdex.com/v1',
    network: Network.Testnet
  },
  {
    apiUrl: 'https://auth-api.opdex.com/v1',
    network: Network.Mainnet
  }
]
