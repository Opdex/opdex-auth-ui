import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { Icons } from 'src/app/models/icons';

@Component({
  selector: 'opdex-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent {
  @Input() data: string | object;
  copied: boolean;
  icons = Icons;

  public get qr(): string {
    if (!!this.data === false) return '';

    return typeof this.data === 'string'
      ? this.data
      : JSON.stringify(this.data);
  }

  copyHandler() {
    this.copied = true;
    setTimeout(() => this.copied = false, 1000);
  }
}

