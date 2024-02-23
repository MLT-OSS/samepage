import { App, Button, Modal } from 'antd';
import styles from './index.module.less';
import tutorialSrc1 from '@/assets/images/tutorial1.png';
import tutorialSrc2 from '@/assets/images/tutorial2.png';
import tutorialSrc3 from '@/assets/images/tutorial3.png';
import tutorialSrc4 from '@/assets/images/tutorial4.png';
import tutorialSrc5 from '@/assets/images/tutorial5.png';
import tutorialSrc6 from '@/assets/images/tutorial6.png';
import copy from 'copy-to-clipboard';
import React from 'react';

interface ExtInstallGuideModalProps {
    onClose: () => void;
    type: string;
}

export const ExtInstallGuideModal: React.FC<ExtInstallGuideModalProps> = (props) => {
    const { onClose, type } = props;
    const { message } = App.useApp();

    const handleBtnCopy = (url: string) => {
        copy(url);
        message.success('已复制到剪切板');
    };

    return (
        <Modal
            title="安装教程"
            wrapClassName={styles.customModal}
            open
            footer={null}
            width={1040}
            maskClosable={false}
            centered
            onCancel={onClose}>
            {type === 'edge' ? (
                <div className="tutorial-content">
                    <div className="step-item">
                        <img className="img" src={tutorialSrc4} alt="tutorial" />
                        <div className="text-box">
                            <div className="title">1.下载安装文件</div>
                            <div className="desc">
                                下载插件后，如浏览器系统提示请选择【保留】，在下载文件夹中找到下载好的文件，后缀是.crx说明：若提示“无法从该网站添加应用”请点击确定。
                            </div>
                        </div>
                    </div>
                    <div className="step-item">
                        <img className="img" src={tutorialSrc5} alt="tutorial" />
                        <div className="text-box">
                            <div className="title">2.打开扩展程序页面</div>
                            <div className="desc">复制 edge://extensions/ 并粘贴到地址栏，按回车键。</div>
                            <Button
                                size="small"
                                className="copy-btn"
                                type="primary"
                                onClick={() => handleBtnCopy('edge://extensions/')}>
                                一键复制
                            </Button>
                        </div>
                    </div>
                    <div className="step-item">
                        <img className="img" src={tutorialSrc6} alt="tutorial" />
                        <div className="text-box">
                            <div className="title">3.安装插件</div>
                            <div className="desc">
                                在扩展安装页面打开右上角的【开发者模式】按钮，然后刷新页面，将下载好的.crx文件拖入扩展安装页面内，即可完成安装。
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="tutorial-content">
                    <div className="step-item">
                        <img className="img" src={tutorialSrc1} alt="tutorial" />
                        <div className="text-box">
                            <div className="title">1.下载安装文件</div>
                            <div className="desc">
                                下载插件后，如浏览器系统提示请选择【保留】，在下载文件夹中找到下载好的文件，后缀是.crx说明：若提示“无法从该网站添加应用”请点击确定。
                            </div>
                        </div>
                    </div>
                    <div className="step-item">
                        <img className="img" src={tutorialSrc2} alt="tutorial" />
                        <div className="text-box">
                            <div className="title">2.打开扩展程序页面</div>
                            <div className="desc">复制 chrome://extensions 并粘贴到地址栏，按回车键。</div>
                            <Button
                                size="small"
                                className="copy-btn"
                                type="primary"
                                onClick={() => handleBtnCopy('chrome://extensions')}>
                                一键复制
                            </Button>
                        </div>
                    </div>
                    <div className="step-item">
                        <img className="img" src={tutorialSrc3} alt="tutorial" />
                        <div className="text-box">
                            <div className="title">3.安装插件</div>
                            <div className="desc">
                                在扩展安装页面打开右上角的【开发者模式】按钮，然后刷新页面，将下载好的.crx文件拖入扩展安装页面内，即可完成安装。
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};
