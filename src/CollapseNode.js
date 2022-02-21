import React, { memo, useState, useMemo } from 'react';

import { Handle, Position } from 'react-flow-renderer';
import { validate } from './validator';

// I guess since every input is the same we
export default memo(({ data, isConnectable }) => {
    const [inputCount, setInputCount] = useState("2");

    const onChange = (event) => {
        if (/^[0-9]*$/.test(event.target.value)) {
            setInputCount(event.target.value);
        } else {
            event.preventDefault();
        }
    }

    const handles = useMemo(
        () =>
            Array.from({ length: parseInt(inputCount) }, (x, i) => {
                return (
                    <Handle
                        key={`handle-${i}`}
                        type="target"
                        position={Position.Left}
                        id={`sampled-${i}`}
                        style={{ top: 10 * i + 10 }}
                        isValidConnection={validate}
                        isConnectable={isConnectable}
                    />
                );
            }),
            [inputCount, isConnectable]
        );

    return (
        <div className="react-flow__node-default" style={{ height: Math.max(40, isNaN(parseInt(inputCount)) ? 0 : parseInt(inputCount) * 10 - 10) }}>
            <div>
                Collapse layers
            </div>
            <input
                style={{ width: 100 }}
                type="text" pattern="[0-9]*"
                onChange={onChange}
                value={inputCount}
            />
            <Handle
                type="source"
                position="right"
                id="sampled"
                isValidConnection={validate}
                style={{ top: 10, background: '#555' }}
                isConnectable={isConnectable}
            />
            {handles}
        </div>
    );
});