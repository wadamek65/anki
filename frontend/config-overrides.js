const { addWebpackPlugin, override } = require('customize-cra');
const webpack = require('webpack');

const getConfig = () => {
	if (process.env.TARGET === 'master') {
		return {
			AUTH_ENABLED: JSON.stringify(true),
			CLIENT_ID: JSON.stringify('18959773684-qhlp5932liqqbncg9tjf9o3h78dskjle.apps.googleusercontent.com'),
			API_URL: JSON.stringify('')
		};
	}

	if (process.env.TARGET === 'prod') {
		return {
			AUTH_ENABLED: JSON.stringify(true),
			CLIENT_ID: JSON.stringify(''),
			API_URL: JSON.stringify('')
		};
	}

	if (process.env.TARGET !== undefined) {
		return {
			AUTH_ENABLED: JSON.stringify(false),
			CLIENT_ID: JSON.stringify(''),
			API_URL: JSON.stringify('')
		};
	}

	return {
		AUTH_ENABLED: JSON.stringify(false),
		CLIENT_ID: JSON.stringify(''),
		API_URL: JSON.stringify('http://localhost:4000')
	};
};

const definePlugin = new webpack.DefinePlugin({ ...getConfig() });

module.exports = override(
	addWebpackPlugin(definePlugin)
);
