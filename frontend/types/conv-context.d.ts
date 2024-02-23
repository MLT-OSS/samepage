import { GetDictBotResponse } from '@/ytt-type/robot';
import { GetUserProfileResponse, GetUserProfileSettingsResponse } from '@/ytt-type/user';

export declare namespace CONV_CONTEXT {
    type IUserInfo = GetUserProfileResponse;
    type IUserSetting = GetUserProfileSettingsResponse;
    type IModelInfo = GetDictBotResponse['bot'][0] & {
        feFeature?: { [k: string]: any };
        // state: location state，跳转用
        // todo state 用一个不太通用的 key 命名
        state?: any;
        icon?: string;
    };
    type IRobotDict = GetDictBotResponse & {
        floatMenuFeature?: { [k: string]: boolean };
        botMap?: Map<string, IModelInfo>;
    };
}
