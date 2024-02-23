/**
 * 会话相关的 Context
 */
import React, { ReactNode, useContext, useReducer } from 'react';
import { calcConversationPermissionByType, calcFloatMenuPermission } from '@xm/permission';
import { CONV_CONTEXT } from 'types/conv-context';

type IUserInfo = CONV_CONTEXT.IUserInfo;
type IUserSetting = CONV_CONTEXT.IUserSetting;
type IModelInfo = CONV_CONTEXT.IModelInfo;
type IRobotDict = CONV_CONTEXT.IRobotDict;

// i_*: info 相关
// s_*: select 相关
// l_*: list 数据相关
// p_*: page 页面数据相关
type TType =
    | 'i_user_setting_poll_time_id'
    | 'i_quick_action_prompt'
    | 'i_userinfo'
    | 'i_user_setting'
    | 'i_model_info'
    | 'i_robot_dict'
    | 'i_robot_side_bar'
    | 'i_robot_side_bar_set'
    | 'i_doc_chat_header_click_count'
    | 'i_main_layout_key'
    | 's_selected'
    | 's_action'
    | 's_cancel'
    | 's_page_cancel'
    | 's_flag'
    | 's_switch'
    | 's_clear'
    | 'p_layout_version_info_popup_show'
    | 'p_all_visibility_state'
    | 'p_robot_unauth_show'
    | 'p_pre_setting_show'
    | 'redirect_conv'
    | 'clean_redirect_conv'
    | 'clean_conversation'
    | 'clean_template_conv'
    | 'clean';

interface IUserState {
    userSettingPollTimerId?: NodeJS.Timer | null;
}

interface IConvState {
    robotUnauthShow?: boolean;
}
interface IChatConvState {
    // 存 select 相关数据
    selectAction?: string; // 选择的操作
    selectText: string; // 选中的文本
    selectTextToShow: string; // 展示的选中文本
    selectFlag?: boolean; // 选择权限
    selectSwitch?: boolean; // 选择开关
    // 快捷操作 propmpt map
    quickActionPrompt?: { [k: string]: string };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ITemplateConvState {}

type IState = IUserState &
    IConvState &
    IChatConvState &
    ITemplateConvState & {
        // 用户信息
        userinfo?: IUserInfo;
        // 用户设置信息
        userSetting?: IUserSetting;
        // 版本不兼容展示标志位
        layoutVersionInfoPopupShow?: 'force' | 'soft';
        // 页面可见性
        allVisibilityState?: Document['visibilityState'] | 'first';
        // 当前模型信息
        modelInfo?: IModelInfo;
        // 机器人字典
        robotDict?: IRobotDict;
        // 会话跳转信息
        redirectConvInfo?: { path: string; options: any } | null;
        // sidebar侧边栏机器人List
        sidebarList?: string[];
        // sidebar侧边栏机器人set结构
        sidebarListSet?: Set<string>;
        // doc chat header logo 点击次数
        docChatHeaderClickCount?: number;
        // mainLayoutKey 用于全局”刷新“
        mainLayoutKey?: string;
        // 预设置
        preSettingShow?: boolean;
    };

interface IAction {
    type: TType;
    payload?: Partial<IState>;
}

const initUserState: IUserState = { userSettingPollTimerId: null };

const initConvState: IConvState = {};

const initConversationState: IChatConvState = {
    selectText: '',
    selectTextToShow: '',
    selectFlag: false,
    selectSwitch: false,
    quickActionPrompt: undefined
};

const initTemplateConvState: ITemplateConvState = {};

const initState: IState = {
    ...initUserState,
    ...initConvState,
    ...initConversationState,
    ...initTemplateConvState,
    layoutVersionInfoPopupShow: undefined,
    allVisibilityState: 'first',
    modelInfo: undefined,
    redirectConvInfo: null,
    robotDict: {} as any,
    sidebarList: [],
    sidebarListSet: new Set([]),
    docChatHeaderClickCount: 0,
    robotUnauthShow: false,
    mainLayoutKey: undefined,
    preSettingShow: false
};

// eslint-disable-next-line complexity
const reducer = (state: IState, action: IAction) => {
    const { payload } = action;
    switch (action.type) {
        case 'i_user_setting_poll_time_id':
            return {
                ...state,
                userSettingPollTimerId: payload?.userSettingPollTimerId
            };
        case 'i_quick_action_prompt':
            return {
                ...state,
                quickActionPrompt: payload?.quickActionPrompt
            };
        case 'i_userinfo':
            return {
                ...state,
                userinfo: payload?.userinfo
            };
        case 'i_user_setting':
            return {
                ...state,
                userSetting: payload?.userSetting
            };
        case 'i_model_info':
            return {
                ...state,
                modelInfo: payload?.modelInfo
                    ? {
                          ...(payload?.modelInfo || {}),
                          feFeature: calcConversationPermissionByType(
                              payload.modelInfo.type as any,
                              payload.modelInfo.feature as any,
                              payload.modelInfo.featureConfig as any
                          )
                      }
                    : undefined
            };
        case 'i_robot_dict':
            console.log('更新 robotDict', payload?.robotDict?.botVersion);
            return {
                ...state,
                robotDict: {
                    ...(payload?.robotDict || {}),
                    floatMenuFeature: calcFloatMenuPermission(payload?.robotDict?.floatMenu)
                } as any
            };
        case 'i_robot_side_bar':
            return {
                ...state,
                sidebarList: payload?.sidebarList
            };
        case 'i_robot_side_bar_set':
            return {
                ...state,
                sidebarListSet: payload?.sidebarListSet
            };
        case 'i_doc_chat_header_click_count':
            return {
                ...state,
                docChatHeaderClickCount: payload?.docChatHeaderClickCount
            };
        case 'i_main_layout_key':
            return {
                ...state,
                mainLayoutKey: payload?.mainLayoutKey
            };
        case 's_selected':
            return {
                ...state,
                selectAction: undefined,
                selectText: payload?.selectText || '',
                selectTextToShow: payload?.selectText || ''
            };
        case 's_action':
            return {
                ...state,
                selectAction: payload?.selectAction,
                selectText: payload?.selectText || '',
                selectTextToShow: payload?.selectText || ''
            };
        case 's_cancel':
            return {
                ...state,
                selectAction: undefined,
                selectText: '',
                selectTextToShow: ''
            };
        case 's_page_cancel':
            return {
                ...state,
                selectTextToShow: ''
            };
        case 's_clear':
            return {
                ...state,
                selectAction: undefined,
                selectText: '',
                selectTextToShow: ''
            };
        case 's_flag':
            return {
                ...state,
                selectFlag: !!payload?.selectFlag
            };
        case 's_switch':
            return {
                ...state,
                selectSwitch: !!payload?.selectSwitch
            };
        case 'p_layout_version_info_popup_show':
            return {
                ...state,
                layoutVersionInfoPopupShow: payload?.layoutVersionInfoPopupShow
            };
        case 'p_all_visibility_state':
            return {
                ...state,
                allVisibilityState: payload?.allVisibilityState
            };
        case 'p_robot_unauth_show':
            return {
                ...state,
                robotUnauthShow: payload?.robotUnauthShow
            };
        case 'p_pre_setting_show':
            return {
                ...state,
                preSettingShow: payload?.preSettingShow
            };
        case 'redirect_conv':
            return {
                ...state,
                redirectConvInfo: payload?.redirectConvInfo
            };
        case 'clean_redirect_conv':
            return {
                ...state,
                redirectConvInfo: null
            };
        case 'clean_conversation':
            return {
                ...state,
                ...initConversationState
            };
        case 'clean_template_conv':
            return {
                ...state,
                ...initTemplateConvState
            };
        case 'clean': {
            return {
                ...initState
            };
        }
        default:
            return state;
    }
};

interface ConversationContextValue {
    conversationState: IState;
    dispatch: React.Dispatch<IAction>;
}

const ConversationContext = React.createContext<ConversationContextValue>({} as any);

export const ConversationProvider = ({ children }: { children: ReactNode }) => {
    const [conversationState, dispatch] = useReducer(reducer, initState);
    return (
        <ConversationContext.Provider value={{ conversationState, dispatch }}>{children}</ConversationContext.Provider>
    );
};

export const useConversationContext = () => {
    const context = useContext(ConversationContext);
    if (!context) {
        throw new Error('useConversationContext 必须在 ConversationProvider 中使用');
    }
    return context;
};
