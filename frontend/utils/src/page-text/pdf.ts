import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';

/**
 *  判断是否符合PDF页面(目前所有页面均需要过一遍 pdf 由 pdf 解析器来判断是否是 pdf)
 * @param url 页面地址
 * @returns  boolean
 */
const isMatch = (url: string) => {
    return true;
};

export const getText = async (url: string, DOM?: Document) => {
    if (!isMatch(url)) return '';
    try {
        const loadingTask = pdfjsLib.getDocument({
            url
        });
        const pdfDocument = await loadingTask.promise;
        const _pages = pdfDocument.numPages;
        const pagesPromises = Array.from({
            length: _pages
        }).map(async (_page, index) => await pdfDocument.getPage(index + 1));
        const pagesAll = await Promise.all(pagesPromises);
        const textPromises = pagesAll.map(async (_page) => await _page.getTextContent());
        const textAll = await Promise.all(textPromises);
        const content = textAll.map((item) => item.items.map((item: any) => item.str).join('')).join('');
        return content;
    } catch (e) {
        console.log('❌PDF parse error: ', e);
        return '';
    }
};
