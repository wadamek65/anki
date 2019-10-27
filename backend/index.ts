import * as mongoose from 'mongoose';
import { server } from './src/apollo';

(async () => await mongoose.connect('mongodb://localhost/ll', {useNewUrlParser: true, useUnifiedTopology: true}))();

server.listen().then(({url}) => {
	console.log(`Server started at ${url}`)
}).catch(err => console.error(err));
