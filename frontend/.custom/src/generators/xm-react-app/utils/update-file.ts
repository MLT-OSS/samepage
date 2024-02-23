import { Tree } from '@nx/devkit';
export const updateFile = (tree: Tree, path: string, data: string) => {
    const _filePath = path;
    const _file = tree.read(_filePath);
    if (_file) {
        tree.write(_filePath, Buffer.concat([_file, Buffer.from(data)]));
    }
};
