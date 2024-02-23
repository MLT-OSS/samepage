import React, { useEffect, useMemo, useRef, useState } from 'react';

import { setSessionValue, getSessionValue } from '@/utils';
import { STORAGE_ENTRY_POSITION } from '@/constants';

import styles from './index.module.less';

interface IMoveWapperProps {
    disabled: boolean;
    children?: any;
}

const EntryMoveWapper = (props: IMoveWapperProps) => {
    const [positionY, setPositionY] = useState(100);
    const [clickY, setClickY] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const wapperRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (event: any) => {
        if (props.disabled) return;
        event.preventDefault();
        setDragging(false);
        setIsHover(true);

        const refTop = wapperRef?.current?.getBoundingClientRect().top ?? 0;

        const shiftY = event.clientY - refTop;

        setClickY(shiftY);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (event: any) => {
        event.stopPropagation();
        setDragging(true);

        const windowHeight = window?.innerHeight;
        const wapperHeight = wapperRef?.current?.clientHeight ?? 40;

        const _newY = event.clientY - clickY + wapperHeight;

        const newY = Math.max(Math.min(_newY, windowHeight), 0);

        setPositionY(newY);
        setSessionValue({
            key: STORAGE_ENTRY_POSITION,
            value: newY
        });
    };

    const handleMouseUp = () => {
        setIsHover(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };
    const topPosition = useMemo(() => {
        const windowHeight = window?.innerHeight;
        if (windowHeight && positionY < windowHeight / 2) {
            return true;
        }
        return false;
    }, [positionY]);

    useEffect(() => {
        (async () => {
            const _position = await getSessionValue(STORAGE_ENTRY_POSITION);
            setPositionY(_position as number);
            setIsLoading(false);
        })();
    }, []);
    useEffect(() => {
        if (props.disabled) {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    }, [props.disabled]);
    return !isLoading ? (
        <div
            ref={wapperRef}
            className={styles['move-wapper']}
            style={{ bottom: `max(0px, min(calc(100vh - 40px), calc(100vh - ${positionY}px)))` }}
            onMouseDown={handleMouseDown}
            onDragStart={(e) => e.preventDefault()}>
            {React.Children.map(props.children, (child) => {
                return React.cloneElement(child, {
                    onClick: dragging
                        ? () => {
                              /** empty func */
                          }
                        : child?.props?.onClick,
                    dataMove: isHover ? 'move' : 'none',
                    dataTop: topPosition ? 'position-top' : 'position-bottom'
                });
            })}
        </div>
    ) : (
        <></>
    );
};

export default EntryMoveWapper;
