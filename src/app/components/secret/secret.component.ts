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

  copy(): void {
    this.copied = true;
    setTimeout(() => this.copied = false, 1000);
  }

  toggleSecret(): void {
    this.showSecret = !this.showSecret;
  }
}
