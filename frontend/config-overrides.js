const { addWebpackPlugin, override, overrideDevServer } = require('customize-cra');
const webpack = require('webpack');

const getConfig = () => {
	if (process.env.TARGET === 'master') {
		return {
			CLIENT_ID: JSON.stringify('18959773684-qhlp5932liqqbncg9tjf9o3h78dskjle.apps.googleusercontent.com'),
			API_URL: JSON.stringify('')
		};
	}

	if (process.env.TARGET === 'prod') {
		return {
			CLIENT_ID: JSON.stringify(''),
			API_URL: JSON.stringify('')
		};
	}

	if (process.env.TARGET !== undefined) {
		return {
			CLIENT_ID: JSON.stringify(''),
			API_URL: JSON.stringify('')
		};
	}

	return {
		CLIENT_ID: JSON.stringify('561207995036-g3g2jjd7af267q2q7vfb8tdqhahkn0f8.apps.googleusercontent.com'),
		API_URL: JSON.stringify('http://localhost:4000')
	};
};

const definePlugin = new webpack.DefinePlugin({ ...getConfig() });

module.exports = {
	webpack: override(addWebpackPlugin(definePlugin)),
	devServer: overrideDevServer(config => ({
		...config,
		proxy: {
			'/graphql': {
				target: 'http://localhost:4000'
			},
			'/api': {
				target: 'http://localhost:4000'
			}
		}
	}))
};
