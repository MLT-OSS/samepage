/**
 * 版本更新信息
 */
import styles from './index.module.less';
import { Button } from 'antd';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import { GetServiceChangelogTypeResponse } from '@/ytt-type/user';
import { useConversationContext } from '@xm/context';
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';
import Icon from '@ant-design/icons';
import { Loading } from '@xm/components';
import { HOME_URL } from '@/utils';

export const UnsupportVersionPopup = () => {
    const {
        dispatch,
        conversationState: { layoutVersionInfoPopupShow }
    } = useConversationContext();
    const { data: serviceInfo, loading } = useRequest<GetServiceChangelogTypeResponse>(services.user.getVersionList, {
        defaultParams: [
            {
                type: 'extension'
            }
        ]
    });
    const onClose = () => {
        dispatch({
            type: 'p_layout_version_info_popup_show',
            payload: {
                layoutVersionInfoPopupShow: undefined
            }
        });
    };

    const isSoftUpdate = layoutVersionInfoPopupShow === 'soft';
    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popup}>
                <div className={styles.header}>
                    {isSoftUpdate && <Icon component={CloseIcon} className={styles.close} onClick={onClose} />}
                </div>
                <div className={styles.popupContent}>
                    {loading ? (
                        <div
                            style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <Loading />
                        </div>
                    ) : (
                        <>
                            <div className={styles['version-box']}>
                                新版本：<span className={styles.version}>v{serviceInfo?.version || '-'}</span>
                            </div>
                            <div className={styles['update-box']}>
                                {(serviceInfo?.changeList || []).map(({ version, updateTime, change = [] }) => {
                                    return (
                                        <div key={version} className={styles['update-item']}>
                                            <div className={styles.version}>v{version}</div>
                                            <div className={styles.time}>更新时间：{updateTime}</div>
                                            <div className={styles['description']}>
                                                <div className={styles.title}>更新内容</div>
                                                <div className={styles['change-list']}>
                                                    {change.map((i, idx) => (
                                                        <div key={idx} className={styles.item}>
                                                            <span className={styles.idx}>{idx + 1}.</span>
                                                            {i}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
                <div className={styles.footer}>
                    <Button
                        type="primary"
                        size="large"
                        style={{ width: '100%' }}
                        onClick={() => {
                            window.open(HOME_URL, '_blank');
                        }}
                        disabled={loading}>
                        立即更新
                    </Button>
                </div>
            </div>
        </div>
    );
};
