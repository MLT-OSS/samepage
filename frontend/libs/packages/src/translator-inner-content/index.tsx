import { useMemo, useState, useEffect } from 'react';
import { TranslateLoading } from '@xm/components';
import { translate } from '@/utils';
import { useTranslate } from '@xm/hooks';

const {
    OPT_STYLE_LINE,
    OPT_STYLE_DOTLINE,
    OPT_STYLE_DASHLINE,
    OPT_STYLE_WAVYLINE,
    OPT_STYLE_FUZZY,
    OPT_STYLE_HIGHTLIGHT,
    DEFAULT_COLOR,
    EVENT_KISS,
    MSG_TRANS_CURRULE
} = translate;

interface InnerContentProps {
    q: string;
    translator: any;
}

export const TranslatorInnerContent: React.FC<InnerContentProps> = (props) => {
    const { q, translator } = props;
    const [rule, setRule] = useState(translator.rule);
    const [hover, setHover] = useState(false);
    const { text, sameLang, loading } = useTranslate(q, rule);
    const { textStyle, bgColor } = rule;

    const handleMouseEnter = () => {
        setHover(true);
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    const handleKissEvent = (e: any) => {
        const { type, data } = e.detail;
        switch (type) {
            case MSG_TRANS_CURRULE:
                setRule(data);
                break;
            default:
            // console.log(`[popup] kissEvent action skip: ${action}`);
        }
    };

    useEffect(() => {
        window.addEventListener(EVENT_KISS, handleKissEvent);
        return () => {
            window.removeEventListener(EVENT_KISS, handleKissEvent);
        };
    }, []);

    const style = useMemo(() => {
        const lineColor = bgColor || '';
        const underlineStyle = (st: any) => ({
            textDecorationLine: 'underline',
            textDecorationColor: lineColor,
            textDecorationStyle: st,
            textDecorationThickness: '2px',
            textUnderlineOffset: '0.3em',
            WebkittextDecorationLine: 'underline',
            WebkittextDecorationColor: lineColor,
            WebkittextDecorationStyle: st,
            WebkittextDecorationThickness: '2px',
            WebkittextTextUnderlineOffset: '0.3em'
        });
        switch (textStyle) {
            case OPT_STYLE_LINE: // 下划线
                return underlineStyle('solid');
            case OPT_STYLE_DOTLINE: // 点状线
                return underlineStyle('dotted');
            case OPT_STYLE_DASHLINE: // 虚线
                return underlineStyle('dashed');
            case OPT_STYLE_WAVYLINE: // 波浪线
                return underlineStyle('wavy');
            case OPT_STYLE_FUZZY: // 模糊
                return {
                    filter: hover ? 'none' : 'blur(5px)',
                    transition: 'filter 0.2s ease-in-out'
                };
            case OPT_STYLE_HIGHTLIGHT: // 高亮
                return {
                    color: '#FFF',
                    backgroundColor: bgColor || DEFAULT_COLOR
                };
            default:
                return {};
        }
    }, [textStyle, hover, bgColor]);

    if (loading) {
        return (
            <>
                {q.length > 40 ? <br /> : ' '}
                <TranslateLoading />
            </>
        );
    }

    if (text && !sameLang) {
        return (
            <>
                {q.length > 40 ? <br /> : ' '}
                <span style={style} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    {text}
                </span>
            </>
        );
    }
    return <></>;
};
