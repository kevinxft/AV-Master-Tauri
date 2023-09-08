export class LRUCache {
  private map;
  private length;
  constructor(length = 12) {
    this.map = new Map();
    this.length = length;
  }

  get(key: string) {
    if (!this.map.get(key)) {
      return;
    }
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  set(key: string, value: string) {
    if (this.map.get(key)) {
      this.map.delete(key);
    }
    this.map.set(key, value);
    if (this.map.size > this.length) {
      const firstKey = this.map.keys().next().value;
      this.map.delete(firstKey);
    }
  }

  toArray() {
    return Array.from(this.map).map(([key]) => key);
  }

  initData(arr: string[]) {
    for (const item of arr) {
      this.set(item, item);
    }
  }

  clear() {
    this.map.clear();
  }
}
