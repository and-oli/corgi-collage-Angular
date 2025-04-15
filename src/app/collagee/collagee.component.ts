import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorgiComponent } from '../corgi/corgi.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-collagee',
  standalone: true,
  imports: [CommonModule, CorgiComponent, FormsModule],
  template: `
  <div class='App'>
    <a style='color: blue;position: absolute;left: 10px;' target='_blank'  rel='noopener noreferrer' href='https://github.com/and-oli/corgi-collage-Angular'>Code</a>
    <p class='mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>My Corgi collage</p>
    <header class='header'>
        <img src='https://www.josera.de/media/ratgeber-de/Hund_Corgi_shutterstock_1079352791_Beitragsbild2.jpg' class='corgi-logo' alt='logo' />
      </header>
      <div class='input-wrap'>        
        <div class='new-input-wrap'>
          <div>
            Corgi name: <input
              [ngModel]='newCorgiName()'
              (input)='onCorgiNameChange($any($event.target).value)'
              class='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
          </div>
          <div>
            Security photo (<a style='color: blue' target='_blank'  rel='noopener noreferrer' href='https://home-affairs.ec.europa.eu/system/files/2016-12/icao_photograph_guidelines_en.pdf'>See guidelines</a>):        <input
              [ngModel]='newCorgiSecurityPhoto()' 
              (input)='onCorgiSecurityPhotoChange($any($event.target).value)'
              class='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
          </div>
          <button [disabled]='!newCorgiName || !newCorgiSecurityPhoto' style='width:100px' (click)='corgiAdded()' class='mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>Add new Corgi</button> 
        </div>
        <div class='find-input-wrap'>
            <label for='default-search' class='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'>Search</label>
            <div class='relative'>
                <div class='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
                    <svg class='w-4 h-4 text-gray-500 dark:text-gray-400' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'>
                        <path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'/>
                    </svg>
                </div>
                <input
                  [ngModel]='corgiSearch()' 
                  (input)='onCorgiSearchChange($any($event.target).value)'
                  type='search'
                  id='default-search'
                  class='block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='Search a corgi by name'
                  />
            </div>
        </div>
      </div>


    <div class='corgi-zone'>
    <app-corgi  *ngFor='let item of filter(corgis());' [name]='item.name' [image]='item.image' class='corgi-component'>
    </app-corgi>
    </div>
  </div>
  `,
  styleUrls: ['./collagee.component.css']
})

export class CollageeComponent {
  count = signal<number[]>([]);
  corgis = signal<Corgi[]>([]);
  newCorgiName = signal<string>(corgiNames[0]);
  newCorgiSecurityPhoto = signal<string>(corgiImages[1]);
  corgiSearch = signal<string>('');
  
  onCorgiNameChange(newName: string): void {
    this.newCorgiName.set(newName)
  }

  onCorgiSecurityPhotoChange(newPhoto: string): void {
    this.newCorgiSecurityPhoto.set(newPhoto)
  }

  onCorgiSearchChange(search: string): void {
    this.corgiSearch.set(search)
  }

  corgiAdded(): void {
    if (!this.newCorgiName || !this.newCorgiSecurityPhoto) {
      return;
    }
    const newCorgiCount = this.corgis().length + 1;
    const corgiName = this.newCorgiName();
    const corgiImage = this.newCorgiSecurityPhoto();
    if (newCorgiCount + 1 < corgiImages.length) {
      this.newCorgiName.set(corgiNames[newCorgiCount + 1])
      this.newCorgiSecurityPhoto.set(corgiImages[newCorgiCount + 1])
    } else {
      this.newCorgiName.set('')
      this.newCorgiSecurityPhoto.set('')
    }
    this.corgis.update(values => [...values, {name: corgiName, image: corgiImage}]);
  }

  filter(corgiList: Corgi[]): Corgi[] {
    const result = corgiList.filter(corgi => corgi.name.toLowerCase().includes(this.corgiSearch().toLowerCase())  || this.corgiSearch() === '');
    return result;
  }
}

type Corgi = {name: string, image: string}


const corgiImages = [
  'https://www.josera.de/media/ratgeber-de/Hund_Corgi_shutterstock_1079352791_Beitragsbild2.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Welsh_Pembroke_Corgi.jpg/640px-Welsh_Pembroke_Corgi.jpg',
  'https://cdn.shortpixel.ai/spai/w_872+q_+ret_img+to_webp/tierisch-verliebt.de/magazin/wp-content/uploads/2023/08/corgi-2-1280x765.jpg',
  'https://nationaltoday.com/wp-content/uploads/2022/08/18-National-Welsh-Corgi-Day-1200x834.jpg',
  'https://www.animalcentury.com/cdn/shop/products/CorgiQueen_DIN_LQ_1200x1200.jpg?v=1638397610',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKXrKJQgyBzuGL2GXou6Y_TfO8_oLWE9n_Aw&usqp=CAU',
  'https://www.josera.de/media/ratgeber-de/Hund_Corgi_shutterstock_1861514161_Beitragsbild1.jpg',
  'https://mymodernmet.com/wp/wp-content/uploads/2020/10/cooper-baby-corgi-dogs-8.jpg',
];

const corgiNames = [
  'Charles',
  'Henri',
  'Louis',
  'Edward',
  'Marie Antoinette',
  'Elizabeth',
  'Frederick',
  'Ivan'
];