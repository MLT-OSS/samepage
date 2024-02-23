import useRequest from '@ahooksjs/use-request';
import { Button } from 'antd';
import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import services from '@xm/services';
import { abortRequest } from '@/utils';

export const Demo = () => {
    const abortId = useRef<string>();

    const { run: getRobotDict } = useRequest(services.robot.getRobotDict, {
        manual: true
    });

    const sendReq = () => {
        const uid = uuidv4();
        abortId.current = uid;
        console.log('发请求', uid);
        // getRobotDict(uid);
    };
    const pauseReq = () => {
        console.log('中止请求', abortId.current);
        abortRequest(abortId.current);
    };
    return (
        <div>
            <h1>Demo</h1>
            <Button onClick={sendReq}>发请求</Button>
            <Button onClick={pauseReq}>中止请求</Button>
        </div>
    );
};
