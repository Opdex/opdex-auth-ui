// Angular Core Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeComponent } from './qr-code/qr-code.component';

// CDK Imports
import { ClipboardModule } from '@angular/cdk/clipboard';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

// Other Imports
import { QrCodeModule } from 'ng-qrcode';

@NgModule({
  declarations: [
    QrCodeComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    ClipboardModule,
    QrCodeModule
  ],
  exports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    QrCodeComponent
  ]
})
export class ComponentsModule { }
