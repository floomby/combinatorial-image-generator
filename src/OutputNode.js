import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';
import { validate } from './validator';

export default memo(({ data, isConnectable }) => {
    return (
        <div className="react-flow__node-output">
            <div>
                Output
            </div>
            <Handle
                type="target"
                position="left"
                id="sampled"
                isValidConnection={validate}
                style={{ top: 10, background: '#555' }}
                isConnectable={isConnectable}
            />
        </div>
    );
});