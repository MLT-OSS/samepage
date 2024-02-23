import styles from './index.module.less';

export interface INavBarProps {
    children?: React.ReactNode;
    leftIcon?: React.ReactNode;
    leftContent?: React.ReactNode;
    rightIcon?: React.ReactNode;
    rightContent?: React.ReactNode;
}

// TODO: 左边也需要同理右边
export const NavBar = (props: INavBarProps) => {
    const { leftIcon, leftContent, rightIcon, rightContent, children } = props;

    return (
        <div className={styles.navBar}>
            <div className={styles.left}>
                {leftIcon && <div className={styles.leftIcon}>{leftIcon}</div>}
                {leftContent && <div className={styles.leftContent}>{leftContent}</div>}
                {/* 居中 ？？ */}
                {children && !leftIcon && rightIcon && (
                    <div className={styles.leftIcon} style={{ opacity: 0 }}>
                        {rightIcon}
                    </div>
                )}
            </div>
            <div className={styles.content}>{children}</div>
            <div className={styles.right}>
                {rightContent && <div className={styles.rightContent}>{rightContent}</div>}
                {children && !rightContent && leftContent && (
                    <div className={styles.rightContent} style={{ opacity: 0 }}>
                        {leftContent}
                    </div>
                )}
                {rightIcon && <div className={styles.rightIcon}>{rightIcon}</div>}
                {children && !rightIcon && leftIcon && (
                    <div className={styles.rightIcon} style={{ opacity: 0 }}>
                        {leftIcon}
                    </div>
                )}
            </div>
        </div>
    );
};
