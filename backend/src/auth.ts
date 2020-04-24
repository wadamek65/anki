import { RequestHandler } from 'express';
import { OAuth2Client } from 'google-auth-library';

import * as config from '../config.json';

const authClient = new OAuth2Client(config.auth.clientId, config.auth.secretId);

export const loginRoute: RequestHandler = async (req, res) => {
	const code = req.header('google-code');
	if (code) {
		// eslint-disable-next-line @typescript-eslint/camelcase
		const token = await authClient.getToken({ code, redirect_uri: `https://${req.hostname}` });
		res.cookie('google-id-token', token.tokens.id_token, { httpOnly: true });
		return res.sendStatus(200);
	}

	res.sendStatus(400);
};

export const authMiddleware: RequestHandler = async (req, res, next) => {
	if (config.app.insecureDisableAuth) {
		(req as any).user = {
			email: 'senko@mail.com',
			name: 'Senko-san',
			picture: 'https://i1.sndcdn.com/artworks-000538759875-dixn7z-t500x500.jpg'
		};
		return next();
	}

	if (req.originalUrl === '/api/login') {
		return next();
	}

	try {
		const ticket = await authClient.verifyIdToken({
			idToken: req.cookies['google-id-token'],
			audience: config.auth.clientId
		});
		(req as any).user = ticket.getPayload();
		next();
	} catch {
		res.clearCookie('google-id-token');
		res.sendStatus(401);
	}
};
