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
    this.calculateFibonacci();
  }

  /**
   * This mocks a task for the sake of exemplifying the API. It consists
   * of a inneficient and slow calculation of a Fibonacci number. Each
   * calculation is measured and registered to Chrome using the User
   * Timings API and a proposed predefined format to extend the
   * Performance Panel.
   */
  calculateFibonacci() {
    return this.fib(6);
  }
  fib(val: number): number {
    const then = performance.now();
    const randomDuration = 50 * (1 + Math.random());
    while (performance.now() - then < randomDuration);
    if (val === 0 || val === 1) {
      this.injectTimingsToBrowser(then, randomDuration, val, val)
      return 1;
    }
    const result = this.fib(val - 1) + this.fib(val -2);
    this.injectTimingsToBrowser(then, randomDuration, val, result)
    return result;
  }

  injectTimingsToBrowser(startTime: number, dur: number, fibonacciValue: number, result: number) {
    const measure = {
      start: startTime,
      end: performance.now(),
      detail: {
        devtools: {
          dataType:"track-entry",
          color: fibonacciValue %2 === 0 ? 'primary' : 'secondary',
          track: 'Corgi track',
          properties: [
            ["Description", `This is the time taken to calculate the ${fibonacciValue}th value in the Fibonacci sequence`],
            ["Hint", `There are approximately ${result > 1 ? result + 2: 0} calculations below this one`],
          ],
          tooltipText: `This is was randomly chosen to take a self time of approx ${dur.toFixed(1)} milliseconds.`
        }
      },
    };
    performance.measure(`Computation of ${fibonacciValue}`, measure);
  }
}
