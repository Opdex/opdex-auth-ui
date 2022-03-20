export interface StratisIdTimeRemaining {
  formatted: string;
  percent: number;
  isExpired: boolean;
}

export class StratisId {
  private _connectionId: string;
  private _stratisId: string;
  private _callbackUrl: URL;
  private _webSidUrl: URL;
  private _expirationTime: number;
  private _expirationLength: number;
  private _timeRemainingFormatted: string;
  private _timeRemainingPercent: number;
  private _isExpired: boolean;
  private _errors: string[] = [];

  public get connectionId(): string {
    return this._connectionId;
  }

  public get stratisId(): string {
    return this._stratisId;
  }

  public get callbackUrl(): string {
    return this._callbackUrl.href;
  }

  public get webSidUrl(): string {
    return this._webSidUrl.href;
  }

  public get timeRemaining(): StratisIdTimeRemaining {
    return {
      formatted: this._timeRemainingFormatted,
      percent: this._timeRemainingPercent,
      isExpired: this._isExpired
    }
  }

  public get errors(): string[] {
    return this._errors;
  }

  constructor(connectionId: string, stratisId: string) {
    if (!connectionId) {
      this._errors.push('Invalid connection.');
      return;
    }

    if (!stratisId || !stratisId.startsWith('sid:')) {
      this._errors.push('Invalid StratisId message.');
      return;
    }

    this._connectionId = connectionId;
    this._stratisId = stratisId;
    this._callbackUrl = new URL(this.stratisId.replace('sid:', 'https://'));
    // Todo: Can URL accept this?
    this._webSidUrl = new URL(this.stratisId.replace('sid:', 'web+sid://'));

    console.log(this._webSidUrl)

    const expiration = parseInt(this._callbackUrl.searchParams.get('exp'));
    this._expirationTime = new Date(expiration * 1000).getTime();
    this._expirationLength = (this._expirationTime - new Date().getTime()) / 1000;

    // Expiration
    this.refreshTimeRemaining();
  }

  public refreshTimeRemaining(): void {
    const timeRemaining = (this._expirationTime - new Date().getTime()) / 1000;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = Math.floor(timeRemaining % 60);

    this._timeRemainingFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    this._timeRemainingPercent = Math.floor((timeRemaining / this._expirationLength) * 100);
    this._isExpired = minutes <= 0 && seconds <= 0;
  }
}
