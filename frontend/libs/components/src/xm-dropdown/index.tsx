/**
 * 二次封装antd-dropdown
 *
 * 目的：解决页面嵌套iframe,点击iframe区域dropdown不消失问题
 *
 * 点击dropdown以外dom，dropdown消失实现原理：
 * 1、监听document上的mousedown
 * 2、!dropdownRef.current.contains => setIsOpen(false)
 *
 */
import { useState, useEffect } from 'react';
import { Dropdown } from 'antd';

import type { DropdownProps, MenuProps } from 'antd';

export const XmDropdown: React.FC<DropdownProps> = (props) => {
    const { children, open, menu, ...rest } = props;
    const [openControl, setOpenControl] = useState<boolean>(!!open);

    useEffect(() => {
        setOpenControl(!!open);
    }, [open]);

    useEffect(() => {
        // 只在window上存在多个document时，document在第一次blur时触发
        // 解决页面嵌套iframe无法关闭问题
        window.addEventListener('blur', () => {
            setOpenControl(false);
        });

        return () => {
            window.removeEventListener('blur', () => {
                setOpenControl(false);
            });
        };
    }, []);

    // 点击Dropdown里的menu，关闭Dropdown
    const onMenuClick: MenuProps['onClick'] = (menuInfo) => {
        const { onClick } = menu || {};
        onClick?.(menuInfo);
        setOpenControl(false);
    };

    return (
        <Dropdown
            open={openControl}
            onOpenChange={(flag) => {
                setOpenControl(flag);
            }}
            menu={{ ...menu, onClick: onMenuClick }}
            {...rest}>
            {children}
        </Dropdown>
    );
};

export default XmDropdown;
