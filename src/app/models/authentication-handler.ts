export enum AuthenticationHandlerActions {
  show = 'show',
  redirect = 'redirect',
  post = 'post'
}

export interface IAuthenticationHandlerOptions {
  redirect?: string;
  callback?: string;
  state?: string;
  stamp: string;
}

export class AuthenticationHandler {
  private _action: AuthenticationHandlerActions;
  private _route: URL;
  private _accessCode: string;
  private _error: string;
  private _stamp: string;

  public get action(): AuthenticationHandlerActions {
    return this._action;
  }

  public get route(): URL {
    return this._route;
  }

  public set accessCode(value: string) {
    if (this._route) {
      this._route.searchParams.append('code', value);
    }

    this._accessCode = value;
  }

  public get accessCode(): string {
    return this._accessCode;
  }

  public get stamp(): string {
    return this._stamp;
  }

  public get error(): string {
    return this._error;
  }

  public get isRedirect(): boolean {
    return this._action === AuthenticationHandlerActions.redirect;
  }

  public get isCallback(): boolean {
    return this._action === AuthenticationHandlerActions.post;
  }

  public get callbackPayload(): any {
    return { accessCode: this._accessCode }
  }

  constructor(options?: IAuthenticationHandlerOptions) {
    let route: URL;

    // Currently prioritizes redirects over callbacks, perhaps an app wants to do both?
    // Should we allow both? If so, should we still append ?ACCESS_TOKEN=xxx to the redirect URL?
    try {
      if (options?.redirect) {
        this._action = AuthenticationHandlerActions.redirect;
        route = new URL(options.redirect);
      } else if (options?.callback) {
        this._action = AuthenticationHandlerActions.post;
        route = new URL(options.callback);
      } else {
        this._action = AuthenticationHandlerActions.show;
      }

      if (route && options?.state) {
        route.searchParams.append('state', options.state);
      }

      if (route) {
        this._route = route;
      }

      this._stamp = options.stamp;
    } catch {
      const urlType = this._action === AuthenticationHandlerActions.redirect ? 'redirect' : 'callback';
      this._error = `Invalid ${urlType} URL format.`;
    }
  }
}
