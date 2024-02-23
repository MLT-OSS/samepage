import { Button, Col, Divider, Row } from 'antd';

interface Props {
    total: number;
    toCreate: () => void;
}

const TableHeader = (props: Props) => {
    return (
        <>
            <div className="table-header">
                <div className="table-header-title">我的助手({props.total})</div>
                <div>
                    <Button className="table-header-btn" onClick={() => props.toCreate()}>
                        新建助手
                    </Button>
                </div>
            </div>
            <Divider style={{ margin: '2px 0' }} />
        </>
    );
};

export default TableHeader;
