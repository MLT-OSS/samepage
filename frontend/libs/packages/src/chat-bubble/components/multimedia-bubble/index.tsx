import { Row } from 'antd';
import { CHAT_BUBBLE } from '@/types';
import { Markdown } from '@xm/components';

type MultimediaBubbleProps = Pick<CHAT_BUBBLE.ChatBubbleProps, 'data' | 'files'> & {
    onHanleShowPreviewImage: (data: any) => any;
};

export const MultimediaBubble: React.FC<MultimediaBubbleProps> = (props) => {
    const { data, files = [], onHanleShowPreviewImage } = props;

    return (
        <>
            <Markdown data={data as string} />
            {files?.length > 0 && files[0].type === 'video' && (
                <div style={{ paddingTop: 8 }}>
                    <video style={{ maxHeight: 351, maxWidth: 372 }} controls>
                        <source src={files[0]?.value?.tempUrl || files[0]?.value?.downloadUrl} type="video/mp4" />
                    </video>
                </div>
            )}
            {files?.length > 0 && files[0].type === 'image' && (
                <Row style={{ paddingTop: 8 }}>
                    {files.map((item: any, key: any) => {
                        return (
                            <div className="image-preview" key={item?.value?.objId + '_' + key}>
                                <div
                                    className="img-box"
                                    onClick={() =>
                                        onHanleShowPreviewImage({
                                            id: 'messageId',
                                            url: item?.value?.tempUrl || item?.value?.downloadUrl,
                                            imageTotal: 'imgTotal',
                                            disableAction: '123'
                                        })
                                    }>
                                    <img
                                        className="img"
                                        src={item?.value?.tempUrl || item?.value?.downloadUrl}
                                        alt=""
                                    />
                                </div>
                            </div>
                        );
                    })}
                </Row>
            )}
        </>
    );
};
