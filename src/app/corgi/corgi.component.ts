import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-corgi',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div>
    <div>{{name}}</div>
    <img [src]='image' class='corgi' alt='logo' />
  </div>
  
  `,
  styleUrls: ['./corgi.component.css']
})
export class CorgiComponent {
  @Input() name!: string;
  @Input() image!: string;

  ngOnInit() {
    this.mockChangeDetection();
  }

  /**
   * This mocks a task happening when the component renders (f.e change
   * detection). It consists of a inneficient and slow calculation of a
   * Fibonacci number. Each calculation is measured and registered to
   * Chrome using the User Timings API and a proposed predefined
   * format to extend the Performance Panel.
   */
  mockChangeDetection() {
    return this.fib(5);
  }
  fib(val: number): number {
    const then = performance.now();
    while (performance.now() - then < 200 * (1 + Math.random()));
    if (val === 0 || val === 1) {
      return val
    }
    const result = this.fib(val - 1) + this.fib(val -2);
    const measure = {
      start: then,
      end: performance.now(),
      detail: {
        devtools: {
          metadata: {
            // An identifier for the data type
            dataType:"flame-chart-entry",
            // An identifier for the extension
            extensionName: 'Angular',
          },
          name: `Computation of ${val}`,
          color: 'red',
          track: 'Angular Extension Track',
          detailsText: 'This emulates a rendering task',
        }
      },
    };
    performance.measure( `Computation of ${val}`, measure);
    return result;
  }
}
