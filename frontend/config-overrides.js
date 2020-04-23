const { addWebpackPlugin, override } = require('customize-cra');
const webpack = require('webpack');

const getConfig = () => {
	if (process.env.TARGET === 'master') {
		return {
			AUTH_ENABLED: JSON.stringify(true),
			CLIENT_ID: JSON.stringify('18959773684-qhlp5932liqqbncg9tjf9o3h78dskjle.apps.googleusercontent.com'),
			API_URL: JSON.stringify('/graphql')
		};
	}

	if (process.env.TARGET === 'prod') {
		return {
			AUTH_ENABLED: JSON.stringify(true),
			CLIENT_ID: JSON.stringify('none'),
			API_URL: JSON.stringify('/graphql')
		};
	}

	if (process.env.TARGET !== undefined) {
		return {
			AUTH_ENABLED: JSON.stringify(false),
			CLIENT_ID: JSON.stringify('none'),
			API_URL: JSON.stringify('/graphql')
		};
	}

	return {
		AUTH_ENABLED: JSON.stringify(true),
		CLIENT_ID: JSON.stringify('561207995036-g3g2jjd7af267q2q7vfb8tdqhahkn0f8.apps.googleusercontent.com'),
		API_URL: JSON.stringify('http://localhost:4000/graphql')
	};
};

const definePlugin = new webpack.DefinePlugin({ ...getConfig() });

module.exports = override(
	addWebpackPlugin(definePlugin)
);
