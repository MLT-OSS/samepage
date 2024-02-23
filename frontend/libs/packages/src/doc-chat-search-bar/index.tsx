import styles from './index.module.less';
import { ReactElement, useEffect, useState } from 'react';
import { Button, Input, Spin, Upload, UploadProps, message } from 'antd';
import { ReactComponent as SearchIcon } from '@/assets/images/doc/search.svg';
import pdfSrc from '@/assets/images/doc/pdf.svg';
import delSrc from '@/assets/images/doc/del.svg';
import { ReactComponent as ArrowIcon } from '@/assets/images/doc/arrow.svg';
import cl from 'classnames';
import services from '@xm/services';
import useRequest from '@ahooksjs/use-request';
import { GetDocListResponse } from '@/ytt-type/conversation';
import { formatFileSize } from '@/utils';
import { ReactComponent as LoadingSrc } from '@/assets/images/loading.svg';
import { ReactComponent as CollapseIcon } from '@/assets/images/collapse.svg';
import Icon from '@ant-design/icons';
import { Empty, openConfirmModal } from '@xm/components';

interface SearchProps {
    uploadDisabed: boolean;
    loading: boolean;
    checkoutDocId: string;
    fileList: GetDocListResponse;
    fileListChange?: (fileList: GetDocListResponse) => void;
    onChange?: (id: string) => void;
    selectFile: (file: File) => void;
    onDeleteEmpty: () => void;
}
let initFiles: GetDocListResponse = [];
let checkedIndex = -1;

export const DocChatSearchBar: React.FC<SearchProps> = ({
    uploadDisabed = false,
    loading,
    fileList = [],
    checkoutDocId,
    fileListChange,
    onChange,
    selectFile,
    onDeleteEmpty
}) => {
    const [inputValue, setInputValue] = useState();
    const [collapsed, setCollapsed] = useState(false);
    const [checkedId, setCheckedId] = useState<string>('');
    const [emptyTxt, setEmptyTxt] = useState<ReactElement>(
        <>
            尚无内容，
            <br />
            请上传您的第一份文件。
        </>
    );
    const [localFileList, setLocalFileList] = useState<GetDocListResponse>([]);

    const { run: deleteFile } = useRequest(services.docChat.deleteFile, {
        manual: true,
        onSuccess: (res, params) => {
            const arr = [...localFileList];
            const findIdx = arr.findIndex((item) => params[0].docId === item.docId);
            arr.splice(findIdx, 1);
            if (fileListChange) fileListChange([...arr]);
            message.success('删除成功');

            if (params[0].docId === checkedId) {
                if (!arr.length) {
                    onDeleteEmpty();
                    return;
                }
                let changeId = '';
                if (checkedIndex === arr.length) {
                    checkedIndex = checkedIndex - 1;
                    changeId = arr[checkedIndex].docId;
                } else {
                    changeId = arr[checkedIndex].docId;
                }
                if (changeId && onChange) onChange(changeId);
            }
        }
    });
    const isGt50M = (f: File) => {
        if (f.size / 1024 / 1024 > 50) {
            const msg = '只能上传 50M 以内的文件';
            message.error({ key: msg, content: msg });
            return true;
        }
        return false;
    };
    const uploadprops: UploadProps = {
        name: 'file',
        showUploadList: false,
        accept: 'application/pdf',
        beforeUpload: (file) => {
            if (isGt50M(file)) {
                return;
            }
            selectFile(file);
            return false;
        }
    };
    const handleChange = (id: string, index: number) => {
        if (onChange) onChange(id);
    };

    const handleDel = (e: any, id: string) => {
        e.stopPropagation();
        openConfirmModal({
            title: '删除',
            content: '确定要删除这个档案吗？',
            closable: true,
            onOk() {
                // 删除
                deleteFile({ docId: id });
            }
        });
    };
    const handleInputChange = (e: any) => {
        const { value } = e.target;
        let arr = initFiles;
        if (value.trim() !== '') {
            arr = initFiles.filter((item) => item.name.includes(value));
            setLocalFileList([...arr]);
        } else {
            setLocalFileList([...arr]);
        }
        if (!arr.length) {
            setEmptyTxt(<>暂无搜索结果</>);
        }
    };

    useEffect(() => {
        initFiles = fileList;
        setLocalFileList(initFiles);
        if (checkoutDocId && initFiles.length) {
            setCheckedId(checkoutDocId);
            const index = initFiles.findIndex((item) => item.docId === checkoutDocId);
            if (index > -1) {
                checkedIndex = index;
            }
        } else if (!checkoutDocId) {
            checkedIndex = -1;
            setCheckedId('');
        }
    }, [fileList, checkoutDocId]);
    return (
        <div className={styles['search-bar']}>
            <div className={cl('inner', { collapsed })}>
                <div className="search-box">
                    <Input
                        value={inputValue}
                        className="input"
                        onChange={handleInputChange}
                        placeholder="搜索"
                        prefix={<SearchIcon />}
                        allowClear
                    />
                </div>
                {!loading && localFileList.length ? (
                    <div className="file-list">
                        {localFileList.map((item, index) => (
                            <div
                                className={cl('file-item', { checked: item.docId === checkedId })}
                                key={item.docId}
                                onClick={() => handleChange(item.docId, index)}>
                                <img className="pdf-icon" src={pdfSrc} alt="pdf" />
                                <div className="file-info">
                                    <div className="file-name">{item.name}</div>
                                    <div className="sub-info">
                                        <div className="file-size">{formatFileSize(item.size)}</div>
                                        <div className="time">{item.createDate}</div>
                                    </div>
                                </div>
                                <img
                                    className="del-icon"
                                    onClick={(e: any) => handleDel(e, item.docId)}
                                    src={delSrc}
                                    alt="del"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <></>
                )}
                {loading && (
                    <div className="fullsreen-box">
                        <Spin
                            indicator={<Icon style={{ fontSize: 24 }} className="icon" component={LoadingSrc} spin />}
                        />
                    </div>
                )}
                {!loading && !localFileList.length ? <Empty title={emptyTxt} /> : <></>}
                <div className="bottom-box">
                    <Upload {...uploadprops}>
                        <Button disabled={uploadDisabed} className="upload-btn" type="primary">
                            上传 PDF 文件
                        </Button>
                    </Upload>
                </div>
            </div>
            <div className="collapse-bar" onClick={() => setCollapsed((opened) => !opened)}>
                <ArrowIcon className={cl('icon collapse-icon', { collapsed })} />
                <CollapseIcon />
            </div>
        </div>
    );
};
