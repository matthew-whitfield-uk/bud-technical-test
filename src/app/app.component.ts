import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  title = 'bud-technical-test';
}
