import { Tree } from '@nx/devkit';
import * as fs from 'fs';

export const copyFile = (host: Tree, sourcePath: string, targetPath: string) => {
    if (fs.existsSync(sourcePath)) {
        const file = fs.readFileSync(sourcePath);
        if (file) {
            host.write(targetPath, file);
        }
    }
};
