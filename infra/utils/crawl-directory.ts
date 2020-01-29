import { readdirSync, statSync } from 'fs';
import { join } from 'path';

export function crawlDirectory(dir: string, callback: (filePath: string) => void): void {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file.toString());
    const fileStat = statSync(filePath);

    if (fileStat.isDirectory()) {
      crawlDirectory(filePath, callback);
    } else {
      callback(filePath);
    }
  });
}
