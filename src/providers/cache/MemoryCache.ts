import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the MemoryCache provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MemoryCache {

  protected storage: { [key: string]: { value: any, ttl: number } } = {};

  constructor() {
  }

  has(key: string): boolean {
    if (this.storage[key] != null) {
      this.clearIfInvalid(key);
      return (this.storage[key] != null);
    }
    return false;
  }

  clear(key: string): void {
    delete this.storage[key];
  }

  set(key: string, value: any, ttl: number = 0): void {
    let cache_value = { value: value, ttl: Date.now() + ttl };
    this.storage[key] = cache_value;
    console.log("cache set: "+key+" ttl: "+this.storage[key].ttl);
  }

  get(key: string): any {
    console.log("cache hit: "+key);
    this.clearIfInvalid(key);
    return this.storage[key].value;
  }

  protected valid(key: string) {
    console.log("cache: now "+ Date.now() +"<= valid date "+ this.storage[key].ttl)
    return (Date.now() <= this.storage[key].ttl);
  }

  protected clearIfInvalid(key: string) {
    if (!this.valid(key)) {
      this.clear(key);
    }
  }

}
