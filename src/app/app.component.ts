import { Icons } from './models/icons';
import { Network } from './models/networks';
import { EnvironmentsService } from './services/utility/environments.service';
import { Component} from '@angular/core';

@Component({
  selector: 'opdex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  network: Network;
  icons = Icons;

  constructor(private _env: EnvironmentsService) {
    this.network = this._env.network;
  }
}
