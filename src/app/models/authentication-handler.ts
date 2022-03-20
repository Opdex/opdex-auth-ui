export enum AuthenticationHandlerActions {
  show = 'show',
  redirect = 'redirect',
  post = 'post'
}

export interface IAuthenticationHandlerOptions {
  redirect?: string;
  callback?: string;
}

export class AuthenticationHandler {
  private _action: AuthenticationHandlerActions;
  private _route: URL;
  private _accessToken: string;
  private _error: string;

  public get action(): AuthenticationHandlerActions {
    return this._action;
  }

  public get route(): URL {
    return this._route;
  }

  public set accessToken(value: string) {
    if (this._route) {
      this._route.searchParams.append('ACCESS_TOKEN', value);
    }

    this._accessToken = value;
  }

  public get accessToken(): string {
    return this._accessToken;
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
    return { accessToken: this._accessToken }
  }

  constructor(options?: IAuthenticationHandlerOptions) {
    // Currently prioritizes redirects over callbacks, perhaps an app wants to do both?
    // Should we allow both? If so, should we still append ?ACCESS_TOKEN=xxx to the redirect URL?
    try {
      if (options?.redirect) {
        this._action = AuthenticationHandlerActions.redirect;
        this._route = new URL(options.redirect);
      } else if (options?.callback) {
        this._action = AuthenticationHandlerActions.post;
        this._route = new URL(options.callback);
      } else {
        this._action = AuthenticationHandlerActions.show;
      }
    } catch {
      const urlType = this._action === AuthenticationHandlerActions.redirect ? 'redirect' : 'callback';
      this._error = `Invalid ${urlType} URL format.`;
    }
  }
}
