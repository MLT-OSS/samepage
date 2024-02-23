/**
 * 链接注册部门选择组件
 */
import { CustomSelect } from '@xm/components';
import styles from './index.module.less';
import Icon from '@ant-design/icons';
import { ReactComponent as OrgIcon } from '@/assets/images/expand.svg';
import { ReactComponent as EmptyIcon } from '@/assets/images/empty.svg';
import { DefaultOptionType } from 'antd/es/select';
import classNames from 'classnames';
import { CSSProperties, useState } from 'react';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import { App } from 'antd';
import { MSG_RESPONSE_ERROR } from '@/constants';
import { getLeafDepartList } from '@/utils';

interface LinkRegisterDepartSelectProps {
    label: string;
    inviteKey: string;
    value: string | undefined;
    onChange: (v: string | undefined) => void;
    className?: string;
    style?: CSSProperties;
}

export const LinkRegisterDepartSelect: React.FC<LinkRegisterDepartSelectProps> = (props) => {
    const { label, inviteKey, style, value, onChange } = props;
    const { message: antdMessage } = App.useApp();
    const [options, setOptions] = useState<DefaultOptionType[]>([]);

    const { loading } = useRequest(services.user.getDepartment, {
        defaultParams: [{ key: inviteKey }],
        throwOnError: true,
        onSuccess: (res) => {
            setOptions(
                getLeafDepartList(res || []).map(({ departId, departName }) => ({
                    label: departName as string,
                    value: departId as string
                }))
            );
        },
        onError: (res: any) => {
            const { statusCode, message } = res?.data?.response || {};
            antdMessage.open({
                key: `${MSG_RESPONSE_ERROR}_${statusCode}`,
                type: 'error',
                content: message
            });
        }
    });

    return (
        <div className={classNames(styles.departSelect, props.className)} style={style}>
            <div className={styles.label}>{label}</div>
            <CustomSelect
                value={value}
                onChange={onChange}
                prefix={<Icon component={OrgIcon} className="select-prefix-icon" type="icon-show-13" />}
                size="large"
                placeholder="请选择您所在部门"
                options={options}
                showSearch
                optionFilterProp="label"
                getPopupContainer={(node) => {
                    return (node?.parentNode ?? document.body) as HTMLElement;
                }}
                notFoundContent={
                    <div className="dropdown-empty-box">
                        <EmptyIcon />
                        <div style={{ marginTop: '4px' }}>暂无数据</div>
                    </div>
                }
                loading={loading}
            />
        </div>
    );
};
