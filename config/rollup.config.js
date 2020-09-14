import typescript from '@rollup/plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: './lib/src/index.ts',
    plugins: [
        typescript(),
        resolve({ extensions: ['.js', '.ts'] }),
        commonjs({ extensions: ['.js', '.ts'] })
    ],
    output: {
        dir: './lib/dist/router',
        format: 'umd',
        name: 'easyroute'
    }
}