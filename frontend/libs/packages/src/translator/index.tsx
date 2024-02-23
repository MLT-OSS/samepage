import { createRoot } from 'react-dom/client';
import { translate } from '@/utils';
import { TranslatorInnerContent } from '../translator-inner-content';
import { debounce } from 'lodash-es';

const {
    APP_LCNAME,
    TRANS_MIN_LENGTH,
    TRANS_MAX_LENGTH,
    EVENT_KISS,
    MSG_TRANS_CURRULE,
    OPT_STYLE_DASHLINE,
    OPT_STYLE_FUZZY,
    fetchUpdate,
    fetchClear
} = translate;

/**
 * 翻译类
 */
export class Translator {
    _rule: any = {};
    _minLength = 0;
    _maxLength = 0;
    _skipNodeNames = [
        APP_LCNAME,
        'style',
        'svg',
        'img',
        'audio',
        'video',
        'textarea',
        'input',
        'select',
        'option',
        'head',
        'script',
        'iframe',
        'pre'
    ];
    _rootNodes = new Set();
    _tranNodes = new Map();

    _reTranslate = debounce(() => {
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        if (this._rule.transOpen === 'true') {
            // eslint-disable-next-line @typescript-eslint/no-invalid-this
            this._register();
        }
    }, 500);

    // 显示
    _interseObserver = new IntersectionObserver(
        (intersections) => {
            intersections.forEach((intersection) => {
                if (intersection.isIntersecting) {
                    // eslint-disable-next-line @typescript-eslint/no-invalid-this
                    this._render(intersection.target);
                    // eslint-disable-next-line @typescript-eslint/no-invalid-this
                    this._interseObserver.unobserve(intersection.target);
                }
            });
        },
        {
            threshold: 0.1
        }
    );

    // 变化
    _mutaObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation: any) => {
            // eslint-disable-next-line @typescript-eslint/no-invalid-this
            if (!this._skipNodeNames.includes(mutation.target.localName) && mutation.addedNodes.length > 0) {
                const nodes = Array.from(mutation.addedNodes).filter((node: any) => {
                    // eslint-disable-next-line @typescript-eslint/no-invalid-this
                    if (this._skipNodeNames.includes(node.localName) || node.id === APP_LCNAME) {
                        return false;
                    }
                    return true;
                });
                if (nodes.length > 0) {
                    // eslint-disable-next-line @typescript-eslint/no-invalid-this
                    this._reTranslate();
                }
            }
        });
    });

    // 插入 shadowroot
    _overrideAttachShadow = () => {
        // eslint-disable-next-line @typescript-eslint/no-invalid-this, @typescript-eslint/no-this-alias
        const _this = this;
        const _attachShadow = HTMLElement.prototype.attachShadow;
        HTMLElement.prototype.attachShadow = function (...args) {
            _this._reTranslate();
            return _attachShadow.apply(this, args);
        };
    };

    // eslint-disable-next-line @typescript-eslint/member-ordering
    constructor(rule: any, { fetchInterval, fetchLimit, minLength, maxLength }: any) {
        fetchUpdate(fetchInterval, fetchLimit);
        this._overrideAttachShadow();
        this._minLength = minLength ?? TRANS_MIN_LENGTH;
        this._maxLength = maxLength ?? TRANS_MAX_LENGTH;
        this.rule = rule;
        if (rule.transOpen === 'true') {
            this._register();
        }
    }

    get rule() {
        // console.log('get rule', this._rule);
        return this._rule;
    }

    set rule(rule) {
        // console.log('set rule', rule);
        this._rule = rule;

        // 广播消息
        window.dispatchEvent(
            new CustomEvent(EVENT_KISS, {
                detail: {
                    type: MSG_TRANS_CURRULE,
                    data: rule
                }
            })
        );
    }

    updateRule = (obj: any, callback: (rule: any) => void) => {
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        this.rule = { ...this.rule, ...obj };
        if (callback) {
            // eslint-disable-next-line @typescript-eslint/no-invalid-this
            callback(this.rule);
        }
    };

    toggle = () => {
        if (this.rule.transOpen === 'true') {
            // eslint-disable-next-line @typescript-eslint/no-invalid-this
            // eslint-disable-next-line @typescript-eslint/no-invalid-this
            this.rule = { ...this.rule, transOpen: 'false' };
            // eslint-disable-next-line @typescript-eslint/no-invalid-this
            this._unRegister();
        } else {
            // eslint-disable-next-line @typescript-eslint/no-invalid-this
            this.rule = { ...this.rule, transOpen: 'true' };
            // eslint-disable-next-line @typescript-eslint/no-invalid-this
            this._register();
        }
    };

    toggleStyle = () => {
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        const textStyle = this.rule.textStyle === OPT_STYLE_FUZZY ? OPT_STYLE_DASHLINE : OPT_STYLE_FUZZY;
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        this.rule = { ...this.rule, textStyle };
    };

    /**
     * node - 获取传入标签的所有父级标签
     *
     * @param  { HTMLElement } node 初始dom节dian
     * @return {type} 目标节点
     */
    _getNodeDom = (node: any, result: any = []) => {
        const nodeType = node.nodeType;
        if (nodeType === 1) {
            // 元素
            const childNodes = Array.from(node.childNodes).filter(
                // eslint-disable-next-line @typescript-eslint/no-invalid-this
                (node: any) => !this._skipNodeNames.includes(node.localName)
            );
            if (childNodes.some((node: any) => node.nodeType === 3 && node.textContent.trim())) {
                // 文本节点
                result.push(node);
            } else {
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let i = 0; i < childNodes.length; i++) {
                    // eslint-disable-next-line @typescript-eslint/no-invalid-this
                    this._getNodeDom(childNodes[i], result); // 递归
                }
            }
        }
        return result;
    };

    _queryNodes = () => {
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        // this._rootNodes.add(document);
        const rootNode: any = document.querySelector('body');
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        this._getNodeDom(rootNode).forEach((item: any) => {
            // eslint-disable-next-line @typescript-eslint/no-invalid-this
            if (!this._tranNodes.has(item)) {
                // eslint-disable-next-line @typescript-eslint/no-invalid-this
                this._tranNodes.set(item, '');
            }
        });
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        // console.log(this._tranNodes);
    };

    _register = () => {
        // 搜索节点
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        this._queryNodes();

        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        this._rootNodes.forEach((node: any) => {
            // 监听节点变化;
            // eslint-disable-next-line @typescript-eslint/no-invalid-this
            this._mutaObserver.observe(node, {
                childList: true,
                subtree: true
                // characterData: true,
            });
        });

        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        this._tranNodes.forEach((_, node) => {
            // 监听节点显示
            // eslint-disable-next-line @typescript-eslint/no-invalid-this
            this._interseObserver.observe(node);
        });
    };

    _unRegister = () => {
        // 解除节点变化监听
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        this._mutaObserver.disconnect();

        // 解除节点显示监听
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        this._interseObserver.disconnect();
        // 移除已插入元素
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        this._tranNodes.forEach((_, node) => {
            node.querySelector(APP_LCNAME)?.remove();
        });

        // 清空节点集合
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        this._rootNodes.clear();
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        this._tranNodes.clear();

        // 清空任务池
        fetchClear();
    };

    _render = (el: any) => {
        let traEl = el.querySelector(APP_LCNAME);

        // 已翻译
        if (traEl) {
            // eslint-disable-next-line @typescript-eslint/no-invalid-this
            const preText = this._tranNodes.get(el);
            const curText = el.innerText.trim();
            // const traText = traEl.innerText.trim();

            // todo
            // 1. traText when loading
            // 2. replace startsWith
            if (curText.startsWith(preText)) {
                return;
            }

            traEl.remove();
        }

        const q = el.innerText.trim();
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        this._tranNodes.set(el, q);

        // 太长或太短
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        if (!q || q.length < this._minLength || q.length > this._maxLength) {
            return;
        }

        // console.log("---> ", q);

        traEl = document.createElement(APP_LCNAME);
        traEl.style.visibility = 'visible';
        el.appendChild(traEl);
        el.style.cssText += '-webkit-line-clamp: unset; max-height: none; height: auto;';
        if (el.parentElement) {
            el.parentElement.style.cssText += '-webkit-line-clamp: unset; max-height: none; height: auto;';
        }

        const root = createRoot(traEl);
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        root.render(<TranslatorInnerContent q={q} translator={this} />);
    };
}
