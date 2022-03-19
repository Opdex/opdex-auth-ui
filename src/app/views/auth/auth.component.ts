import { EnvironmentsService } from 'src/app/services/utility/environments.service';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Subscription, timer } from 'rxjs';
import { Icons } from 'src/app/models/icons';

@Component({
  selector: 'opdex-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  subscription = new Subscription();
  error: boolean;
  icons = Icons;
  hubConnection: HubConnection;
  stratisId: string;
  expirationTime: number;
  expirationLength: number;
  timeRemaining: string;
  percentageTimeRemaining: number;
  connectionId: string;
  reconnecting: boolean;
  isTestnet: boolean;
  webSid: SafeUrl;
  redirect: URL;

  constructor(
    private _sanitizer: DomSanitizer,
    private _activatedRoute: ActivatedRoute,
    private _environmentService: EnvironmentsService
  ) {
    const redirect = this._activatedRoute.snapshot.queryParamMap.get('REDIRECT_URL');
    this.redirect = redirect ? new URL(redirect) : null;
  }

  async ngOnInit(): Promise<void> {
    await this.connectToSignalR();
    this.subscription.add(timer(0, 1000).subscribe(async _ => await this.calcSidExpiration()));
  }

  private async connectToSignalR(): Promise<void> {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this._environmentService.apiUrl}/socket`)
      .configureLogging(LogLevel.Error)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.onclose(_ => console.log('closing connection'));

    await this.hubConnection.start();
    await this.getStratisId();

    this.hubConnection.onreconnecting(_ => this.reconnecting = true);
    this.hubConnection.onreconnected(async (connectionId: string) => await this._onReconnected(connectionId));
    this.hubConnection.on('OnAuthenticated', async (token: string) => await this._onAuthenticated(token));
  }

  private async _onReconnected(newConnectionId: string): Promise<void> {
    if (newConnectionId !== this.connectionId) {
      try {
        const success = await this.hubConnection.invoke('Reconnect', this.connectionId, this.stratisId);
        if (!success) await this.getStratisId();
      } catch (error) {
        await this.getStratisId();
      }
    }

    this.reconnecting = false;
  }

  private async _onAuthenticated(token: string): Promise<void> {
    // Set timeout to allow all promises to finished before closing the connection
    // Specifically during _onReconnected, wait to finish reconnecting
    setTimeout(async () => {
      await this.stopHubConnection();
      // Todo: Fully test this...
      if (!!this.redirect) {
        const redirect = !!this.redirect.searchParams
          ? `${this.redirect.href}&ACCESS_TOKEN=${token}`
          : `${this.redirect.href}?ACCESS_TOKEN=${token}`

        window.location.href = redirect;
      } else {
        // Todo: No Redirect? Go to Opdex? Prevent user in the first place?
      }
    });
  }

  private async getStratisId(): Promise<void> {
    if (!this.hubConnection) return;

    this.connectionId = this.hubConnection.connectionId;
    this.stratisId = await this.hubConnection.invoke('GetStratisId');

    if (!!this.stratisId === false || !this.stratisId.startsWith('sid:')) return;

    const url = new URL(this.stratisId.replace('sid:', 'https://'));
    const expiration = parseInt(url.searchParams.get('exp'));

    this.webSid = this._sanitizer.bypassSecurityTrustUrl(this.stratisId.replace('sid:', 'web+sid://'));
    this.expirationTime = new Date(expiration * 1000).getTime();
    this.expirationLength = (this.expirationTime - new Date().getTime()) / 1000;

    await this.calcSidExpiration();
  }

  private async calcSidExpiration(): Promise<void> {
    const timeRemaining = (this.expirationTime - new Date().getTime()) / 1000;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = Math.floor(timeRemaining % 60);

    if (minutes <= 0 && seconds <= 0) await this.getStratisId();

    this.percentageTimeRemaining = Math.floor((timeRemaining  / this.expirationLength) * 100);
    this.timeRemaining = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private async stopHubConnection(): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.stop();
      this.hubConnection = null;
    }
  }

  async ngOnDestroy() {
    this.subscription.unsubscribe();
    await this.stopHubConnection();
  }
}
