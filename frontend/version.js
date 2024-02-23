const { NX_TASK_TARGET_CONFIGURATION, NX_VERSION_VALUE } = process.env;

let _env = '';
switch (NX_TASK_TARGET_CONFIGURATION) {
    case 'development':
        _env = '-开源开发版';
        break;
    case 'test':
        _env = '-开源测试版';
        break;
    default:
        _env = '';
        break;
}

module.exports = `${NX_VERSION_VALUE}${_env}`;
