import { Icons } from 'src/app/models/icons';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'opdex-secret',
  templateUrl: './secret.component.html',
  styleUrls: ['./secret.component.scss']
})
export class SecretComponent {
  @Input() label: string;
  @Input() secret: string;
  showSecret: boolean;
  copied: boolean;
  icons = Icons;

  get hiddenSecret(): string {
    const disc = '&#8226;';
    let secret = disc;
    let count = 1;

    while (count < 50) {
      secret += disc;
      count++;
    }

    return secret;
  }

  copy(): void {
    this.copied = true;
    setTimeout(() => this.copied = false, 1000);
  }

  toggleSecret(): void {
    this.showSecret = !this.showSecret;
  }
}
