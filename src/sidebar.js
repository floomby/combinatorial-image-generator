// import React, { DragEvent } from 'react';

// import { nodes, connections } from "./validator";

const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
};

const connectionsTo = (connections, node) => connections.filter(c => c.target === node);

const checkIfInput = (connections, nodes, node) => {    
    if (nodes.get(node).type === 'layerNode') {
        return true;
    }
    return connectionsTo(connections, node).map(n => n.source).reduce((val, n) => val || checkIfInput(connections, nodes, n), false);
}

const isValidTopology = (topology) => {
    let connections = [];
    let nodes = new Map();
    topology.forEach(x => {
        if (x.hasOwnProperty('type')) {
            nodes.set(x.id, x);
        } else {
                connections.push(x);
        }
    });

    console.dir(connections);

    // check we have 1 output
    let outputs = 0;
    let outputNode = "";
    for(const value of nodes.values()) {
        if (value.type === 'outputNode') {
            outputs++;
            outputNode = value.id;
        }
    }
    if (outputs !== 1) return true;
    // Make sure we have at least one input connected
    if (!checkIfInput(connections, nodes, outputNode)) return true;

    return false;
};

const Sidebar = (props) => {
    // TODO check if we have a valid graph and then set a processing button accordingly

    console.dir(props.topology);
    // Idk if I need this or not
    // connections = [];
    // props.topology.forEach(x => {
    //     if (x.hasOwnProperty("type")) {
    //         nodes.set(x.id, x);
    //     } else {
    //         connections.concat(x);
    //     }
    // });

    return (
        <aside>
            <div className="description">Combinatorial image creator nodes<br/>Drag folders into the workspace to get started</div>
            <div className="react-flow__node-default" onDragStart={(event) => onDragStart(event, 'uniformNode')} draggable>
                Uniform probabilities
            </div>
            <div className="react-flow__node-default" onDragStart={(event) => onDragStart(event, 'bindNode')} draggable>
                Bind layers
            </div>
            <div className="react-flow__node-default" onDragStart={(event) => onDragStart(event, 'collapseNode')} draggable>
                Collapse layers
            </div>
            <div className="react-flow__node-output" onDragStart={(event) => onDragStart(event, 'outputNode')} draggable>
                Output
            </div>
            <button style={{ cursor: 'default' }} onClick={props.render} disabled={isValidTopology(props.topology)}>Render</button>
        </aside>
    );
};

export default Sidebar;