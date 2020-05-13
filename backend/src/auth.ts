import { RequestHandler } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { sign, verify } from 'jsonwebtoken';

import * as config from '../config.json';
import { User } from './schemas';

const authClient = new OAuth2Client(config.auth.clientId, config.auth.secretId);

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refresh-token';

export const loginRoute: RequestHandler = async (req, res) => {
	const code = req.header('google-code');
	if (code) {
		// eslint-disable-next-line @typescript-eslint/camelcase
		const token = await authClient.getToken({ code, redirect_uri: `https://${req.hostname}` });
		const ticket = await authClient.verifyIdToken({
			idToken: token.tokens.id_token as string,
			audience: config.auth.clientId
		});
		const payload = ticket.getPayload();
		let userInfo = await User.findOne({ email: payload?.email });

		if (!userInfo) {
			userInfo = await new User({ email: payload?.email, name: payload?.name, avatar: payload?.picture }).save();
		}

		const accessToken = sign({ email: userInfo.email }, config.app.jwtSecret, { expiresIn: '1d' });
		const refreshToken = sign({ email: userInfo.email }, config.app.jwtSecret, { expiresIn: '31d' });

		res.cookie(ACCESS_TOKEN_KEY, accessToken, { httpOnly: true });
		return res.send({ refreshToken });
	}

	res.sendStatus(400);
};

export const refreshTokenRoute: RequestHandler = async (req, res) => {
	const refreshToken = req.header(REFRESH_TOKEN_KEY);
	if (refreshToken) {
		try {
			const { email } = verify(refreshToken, config.app.jwtSecret) as any;
			const accessToken = sign({ email }, config.app.jwtSecret, { expiresIn: '1d' });
			res.cookie(ACCESS_TOKEN_KEY, accessToken, { httpOnly: true });
			return res.send({ refreshToken });
		} catch {
			return res.sendStatus(400);
		}
	}

	res.sendStatus(400);
};

export const authMiddleware: RequestHandler = async (req, res, next) => {
	if (config.app.insecureDisableAuth) {
		const testUser = {
			email: 'senko@mail.com',
			name: 'Senko-san',
			avatar: 'https://i1.sndcdn.com/artworks-000538759875-dixn7z-t500x500.jpg',
			appSettings: { languages: [] }
		};
		(req as any).user = await User.findOne({ email: testUser.email });
		if (!(req as any).user) {
			(req as any).user = await new User(testUser).save();
		}
		return next();
	}

	if (req.originalUrl === '/api/login' || req.originalUrl === '/api/login/refresh') {
		return next();
	}

	try {
		const { email } = verify(req.cookies[ACCESS_TOKEN_KEY], config.app.jwtSecret) as any;
		(req as any).user = await User.findOne({ email });
		next();
	} catch {
		res.clearCookie(ACCESS_TOKEN_KEY);
		res.sendStatus(401);
	}
};
