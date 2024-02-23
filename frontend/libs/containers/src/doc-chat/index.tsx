import styles from './index.module.less';
import { Worker } from '@react-pdf-viewer/core';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ReactComponent as ArrowIcon } from '@/assets/images/doc/arrow.svg';
import cl from 'classnames';
import { DocChatSearchBar, DocChatPdfViewer, DocChatUploadBox, ChatConversation } from '@xm/packages';
import type { IDocChatUploadInfo, IRefer } from '@xm/packages';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import { GetDocInfoResponse, GetDocListResponse } from '@/ytt-type/conversation';
import { useConv } from '@xm/hooks';
import packageJson from '../../../../package.json';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { useConversationContext } from '@xm/context';
import { CONV } from 'types/conversation';
import { getQueryString } from '@/utils';
import { ReactComponent as CollapseIcon } from '@/assets/images/collapse.svg';
const pdfjsVersion = packageJson.dependencies['pdfjs-dist'];

let createData: IDocChatUploadInfo | null = null;
export const DocChat: React.FC = () => {
    const {
        conversationState: { docChatHeaderClickCount, modelInfo }
    } = useConversationContext();
    const { chatConversationInfo, newChatConv: _newConversation, langOptions } = useConv('chat', 'gpt3.5');
    const { key: conversationKey, options: conversationOptions } = chatConversationInfo || {};

    const [collapsed, setCollapsed] = useState(false);
    const [showUpload, setShowUpload] = useState(true);
    const [fileList, setFileList] = useState<GetDocListResponse>([]);
    const [fileInfo, setFileInfo] = useState<GetDocInfoResponse>();
    const [initLoading, setInitLoading] = useState(true);
    const [checkedId, setCheckedId] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [uploadDisabed, setUploadDisabed] = useState(false);
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const { jumpToPage } = pageNavigationPluginInstance;
    const onReferClick = useCallback(
        (data: IRefer['reference']['0']) => {
            const page = data?.position?.[0];
            if (page === 0 || page) jumpToPage(page);
        },
        [jumpToPage]
    );
    const currDocInfo = useRef<CONV.IConversationOptions['readDoc']>({});
    const newConversation = useCallback(
        (options?: Partial<CONV.IConversationOptions>) => {
            _newConversation({
                readDoc: currDocInfo.current,
                onReferClick,
                ...(options || {})
            });
        },
        [_newConversation, onReferClick]
    );
    const changeQuery = (id: string) => {
        const pathname = window.location.href.split('?')[0];
        const refresh = pathname + '?docId=' + id;
        window.history.pushState({ path: refresh }, '', refresh);
    };
    const getQueryValue = (name: string) => getQueryString(window.location, name);

    const { run: getFileList } = useRequest(services.docChat.getFileList, {
        manual: true,
        onSuccess: (res: GetDocListResponse) => {
            setFileList(res);
            const docId = getQueryValue('docId');
            if (initLoading && docId) {
                const index = res.findIndex((item) => item.docId === docId);
                if (index > -1) {
                    setTimeout(() => {
                        setCheckedId(docId);
                    }, 100);
                }
            }
            setInitLoading(false);
        },
        onError: () => {
            setInitLoading(false);
        }
    });
    const { run: getFileInfo } = useRequest(services.docChat.getFileInfo, {
        manual: true,
        onSuccess: (res: GetDocInfoResponse) => {
            setFileInfo(res);

            let docInfo = { docId: res.docId, docName: res.name };
            if (createData) {
                docInfo = { ...docInfo, ...createData };
                createData = null;
            }
            currDocInfo.current = { docId: docInfo.docId, docName: docInfo.docName };

            const queryConvId = getQueryValue('conversationId');
            const convId = queryConvId ?? res.recentConversationId ?? undefined;

            newConversation({
                conversationId: convId,
                readDoc: docInfo
            });
            setFile(null);
            setUploadDisabed(false);
            setShowUpload(false);
        },
        onError: (res) => {
            changeUploadPage();
        }
    });
    const handleFileListChange = (fileList: GetDocListResponse) => {
        setFileList([...fileList]);
    };
    const handleFileChange = (id: string) => {
        console.log('修改');
        setCheckedId(id);
        changeQuery(id);
        getFileInfo({ docId: id });
    };
    const handelUploadComplete = (data: IDocChatUploadInfo) => {
        // 刷新会话 刷新list
        console.log('上传完成');
        createData = data;
        setUploadDisabed(false);
        handleFileChange(data.docId);
        getFileList();
    };
    const handleBtnFile = (file: File) => {
        setFile(file);
        changeUploadPage();
    };
    const handleDisabled = (disabled: boolean) => {
        setUploadDisabed(disabled);
    };
    const changeUploadPage = () => {
        setCheckedId('');
        setShowUpload(true);
        const refresh = window.location.href.split('?')[0];
        window.history.pushState({ path: refresh }, '', refresh);
    };
    useEffect(() => {
        if (docChatHeaderClickCount) {
            if (!showUpload) {
                changeUploadPage();
            }
        }
    }, [docChatHeaderClickCount]);

    useEffect(() => {
        getFileList();
        const docId = getQueryValue('docId');
        if (docId) {
            getFileInfo({ docId: docId });
        }
    }, []);

    useEffect(() => {
        window.onpopstate = function (e: PopStateEvent) {
            // 业务逻辑
            console.log('回退');
            const docId = getQueryValue('docId');
            if (docId) {
                setCheckedId(docId);
                setShowUpload(false);
                getFileInfo({ docId: docId });
            } else {
                setCheckedId('');
                setShowUpload(true);
            }
        };
        return () => {
            // 回退事件只用于当前组件，则需要在组件销毁时把回退事件销毁
            window.onpopstate = null;
        };
    }, []);

    return (
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}>
            <div className={styles.docContainer}>
                <DocChatSearchBar
                    uploadDisabed={uploadDisabed}
                    checkoutDocId={checkedId}
                    fileList={fileList}
                    loading={initLoading}
                    fileListChange={handleFileListChange}
                    onChange={handleFileChange}
                    selectFile={handleBtnFile}
                    onDeleteEmpty={changeUploadPage}
                />
                {showUpload ? (
                    <div className="upload-box">
                        <DocChatUploadBox
                            fileData={file}
                            onDisable={handleDisabled}
                            uploadComplete={handelUploadComplete}
                        />
                    </div>
                ) : (
                    <div className="right-box">
                        <DocChatPdfViewer
                            pageNavigationPluginInstance={pageNavigationPluginInstance}
                            fileUrl={fileInfo?.objUrl || ''}
                        />
                        <div className={cl('chat-box', { collapsed })}>
                            <div className="collapse-bar" onClick={() => setCollapsed((opened) => !opened)}>
                                <ArrowIcon className={cl('icon collapse-icon', { collapsed: collapsed })} />
                                <CollapseIcon />
                            </div>
                            <div className="chat">
                                <ChatConversation
                                    key={conversationKey}
                                    model={modelInfo?.key as any}
                                    newConversation={newConversation}
                                    options={conversationOptions!}
                                    langOptions={langOptions}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Worker>
    );
};
