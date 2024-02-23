import { GetUserAuditTenantResponse } from '@/ytt-type/user';
import useRequest from '@ahooksjs/use-request';
import { Loading } from '@xm/components';
import services from '@xm/services';
import { useNavigate } from 'react-router-dom';
/**
 * 完善企业信息 wrapper
 *
 * 在系统内点击“开通企业账号”会跳转到该页面
 * 根据用户是否正在申请租户跳转到完善信息表单页/正在申请中结果页
 */
export const PrefectCorpInfoWrapper = () => {
    const navigate = useNavigate();
    useRequest(services.user.getApproveStatus, {
        manual: false,
        onSuccess: (res: GetUserAuditTenantResponse) => {
            if (res.status === 'PENDING') {
                navigate('/corp-register/result', {
                    state: {
                        resultType: 'APPLYING',
                        userinfo: {
                            corpId: res.tenantId,
                            corpName: res.tenantName
                        }
                    }
                });
            } else if (res.status === 'APPROVED') {
                // 申请中
                navigate('/corp-register/result', {
                    state: {
                        resultType: 'CURRENT_CORP',
                        corpInfo: {
                            corpId: res.tenantId,
                            corpName: res.tenantName
                        }
                    }
                });
            } else {
                navigate('/prefect-corp-info');
            }
        },
        onError: () => {
            navigate('/prefect-corp-info');
        }
    });
    return <Loading />;
};
