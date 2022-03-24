// Angular Core Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// NPM Imports
import { QrCodeModule } from 'ng-qrcode';

// CDK Imports
import { ClipboardModule } from '@angular/cdk/clipboard';

// Material Imports
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatDividerModule } from '@angular/material/divider'

// Components
import { QrCodeComponent } from './qr-code/qr-code.component';
import { QrExpirationComponent } from './qr-expiration/qr-expiration.component';
import { SecretComponent } from './secret/secret.component';

@NgModule({
  declarations: [
    QrCodeComponent,
    QrExpirationComponent,
    SecretComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDividerModule,
    ClipboardModule,
    QrCodeModule
  ],
  exports: [
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDividerModule,
    ClipboardModule,
    QrCodeComponent,
    QrExpirationComponent,
    SecretComponent
  ]
})
export class ComponentsModule { }
