import React, { memo } from 'react';
import { Handle } from 'react-flow-renderer';
import { validate } from './validator';

export default memo(({ data, isConnectable }) => {
    const [layerNum, setLayerNum] = React.useState("");

    const onChange = (event) => {
        if (/^[0-9]*$/.test(event.target.value)) {
            setLayerNum(event.target.value);
        } else {
            event.preventDefault();
        }
    }

    // TODO preview things
    return (
        <div className="react-flow__node-input" style={{ width: 300 }}>
            <div>
                From: {data.path}
            </div>
            <input
                type="text" pattern="[0-9]*"
                onChange={onChange}
                value={layerNum}
            />
            <Handle
                type="source"
                position="right"
                id="layers"
                isValidConnection={validate}
                style={{ top: 10, background: '#555' }}
                isConnectable={isConnectable}
            />
        </div>
    );
});