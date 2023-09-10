import Dexie, { Table } from "dexie";
const AV_MASTER_DB = "AV_MASTER_DB";

export interface Directory {
  id?: number;
  name: string;
  handle: FileSystemDirectoryHandle;
}

export class PathDexie extends Dexie {
  directories!: Table<Directory>;

  constructor() {
    super(AV_MASTER_DB);
    this.version(1).stores({
      directories: "++id, name, handle",
    });
  }
}

export const db = new PathDexie();
