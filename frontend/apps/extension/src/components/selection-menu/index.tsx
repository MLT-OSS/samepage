/**
 * selection 操作菜单
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Collapse } from 'antd';
import type { CollapseProps } from 'antd';
import classNames from 'classnames';
import { debounce } from 'lodash-es';
import styles from './index.module.less';
import { SELECTION_ACTIONS } from '@/constants';
import SelectionMenuItem from '../selection-menu-item';
import { useConversationContext } from '@xm/context';
import { ReactComponent as ArrowIcon } from '@/assets/images/arrow-down.svg';
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';
import Icon from '@ant-design/icons';
import { useSelectionSwitch } from '@xm/hooks';

interface MenuPosition {
    x: number;
    y: number;
}

interface SelectionMenuProps {
    openMain: () => any;
}

const SelectionMenu: React.FC<SelectionMenuProps> = (props) => {
    const { openMain } = props;
    const { dispatch } = useConversationContext();
    const [menuPosition, setMenuPosition] = useState<MenuPosition>({ x: 0, y: 0 });
    const [showSelectionMenu, setShowSelectionMenu] = useState<boolean>(false);
    const [selectionMenuActiveKey, setSelectionMenuActiveKey] = useState<string | undefined>(undefined);
    const [selectionText, setSelectionText] = useState<string>('');
    const isSelectionXiaoMingRef = useRef(false);
    const isMouseDownXiaoMingRef = useRef(false);
    const isMouseDown = useRef(false);
    const selectedRange = useRef<Range | null>(null);
    const [mouseDownCoord, setMouseDownCoord] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const onTextSelected = useCallback(
        (text: string) => {
            dispatch({
                type: 's_selected',
                payload: {
                    selectText: text
                }
            });
        },
        [dispatch]
    );

    useEffect(() => {
        const second = debounce(() => {
            const selection = window.getSelection();
            const selectionText = selection?.toString().trim();
            if (selection && selectionText && !isSelectionXiaoMingRef.current && !isMouseDownXiaoMingRef.current) {
                setSelectionText(selectionText);
                onTextSelected(selectionText);

                const range = selection.getRangeAt(0);
                selectedRange.current = range;
                const rect = range.getBoundingClientRect();
                const position = { x: rect.left, y: rect.top };
                const size = { width: rect.width, height: rect.height };

                setMenuPosition({
                    x: position.x + size.width / 2,
                    y: position.y + size.height + 5
                });

                setShowSelectionMenu(true);
            } else {
                selectedRange.current = null;
            }
        }, 500);

        const onClickOutside = () => {
            dispatch({
                type: 's_cancel'
            });
        };
        const isInShadowRoot = (element: any) => {
            if (element?.id === '_ml_xm_container') {
                return true;
            }
            return false;
        };

        // isSelectionXiaoMingRef 只在 mouse-move 里设置
        const handleMouseMove = debounce((e: MouseEvent) => {
            const ret = isInShadowRoot(e?.target);
            // 处于按下状态，并且是从插件视图外移动到插件视图时，取消选中
            if (ret) {
                if (!isMouseDownXiaoMingRef.current && isMouseDown.current) {
                    const selection = window.getSelection();
                    selection?.removeAllRanges();
                }
                isSelectionXiaoMingRef.current = true;
            } else {
                isSelectionXiaoMingRef.current = false;
            }
        }, 50);
        // 只在 mouse-move 的时候设置了 isMouseDownXiaoMingRef
        const handleMouseDown = (e: MouseEvent) => {
            isMouseDown.current = true;
            setMouseDownCoord({
                x: e.clientX,
                y: e.clientY
            });

            const ret = isInShadowRoot(e?.target);
            if (ret) {
                if (!isMouseDownXiaoMingRef.current && selectedRange.current) {
                    // 上次选中非弹窗区域文本，并且点前点击处于弹窗时，重新设置选中范围
                    const selection = window.getSelection();
                    selection?.removeAllRanges();
                    selection?.addRange(selectedRange.current);
                }
                isMouseDownXiaoMingRef.current = true;
            } else {
                isMouseDownXiaoMingRef.current = false;
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            isMouseDown.current = false;
            const { x, y } = mouseDownCoord;
            const { clientX = 0, clientY = 0 } = e || {};
            if (Math.abs(x - clientX) < 3 && Math.abs(y - clientY) < 3) {
                onClick(e);
            }
        };

        const onClick = (e: MouseEvent) => {
            const isClickExtension = (e?.target as any)?.id === '_ml_xm_container';
            // 点击插件内部，不触发取消
            if (isClickExtension) {
                return;
            }

            if ((e?.target as any)?.classList) {
                onClickOutside();
            }

            setShowSelectionMenu(false);
            setSelectionMenuActiveKey(undefined);
        };

        // todo 后面有时间调整成 monica 一样的方式 flex + transform 的方式
        const onScroll = () => {
            setShowSelectionMenu(false);
            setSelectionMenuActiveKey(undefined);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('selectionchange', second);
        document.addEventListener('scroll', onScroll);

        return () => {
            document.removeEventListener('selectionchange', second);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('scroll', onScroll);
        };
    }, [setShowSelectionMenu, setSelectionMenuActiveKey, onTextSelected, dispatch, mouseDownCoord]);

    const onSelectionItemClick = useCallback(
        (key: string) => {
            openMain();
            dispatch({
                type: 's_action',
                payload: {
                    selectAction: key,
                    selectText: selectionText
                }
            });
        },
        [dispatch, openMain, selectionText]
    );

    const [_, setSelectionSwitch] = useSelectionSwitch();
    const onCloseSelection = () => {
        setSelectionSwitch(false);
    };

    const selectionMenuItems: CollapseProps['items'] = [
        {
            key: '0',
            label: <SelectionMenuItem first data={SELECTION_ACTIONS[0]} onClick={onSelectionItemClick} />,
            children: (
                <>
                    {SELECTION_ACTIONS.slice(1).map((i) => (
                        <SelectionMenuItem key={i.key} data={i} onClick={onSelectionItemClick} />
                    ))}
                </>
            )
        }
    ];
    return (
        <div
            className={classNames(styles.selectionMenu, { [styles.selectionMenuHide]: !showSelectionMenu })}
            style={{
                left: `${menuPosition.x}px`,
                top: `${menuPosition.y}px`,
                right: 'auto',
                bottom: 'auto'
            }}>
            <Collapse
                items={selectionMenuItems}
                activeKey={selectionMenuActiveKey}
                onChange={setSelectionMenuActiveKey as any}
                className={styles.menu}
                bordered={false}
                collapsible="icon"
                expandIcon={(panelProps) => {
                    const { isActive } = panelProps;
                    return (
                        <span className={styles.switchIcon} style={{ rotate: `${isActive ? 180 : 0}deg` }}>
                            <Icon component={ArrowIcon} className={styles.icon} />
                        </span>
                    );
                }}
                expandIconPosition="end"
                ghost
                size="small"
            />
            <div className={styles.closeBox}>
                <div className={styles.closeIcon} onClick={onCloseSelection}>
                    <Icon component={CloseIcon} className={styles.icon} />
                </div>
            </div>
        </div>
    );
};

export default SelectionMenu;
