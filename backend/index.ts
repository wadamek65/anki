import mongoose from 'mongoose';

import * as config from './config.json';
import { app } from './src/apollo';

(async () =>
	await mongoose.connect(config.db.host, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}))();

app
	.listen({ port: 4000 }, () => {
		console.log(`Server started at http://localhost:4000`);
	});
