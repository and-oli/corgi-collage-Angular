import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface QuoteResponse {
  category: string;
  type: string;
  setup?: string;
  delivery?: string;
  joke?: string;
  flags: {
    nsfw: boolean;
    religious: boolean;
    political: boolean;
    racist: boolean;
    sexist: boolean;
    explicit: boolean;
  };
  id: number;
  lang: string;
}

interface TranslationResponse {
  success: {
    total: number;
  };
  contents: {
    translated: string;
    text: string;
    translation: string;
  };
}

@Component({
  selector: 'app-corgi',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
<div class='rounded-lg shadow-md overflow-hidden w-72 flex flex-col bg-white'>
  <div class='p-2 border-4 border-indigo-500 rounded-md m-2 flex items-center justify-center'>
    <img [src]='image' class='rounded-md object-cover aspect-square' alt='logo' />
  </div>
  <div class='p-4 flex flex-col gap-y-2'>
    <div class='text-center font-semibold text-lg text-indigo-700'>{{name}}</div>
    <div
      *ngIf="originalQuote"
      class="relative inline-block"
      (mouseover)="showTooltip = true"
      (mouseout)="showTooltip = false"
    >
      <h3 class='text-sm text-indigo-500 font-medium'>Quote:</h3>
      <p class='italic text-gray-700 font-serif'>{{ wiseQuote }}</p>
      <div
        *ngIf="showTooltip"
        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 rounded-md shadow-lg bg-indigo-600 text-white text-xs py-2 px-3"
      >
        Original Quote: {{ originalQuote }}
        <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-t-indigo-600 border-t-4 border-l-transparent border-r-transparent"></div>
      </div>
    </div>
    <div *ngIf="loading" class='text-sm text-gray-500 italic'>
      Loading quote...
    </div>
    <div *ngIf="error" class='text-sm text-red-600 font-bold'>
      Error fetching quote: {{ error }}
    </div>
  </div>
</div>
  `,
  styleUrls: ['./corgi.component.css']
})
export class CorgiComponent implements OnInit {
  @Input() name!: string;
  @Input() image!: string;

  originalQuote: string | null = null;
  wiseQuote: string | null = null;
  loading = false;
  error: string | null = null;
  showTooltip = false;

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    this.loading = true;
    try {
      const start = performance.now();
      this.originalQuote = await this.fetchQuote();
      this.measurePerformance('Fetching Quote', start, 'secondary');
      if (!this.originalQuote) {
        return;
      }
      const wisenStart = performance.now();
      this.wiseQuote = await this.wisenQuote(this.originalQuote);
      this.measurePerformance('Wisening Quote', wisenStart, 'tertiary');

      requestAnimationFrame(() => {
        performance.measure(`Adding corgi: ${this.name}`, {start: start, detail: {devtools: {track: 'Addition', trackGroup: 'Corgi app timings', properties: [['Start', start], ['End', performance.now()], ]}}});
      });
    } catch (err: any) {
      this.error = err.message || 'An error occurred while fetching funny things.';
    } finally {
      this.loading = false;
    }
  }

  async fetchQuote(): Promise<string | null> {
    try {
      const start = performance.now();
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await fetch('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit');
      this.measurePerformance('Quote fetch', start, 'secondary-light');
      if (!response.ok) {
        const message = `An error occurred: ${response.status}`;
        throw new Error(message);
      }
      const quoteResponse = await response.json() as QuoteResponse;

      if (quoteResponse.type === 'single') {
        return quoteResponse.joke || '';
      } else if (quoteResponse.type === 'twopart') {
        return `${quoteResponse.setup || ''} ${quoteResponse.delivery || ''}`;
      }
      return null
    } catch (error: any) {
      console.error('Error fetching quote:', error);
      return 'Error loading quote';
    }
  }

  async wisenQuote(quoteResponse: string): Promise<string | null> {
    try {
      const start = performance.now();
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.measurePerformance(`Preparing to improve quote for ${this.name}`, start, 'tertiary-light');
      
      const response = await Promise.race([fetch(`https://api.funtranslations.com/translate/yoda.json?text=${encodeURIComponent(quoteResponse)}`), new Promise<undefined>(res => setTimeout(res, 400))]);
      if (!response?.ok) {
        const message = `An error occurred: ${response?.status}`;
        throw new Error(message);
      }
      const translationResponse = await response.json() as TranslationResponse;
      const start2 = performance.now();
      await new Promise(resolve => setTimeout(resolve, 1500));
      this.measurePerformance(`Processing improved quote for ${this.name}`, start2, 'tertiary-light');

      return translationResponse?.contents?.translated ? `"${translationResponse.contents.translated}"` : null;
    } catch (error: any) {  
      console.error('Error with slow quote translation:', error);
      return quoteResponse;
    }
  }

  measurePerformance(description: string, startTime: number, color: string = 'primary', properties: any = []) {
    const duration = performance.now() - startTime;
    this.injectTimingsToBrowser(startTime, duration, description, color);
  }

  injectTimingsToBrowser(startTime: number, dur: number, description: string, color: string, properties: any = []) {
    const measure = {
      start: startTime,
      end: performance.now(),
      detail: {
        devtools: {
          dataType: "track-entry",
          color,
          trackGroup: 'Corgi app timings',
          track: 'Corgi rendering',
          properties: [
            ["Description", description],
            ["Duration (ms)", dur.toFixed(2)],
            ...properties,
          ],
          tooltipText: `${description} took ${dur.toFixed(2)}ms`
        }
      },
    };
    performance.measure(description, measure);
  }
}