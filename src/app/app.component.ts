import { Component } from '@angular/core';
import { CollageeComponent } from './collagee/collagee.component';


@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CollageeComponent,
  ],
  template: `
    <app-collagee></app-collagee>
  `,
})
export class AppComponent {
  title = 'angular-app';
}
