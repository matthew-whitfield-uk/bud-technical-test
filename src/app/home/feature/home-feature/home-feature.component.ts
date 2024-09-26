import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-feature',
  standalone: true,
  imports: [RouterLink],
  template: `<button routerLink="form">View Form</button>`,
  styles: `:host {display:flex; justify-content: center;}`,
})
export class HomeFeatureComponent {}
