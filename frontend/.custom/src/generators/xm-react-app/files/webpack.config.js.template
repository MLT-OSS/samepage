const { composePlugins } = require('@nx/webpack');

const { xmWithNx } = require('../../webpack/nx/xm-with-nx');
const { xmWithReact } = require('../../webpack/nx/xm-with-react');
const { withXm } = require('../../webpack/with-xm');

// Nx plugins for webpack.
module.exports = composePlugins(xmWithNx(), xmWithReact(), withXm());
