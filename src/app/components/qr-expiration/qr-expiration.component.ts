import { Icons } from 'src/app/models/icons';
import { Component, Input } from '@angular/core';
import { StratisIdTimeRemaining } from 'src/app/models/stratis-id';

@Component({
  selector: 'opdex-qr-expiration',
  templateUrl: './qr-expiration.component.html',
  styleUrls: ['./qr-expiration.component.scss']
})
export class QrExpirationComponent {
  @Input() timeRemaining: StratisIdTimeRemaining;
  icons = Icons;
}
