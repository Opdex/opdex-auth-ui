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

// Components
import { QrCodeComponent } from './qr-code/qr-code.component';
import { QrExpirationComponent } from './qr-expiration/qr-expiration.component';

@NgModule({
  declarations: [
    QrCodeComponent,
    QrExpirationComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatProgressBarModule,
    ClipboardModule,
    QrCodeModule
  ],
  exports: [
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    ClipboardModule,
    QrCodeComponent,
    QrExpirationComponent
  ]
})
export class ComponentsModule { }
