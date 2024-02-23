import { useParams } from 'react-router-dom';
import { ChatConversation, ExternalConv, ImageConversation, StatelessConversation, UnsupportConv } from '@xm/packages';

import { useConv, TLanguage, TSetLang } from '@xm/hooks';
import { Loading } from '@xm/components';
import { isFutureSupported } from '@/utils';
import { useConversationContext } from '@xm/context';

interface IConversationProps {
    showPrompt?: boolean;
    langConfig?: {
        lang: TLanguage;
        setLang: TSetLang;
    };
}

export const Conversation = (props: IConversationProps) => {
    const { showPrompt = true, langConfig = null } = props;
    let { type, model } = useParams<{ type: string; model: string }>();
    const {
        conversationState: { modelInfo }
    } = useConversationContext();

    const { type: modelInfoType, key: modelInfoModel } = modelInfo || {};
    // 兼容 url 中午信息的情况 for assistant
    if (!type || !model) {
        type = modelInfoType;
        model = modelInfoModel;
    }

    const { currModel, langOptions, chatConversationInfo, newChatConv, statelessConvInfo, newStatelessConv } = useConv(
        type!,
        model!
    );
    // h5 重写语言设置
    if (langConfig) {
        langOptions.lang = langConfig.lang;
        langOptions.setLang = langConfig.setLang;
    }

    // fixme: 加着一层判断是因为从其他类型切换回来的时候目标会话会挂载两次
    if (currModel.current !== model) {
        return (
            <div
                style={{
                    paddingTop: '32px',
                    textAlign: 'center'
                }}>
                <Loading />
            </div>
        );
    }

    // 先判断是否支持
    if (isFutureSupported(modelInfo as any)) {
        return <UnsupportConv />;
    }

    // 画图
    if (type === 'draw') {
        return <ImageConversation />;
    }

    // 无状态的对话（单轮对话）
    if (type === 'stateless_chat') {
        return (
            <StatelessConversation
                key={statelessConvInfo.key}
                model={model as string}
                newConversation={newStatelessConv}
                options={statelessConvInfo.options || {}}
                langOptions={langOptions}
                showFixed={showPrompt}
            />
        );
    }

    // 有状态的对话（多轮对话）
    if (['chat', 'assistant_chat'].includes(type!)) {
        return (
            <ChatConversation
                key={chatConversationInfo.key}
                model={model as any}
                newConversation={newChatConv}
                options={chatConversationInfo.options || {}}
                langOptions={langOptions}
                showPrompt={showPrompt}
                showFixed={showPrompt}
            />
        );
    }

    if (type === 'external_bot') {
        return <ExternalConv />;
    }

    return <UnsupportConv />;
};
