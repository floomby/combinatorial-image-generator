exports.validate = (connection) => connection.sourceHandle.split("-")[0].split(",").some(x => connection.targetHandle.split("-")[0].split(",").includes(x));

// exports.nodes = new Map();
// exports.connections = [];