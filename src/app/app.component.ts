import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Subscription, timer } from 'rxjs';
import { AuthenticationHandler } from './models/authentication-handler';
import { Icons } from './models/icons';
import { StratisId } from './models/stratis-id';
import { AuthApiService } from './services/api/auth-api.service';
import { EnvironmentsService } from './services/utility/environments.service';

@Component({
  selector: 'opdex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  hubConnection: HubConnection;
  stratisId: StratisId;
  authenticationHandler: AuthenticationHandler;
  reconnecting: boolean;
  icons = Icons;
  subscription = new Subscription();

  constructor(
    public sanitizer: DomSanitizer,
    private _activatedRoute: ActivatedRoute,
    private _environmentService: EnvironmentsService,
    private _authApiService: AuthApiService
  ) {
    const redirect = this._activatedRoute.snapshot.queryParamMap.get('REDIRECT');
    const callback = this._activatedRoute.snapshot.queryParamMap.get('CALLBACK');
    this.authenticationHandler = new AuthenticationHandler({redirect, callback});
  }

  async ngOnInit(): Promise<void> {
    await this.connectToSignalR();

    this.subscription.add(
      timer(0, 1000)
      .subscribe(async _ => {
        if (!this.stratisId) return;

        if (this.stratisId.timeRemaining.isExpired) await this._getStratisId();
        else this.stratisId.refreshTimeRemaining();
      }));
  }

  private async connectToSignalR(): Promise<void> {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this._environmentService.apiUrl}/socket`)
      .configureLogging(LogLevel.Error)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.onclose(_ => console.log('closing connection'));
    this.hubConnection.onreconnecting(_ => this.reconnecting = true);
    this.hubConnection.onreconnected(async (connectionId: string) => await this._onReconnected(connectionId));
    this.hubConnection.on('OnAuthenticated', async (token: string) => await this._onAuthenticated(token));

    await this.hubConnection.start();
    await this._getStratisId();
  }

  private async _getStratisId(): Promise<void> {
    if (!this.hubConnection) return;

    const stratisId = await this.hubConnection.invoke('GetStratisId');
    this.stratisId = new StratisId(this.hubConnection.connectionId, stratisId);
  }

  private async _onAuthenticated(token: string): Promise<void> {
    // Set timeout to allow _onReconnected to finish if necessary before closing the connection
    setTimeout(async () => {
      await this._stopHubConnection();

      this.authenticationHandler.accessToken = token;
      const { route, isRedirect, isCallback, callbackPayload } = this.authenticationHandler;

      if (isRedirect) window.location.href = route.href;
      else if (isCallback) await this._authApiService.callback(route.href, callbackPayload).toPromise();

      // Todo: Maybe remove QR, notify user, kill socket
      // this._stopHubConnection();
      // this.subscription.unsubscribe();
    });
  }

  private async _onReconnected(newConnectionId: string): Promise<void> {
    const { connectionId, stratisId } = this.stratisId;

    if (newConnectionId !== connectionId) {
      try {
        const success = await this.hubConnection.invoke('Reconnect', connectionId, stratisId);
        if (!success) throw new Error('Unsuccessful reconnection');
      } catch {
        await this._getStratisId();
      }
    }

    this.reconnecting = false;
  }

  private async _stopHubConnection(): Promise<void> {
    if (!this.hubConnection) return;

    await this.hubConnection.stop();
    this.hubConnection = null;
  }

  async ngOnDestroy() {
    this.subscription.unsubscribe();
    await this._stopHubConnection();
  }
}
