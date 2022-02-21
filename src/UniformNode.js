import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';
import { validate } from './validator';

export default memo(({ data, isConnectable }) => {
    return (
        <div className="react-flow__node-default">
            <div>
                Uniform sampling
            </div>
            <Handle
                type="source"
                position="right"
                id="sampled"
                isValidConnection={validate}
                style={{ top: 10, background: '#555' }}
                isConnectable={isConnectable}
            />
            <Handle
                type="target"
                position="left"
                id="layers"
                isValidConnection={validate}
                style={{ top: 10, background: '#555' }}
                isConnectable={isConnectable}
            />
        </div>
    );
});