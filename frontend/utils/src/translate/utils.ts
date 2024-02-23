/**
 * 匹配是否为数组中的值
 */
export const matchValue = <T>(arr: T[], val: T): T => {
    if (arr.length === 0 || arr.includes(val)) {
        return val;
    }
    return arr[0];
};

/**
 * 字符串通配符(*)匹配
 */
export const isMatch = (s: string, p: any) => {
    if (s.length === 0 || p.length === 0) {
        return false;
    }

    // eslint-disable-next-line no-param-reassign
    p = `*${p}*`;

    let [sIndex, pIndex] = [0, 0];
    let [sRecord, pRecord] = [-1, -1];
    while (sIndex < s.length && pRecord < p.length) {
        if (p[pIndex] === '*') {
            pIndex++;
            [sRecord, pRecord] = [sIndex, pIndex];
        } else if (s[sIndex] === p[pIndex]) {
            sIndex++;
            pIndex++;
        } else if (sRecord + 1 < s.length) {
            sRecord++;
            [sIndex, pIndex] = [sRecord, pRecord];
        } else {
            return false;
        }
    }

    if (p.length === pIndex) {
        return true;
    }

    return p.slice(pIndex)?.replaceAll?.('*', '') === '';
};

/**
 * 类型检查
 */
export const type = (o: string) => {
    const s = Object.prototype.toString.call(o);
    return s?.match?.(/\[object (.*?)\]/)?.[1]?.toLowerCase?.();
};

/**
 * sha256
 */
export const sha256 = async (text: string, salt: string) => {
    const data = new TextEncoder().encode(text + salt);
    const digest = await crypto.subtle.digest({ name: 'SHA-256' }, data);
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
};
