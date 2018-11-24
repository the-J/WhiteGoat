var nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'production',
    entry: './index.js',
    target: 'node',
    externals: [
        nodeExternals(),
        { pg: true }
    ],
    node: {
        fs: 'empty'
    },
    output: {
        filename: './build/bundle.js'
    }
};
