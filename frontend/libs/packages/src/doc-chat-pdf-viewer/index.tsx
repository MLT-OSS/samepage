import styles from './index.module.less';
import { CharacterMap, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import { ToolbarSlot, toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { RenderGoToPageProps, PageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { RenderZoomProps, RenderZoomInProps, RenderZoomOutProps } from '@react-pdf-viewer/zoom';
// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import { useEffect, useState } from 'react';
import { Select, Spin } from 'antd';
import { ReactComponent as LoadingSrc } from '@/assets/images/doc/big-loading.svg';

import enlargeSrc from '@/assets/images/doc/enlarge.svg';
import lowerSrc from '@/assets/images/doc/lower.svg';
import directorySrc from '@/assets/images/doc/directory.svg';
import prevSrc from '@/assets/images/doc/prev-page.svg';
import nextSrc from '@/assets/images/doc/next-page.svg';
import cl from 'classnames';
import Icon from '@ant-design/icons';

interface PdfProps {
    fileUrl: string;
    pageNavigationPluginInstance: PageNavigationPlugin;
}

export const DocChatPdfViewer: React.FC<PdfProps> = ({ fileUrl, pageNavigationPluginInstance }) => {
    const [sidebarOpened, setSidebarOpened] = useState(false);
    const characterMap: CharacterMap = {
        isCompressed: true,
        // The url has to end with "/"
        url: 'https://unpkg.com/pdfjs-dist@2.6.347/cmaps/'
    };
    const thumbnailPluginInstance = thumbnailPlugin();
    const { Thumbnails } = thumbnailPluginInstance;
    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;
    const renderLoader = () => {
        return <Spin indicator={<Icon style={{ fontSize: 32 }} className="icon" component={LoadingSrc} spin />} />;
    };

    useEffect(() => {
        setSidebarOpened(false);
    }, [fileUrl]);
    return (
        <div className={styles['pdf-box']}>
            <div className="pdf-viewer">
                <div className="toolbar">
                    <Toolbar>
                        {(props: ToolbarSlot) => {
                            const {
                                CurrentPageInput,
                                GoToNextPage,
                                GoToPreviousPage,
                                NumberOfPages,
                                Zoom,
                                ZoomIn,
                                ZoomOut
                            } = props;
                            return (
                                <>
                                    <div
                                        className={cl('toolbar-item', { checked: sidebarOpened })}
                                        onClick={() => setSidebarOpened((opened) => !opened)}>
                                        <img src={directorySrc} alt="" />
                                    </div>
                                    <div className="divider" />
                                    <ZoomIn>
                                        {(props: RenderZoomInProps) => (
                                            <div className="toolbar-item" onClick={props.onClick}>
                                                <img src={enlargeSrc} alt="" />
                                            </div>
                                        )}
                                    </ZoomIn>
                                    <ZoomOut>
                                        {(props: RenderZoomOutProps) => (
                                            <div className="toolbar-item" onClick={props.onClick}>
                                                <img src={lowerSrc} alt="" />
                                            </div>
                                        )}
                                    </ZoomOut>
                                    <Zoom>
                                        {(props: RenderZoomProps) => (
                                            <Select
                                                size="small"
                                                className="toolbar-item custom-select"
                                                defaultValue={SpecialZoomLevel.PageWidth}
                                                onChange={props.onZoom}>
                                                <Select.Option value={SpecialZoomLevel.PageWidth}>
                                                    Auto fit
                                                </Select.Option>
                                                <Select.Option value={0.75}>75%</Select.Option>
                                                <Select.Option value={1}>100%</Select.Option>
                                                <Select.Option value={1.2}>120%</Select.Option>
                                                <Select.Option value={1.5}>150%</Select.Option>
                                                <Select.Option value={2}>200%</Select.Option>
                                                <Select.Option value={3}>330%</Select.Option>
                                            </Select>
                                        )}
                                    </Zoom>
                                    <div className="divider" />
                                    <GoToPreviousPage>
                                        {(props: RenderGoToPageProps) => (
                                            <div className="toolbar-item" onClick={props.onClick}>
                                                <img src={prevSrc} alt="" />
                                            </div>
                                        )}
                                    </GoToPreviousPage>
                                    <GoToNextPage>
                                        {(props: RenderGoToPageProps) => (
                                            <div className="toolbar-item" onClick={props.onClick}>
                                                <img src={nextSrc} alt="" />
                                            </div>
                                        )}
                                    </GoToNextPage>
                                    <div className="page-input">
                                        <CurrentPageInput />
                                    </div>
                                    <div className="total-page">
                                        / <NumberOfPages />
                                    </div>
                                </>
                            );
                        }}
                    </Toolbar>
                </div>
                <div className="viewer-box">
                    {sidebarOpened && (
                        <div className="thumbnail">
                            <Thumbnails />
                        </div>
                    )}
                    <div className="viewer-content-wrapper">
                        <div className="viewer-content">
                            <Viewer
                                renderLoader={renderLoader}
                                characterMap={characterMap}
                                defaultScale={SpecialZoomLevel.PageWidth}
                                plugins={[pageNavigationPluginInstance, thumbnailPluginInstance, toolbarPluginInstance]}
                                fileUrl={fileUrl}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
