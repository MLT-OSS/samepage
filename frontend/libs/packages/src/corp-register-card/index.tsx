/**
 * 企业注册卡片
 *
 * 分为下面 6 中情况：
 * 1. 个人版(未申请过租户)
 * 2. 个人版(已申请过租户)
 * 3. 企业版(当前租户)
 * 4. 企业版(非当前租户)
 * 5. 租户已满
 * 6. 链接失效
 */

import { Button } from 'antd';
import styles from './index.module.less';
import { ReactComponent as LogoIcon } from '@/assets/images/logo-2.svg';
import React, { useEffect, useState } from 'react';
import { CorpMarker } from '../corp-marker';
import { useCorpRegister } from '@xm/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { CORP_REGISTER } from '@/types';
import { LinkRegisterDepartSelect } from '../link-register-depart-select';

interface CorpRegisterCardProps {
    dataSource: 'props' | 'state';
    data?: CORP_REGISTER.ResultLocationState;
    userinfo?: CORP_REGISTER.UserInfo; // userinfo 可以额外传，优先级大于 data.userinfo
    errorMsg?: string;
}

const CorpRegisterInnerCard: React.FC<CorpRegisterCardProps> = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { dataSource, userinfo, errorMsg } = props;
    const data: CORP_REGISTER.ResultLocationState = (dataSource === 'props' ? props.data : location.state) || {};
    const { resultType, inviteType, inviteInfo, inviteParams, userinfo: dataUserInfo } = data;
    const [username, userCorpId, userCorpName, inviteCorpName] = [
        userinfo?.username ?? dataUserInfo?.username,
        userinfo?.corpId ?? dataUserInfo?.corpId,
        userinfo?.corpName ?? dataUserInfo?.corpName,
        inviteInfo?.corpName
    ];
    const { joinCorp, changeCorp, changeAccount, jumpToApp } = useCorpRegister(data);
    // 部门, 对应下面两种 case
    // 1. 链接注册：个人-> 企业
    // 2. 链接注册：非当前企业注册，未登录用户注册，新用户注册的承接页
    const [departId, setDepartId] = useState<string>();

    useEffect(() => {
        // 需要保证每次切换 location state 都重新的挂载和卸载
        console.log('register card 挂载');
        return () => {
            console.log('register card 卸载');
        };
    }, []);

    const onJoinCorp = () => {
        joinCorp({
            key: inviteParams?.inviteKey as string,
            code: inviteParams?.inviteCode,
            departId: departId ?? inviteParams?.inviteDepartId
        });
    };
    const onChangeCorp = () => {
        console.log('退出原租户，加入新租户', inviteParams);
        // 如果来源是 inviteKey 则需要跳转到部门选择页选择部门
        if (inviteParams?.inviteKey) {
            navigate('/corp-register/result', {
                state: {
                    ...data,
                    resultType: 'DEPART_SELECT',
                    inviteType: 'change'
                } satisfies CORP_REGISTER.ResultLocationState
            });
        } else {
            changeCorp({
                key: inviteParams?.inviteKey as string,
                tenantId: userCorpId!,
                code: inviteParams?.inviteCode,
                departId: departId ?? inviteParams?.inviteDepartId
            });
        }
    };
    const onDepartSelectJoinCorp = () => {
        if (inviteType === 'change') {
            changeCorp({
                key: inviteParams?.inviteKey as string,
                tenantId: userCorpId!,
                code: inviteParams?.inviteCode,
                departId: departId ?? inviteParams?.inviteDepartId
            });
        } else {
            onJoinCorp();
        }
    };

    // 个人版
    if (resultType === 'PERSONAL') {
        return (
            <div className={styles.personal}>
                <div className={styles.text} style={{ marginBottom: 24 }}>
                    尊敬的用户 <span className={styles.emphasis}>{username}</span> ：<br /> Samepage助理邀请您加入
                    <span className={styles.emphasis}>【{inviteCorpName}】</span>的企业租户
                </div>
                <LinkRegisterDepartSelect
                    label="选择您要加入的部门："
                    inviteKey={inviteParams?.inviteKey as string}
                    value={departId}
                    onChange={setDepartId}
                    style={{ marginBottom: 40 }}
                />
                <div className={styles.actions}>
                    <Button type="primary" onClick={onJoinCorp}>
                        加入企业租户
                    </Button>
                    <Button type="link" onClick={changeAccount}>
                        使用其他账号加入
                    </Button>
                </div>
            </div>
        );
    }

    // 申请中
    if (resultType === 'APPLYING') {
        return (
            <div className={styles.applying}>
                <div className={styles.text} style={{ marginBottom: 84 }}>
                    您有一个申请加入<span className={styles.emphasis}>【{userCorpName}】</span>
                    的请求等待审核，请联系企业租户管理员进行处理，请在审批完成后，前往Samepage进行操作。
                </div>
                <div className={styles.actions}>
                    <Button type="primary" onClick={jumpToApp}>
                        使用个人版
                    </Button>
                </div>
            </div>
        );
    }

    // 企业租户(非当前)
    if (resultType === 'CORP') {
        return (
            <div className={styles.corp}>
                <div className={styles.text} style={{ marginBottom: 74 }}>
                    尊敬的 <span className={styles.emphasis}>{username}</span>
                    ，由于您已加入<span className={styles.emphasis}>【{userCorpName}】</span>企业租户，无法再次加入
                    <span className={styles.emphasis}>【{inviteCorpName}】</span>企业企业租户。
                    <br />
                    <br />
                    您是否退出原租户，并加入<span className={styles.emphasis}>【{inviteCorpName}】</span>企业租户？
                </div>
                <div className={styles.warning} style={{ marginBottom: 24 }}>
                    请慎重考虑，退出租户操作不可逆！
                </div>
                <div className={styles.actions}>
                    <Button type="primary" size="large" onClick={onChangeCorp}>
                        退出原租户，加入新租户
                    </Button>
                    <Button type="link" size="large" onClick={changeAccount}>
                        使用其他账号加入
                    </Button>
                </div>
            </div>
        );
    }

    // 企业租户（当前）
    if (resultType === 'CURRENT_CORP') {
        return (
            <div className={styles.currentCorp}>
                <div className={styles.text} style={{ marginBottom: 84 }}>
                    您的账号已加入过<span className={styles.emphasis}>【{inviteCorpName}】</span>
                    的企业租户，无需再次加入
                </div>
                <div className={styles.actions}>
                    <Button type="primary" onClick={jumpToApp}>
                        开始使用
                    </Button>
                    <Button type="link" onClick={changeAccount}>
                        使用其他账号加入
                    </Button>
                </div>
            </div>
        );
    }

    // 租户已满
    if (resultType === 'FULL_CORP') {
        return (
            <div className={styles.fullCorp}>
                <div className={styles.text} style={{ marginBottom: 54 }}>
                    由于<span className={styles.emphasis}>【{inviteCorpName}】</span>
                    企业租户已达到账号数目限制，您暂时无法加入租户，请联系管理员开通更多账号，开通后，请重新进行操作。
                </div>
                <div className={styles.actions}>
                    <Button type="primary" onClick={jumpToApp}>
                        开始使用
                    </Button>
                </div>
            </div>
        );
    }

    // 需要管理员审核
    if (resultType === 'NEED_TO_APPROVAL') {
        return (
            <div className={styles.needToApproval}>
                <div className={styles.text} style={{ marginBottom: 120 }}>
                    您加入租户的申请正在等待管理员审批…
                </div>
                <div className={styles.actions}>
                    <Button type="primary" onClick={jumpToApp}>
                        使用个人版
                    </Button>
                </div>
            </div>
        );
    }

    // 链接失效
    if (resultType === 'INVALID_LINK') {
        return (
            <div className={styles.invalidLink}>
                <div className={styles.text} style={{ marginBottom: 153 }}>
                    链接已失效，请联系管理员
                </div>
                <LogoIcon className={styles.img} />
            </div>
        );
    }

    // 选择部门
    if (resultType === 'DEPART_SELECT') {
        return (
            <div className={styles.departSelect}>
                <LinkRegisterDepartSelect
                    label="选择您要加入的部门后，即可加入企业租户"
                    inviteKey={inviteParams?.inviteKey as string}
                    value={departId}
                    onChange={setDepartId}
                    style={{ marginBottom: 40 }}
                />
                <div className={styles.actions}>
                    <Button type="primary" onClick={onDepartSelectJoinCorp}>
                        加入企业租户
                    </Button>
                </div>
            </div>
        );
    }

    // 兜底错误
    return (
        <div className={styles.errorPage}>
            <div className={styles.text} style={{ marginBottom: 153 }}>
                {errorMsg || '网络连接异常'}
            </div>
            <LogoIcon className={styles.img} />
        </div>
    );
};

export const CorpRegisterCard: React.FC<CorpRegisterCardProps> = (props) => (
    <div className={styles.corpRegisterCard}>
        <CorpMarker />
        <CorpRegisterInnerCard {...props} />
    </div>
);
