import ReactDOM from 'react-dom';
import React, { useState, useRef } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    removeElements,
    Controls,
    // ControlButton,
    // isEdge,
    // getConnectedEdges
} from 'react-flow-renderer';
// import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

import Sidebar from './sidebar';
import './index.css';

import LayerNode from './LayerNode';
import UniformNode from './UniformNode';
import BindNode from './BindNode';
import OutputNode from './OutputNode';
import CollapseNode from './CollapseNode';

const nodeTypes = {
    layerNode: LayerNode,
    uniformNode: UniformNode,
    bindNode: BindNode,
    outputNode: OutputNode,
    collapseNode: CollapseNode,
};

const { ipcRenderer } = require('electron');
const fs = require('fs');
ipcRenderer.on('render-complete', (event, msg) => {
    console.dir(msg);
});

const initialElements = [];

let id = 0;
const getId = () => `node_${id++}`;

const NodeWorkspace = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [elements, setElements] = useState(initialElements);
    const onConnect = (params) => setElements((els) => addEdge(params, els));
    const onElementsRemove = (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els));

    const onLoad = (_reactFlowInstance) => setReactFlowInstance(_reactFlowInstance);

    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        return false;
    };

    const onDrop = (event) => {
        if (event.dataTransfer.getData('application/reactflow')) {
            event.preventDefault();
            
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');
            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            const newNode = {
                id: getId(),
                type,
                position,
                data: { label: `${type} node` },
            };
            
            setElements((es) => es.concat(newNode));
        } else if (event.nativeEvent && event.nativeEvent.path[0].className === 'react-flow__pane') {
            for (let i = 0; i < event.dataTransfer.items.length; i++) {
                if (event.dataTransfer.items[i].kind === 'file') {
                    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
                    const position = reactFlowInstance.project({
                        x: event.clientX + (i * 10) - reactFlowBounds.left,
                        y: event.clientY + (i * 10) - reactFlowBounds.top,
                    });
                    const path = event.dataTransfer.items[i].getAsFile().path;
                    const newNode = {
                        id: getId(),
                        type: 'layerNode',
                        position,
                        data: { label: 'Layer node', path, files: [] },
                    };
                    const addLayer = (err, files) => {
                        if (err) return console.error(err);
                        newNode.data.files = files;
                        setElements((es) => es.concat(newNode));
                    };

                    if (fs.lstatSync(path).isDirectory()) {
                        fs.readdir(path, addLayer)
                    } else {
                        console.error('Yeah the ux sucks (I will fix this at some point)');
                    }
                }
            }
        }
    };

    const render = () => {
        console.dir(elements);
        ipcRenderer.send('render', { elements });
    };

    return (
        <div className="nodeworkspace">
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        elements={elements}
                        onConnect={onConnect}
                        onElementsRemove={onElementsRemove}
                        onLoad={onLoad}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        nodeTypes={nodeTypes}
                    >
                        <Controls>
                        </Controls>
                    </ReactFlow>
                </div>
                <Sidebar topology={elements} render={render}/>
            </ReactFlowProvider>
        </div>
    );
};

function Viewer() {
    const [width, setWidth] = React.useState(window.innerWidth);
    const [height, setHeight] = React.useState(window.innerHeight);
    
    const updateWidthAndHeight = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };
    
    React.useEffect(() => {
        window.addEventListener("resize", updateWidthAndHeight);
        return () => window.removeEventListener("resize", updateWidthAndHeight);
    });

    const style = {
        height: height,
        width: width 
    };

    return (
        <div style={style}>
            <NodeWorkspace />
        </div>
    );
}

ReactDOM.render(
    <Viewer />,
    document.getElementById('root')
);
