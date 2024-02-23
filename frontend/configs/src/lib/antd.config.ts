import type { ThemeConfig } from 'antd';

const defaultContentThemeConfig: ThemeConfig = {
    token: {
        colorPrimary: '#7171ee', // 主题色
        colorTextBase: 'rgba(0,0,0, 0.75)', // 全局字体颜色
        fontSize: 13, // 字体大小
        lineHeight: 1.4, // 行高 18.2 / 13
        borderRadius: 4, // 圆角
        colorBorder: '#D2D2D2', // 边框颜色
        colorPrimaryHover: '#5C5CD6'
    },
    components: {
        Button: {
            controlHeight: 40,
            paddingContentHorizontal: 27
        },
        Select: {
            colorBorder: 'rgba(113, 113, 238, 0.2)',
            colorPrimaryHover: '#7171EE'
        },
        Input: {
            colorPrimaryHover: '#7171EE'
        }
    }
};

const getThemeConfig: () => ThemeConfig = () => {
    return defaultContentThemeConfig;
};

export { getThemeConfig };
