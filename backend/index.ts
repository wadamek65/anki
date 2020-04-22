import * as mongoose from 'mongoose';

import * as config from './config.json';
import { server } from './src/apollo';

(async () =>
	await mongoose.connect(config.db.host, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}))();

server
	.listen()
	.then(({ url }) => {
		console.log(`Server started at ${url}`);
	})
	.catch(err => console.error(err));
