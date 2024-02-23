const prodPlugins = [['import', { libraryName: 'antd-mobile', libraryDirectory: 'es/components', style: false }]];
if (process.env.NX_TASK_TARGET_CONFIGURATION === 'production') {
    prodPlugins.push('transform-remove-console');
}

module.exports = {
    presets: [
        [
            '@nx/react/babel',
            {
                runtime: 'automatic'
            }
        ]
    ],
    plugins: [...prodPlugins]
};
