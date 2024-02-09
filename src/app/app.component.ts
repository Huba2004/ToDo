import { Component, OnInit } from '@angular/core';
import { Item } from "./item";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'todo';

  filter: 'all' | 'active' | 'done' | 'expired' = 'all';

  allItems: Item[] = [
    { description: 'Webfejlesztési beadandó', done: false, expiryDate: new Date('2024-02-08') },
    { description: 'Érettségi szóbelire készülés', done: false, expiryDate: new Date('2024-04-06') },
    { description: 'Bevásárlás', done: true, expiryDate: new Date('2024-01-31') },
    
  ];
  ngOnInit() {
    const expiredItems = this.allItems.filter(item => !item.done && item.expiryDate <= new Date());
    if (expiredItems.length > 0) {
      let message = 'Figyelem! A következő feladatok lejártak:\n';
      for (const item of expiredItems) {
        const daysExpired = this.calculateDaysExpired(item.expiryDate);
        message += `- ${item.description}: lejárt ${daysExpired} napja.\n`;
      }
      alert(message);
    }
  }
   calculateDaysExpired(expiryDate: Date): number {
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - expiryDate.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24));
  }

  get items() {
    const currentDate = new Date();
    switch (this.filter) {
      case 'all':
        return this.allItems;
      case 'active':
        return this.allItems.filter(item => !item.done && item.expiryDate > currentDate);
      case 'done':
        return this.allItems.filter(item => item.done);
      case 'expired':
        return this.allItems.filter(item => item.expiryDate <= currentDate && !item.done);
      default:
        return [];
    }
  }
  
  addItem(description: string, expiryDateString: string) {
    if (!description || !expiryDateString) {
      console.error('Mindkét mezőt ki kell tölteni.');
      return;
    }
    const expiryDate = new Date(expiryDateString);
    if (isNaN(expiryDate.getTime())) {
      console.error('Érvénytelen dátum.');
      return;
    }
    this.allItems.unshift({
      description,
      done: false,
      expiryDate
    });
  }

  remove(item: Item) {
    this.allItems.splice(this.allItems.indexOf(item), 1);
  }

  getFilteredItemCount(): number {
    const currentDate = new Date();

    switch (this.filter) {
      case 'all':
        return this.items.length;
      case 'active':
        return this.items.filter(item => !item.done && item.expiryDate > currentDate).length;
      case 'done':
        return this.items.filter(item => item.done).length;
      case 'expired':
        return this.items.filter(item => item.expiryDate <= currentDate && !item.done).length;
      default:
        return 0;
    }
  }
  setFilter(filterValue: 'all' | 'active' | 'done' | 'expired') {
    this.filter = filterValue;
  }
  
}