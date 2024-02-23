import { isExtension } from '../utils';
export const loadSrc = (uri: string) => {
    if (isExtension) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
        const ex = require('./index.extension');
        return ex?._loadSrc(uri);
    } else {
        return uri;
    }
};
