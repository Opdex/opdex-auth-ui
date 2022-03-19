import { Injectable } from "@angular/core";
import { IEnvironment, environments } from "src/app/models/environments";
import { Network } from "src/app/models/networks";
import { environment } from "src/environments/environment";


@Injectable({providedIn: 'root'})
export class EnvironmentsService {
  private _env: IEnvironment;

  public get apiUrl(): string {
    return this._env.apiUrl;
  }

  public get network(): Network {
    return this._env.network;
  }

  constructor() {
    const isDevnet = window.location.href.includes('dev-auth');
    const isTestnet = window.location.href.includes('test-auth');

    let env: IEnvironment;

    if (!environment.production) {
      env = this._find(environment.networkOverride);
      env.apiUrl = environment.apiOverride;
    }
    else if (isDevnet) env = this._find(Network.Devnet);
    else if (isTestnet) env = this._find(Network.Testnet);
    else env = this._find(Network.Mainnet);

    this._env = {...env};
  }

  private _find(network: Network) {
    return {...environments.find(e => e.network === network)};
  }
}
