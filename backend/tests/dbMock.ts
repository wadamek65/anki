import { Mockgoose } from 'mockgoose';
import * as mongoose from 'mongoose';

const mockgoose = new Mockgoose(mongoose);

before(done => {
	mockgoose.prepareStorage().then(() => {
		mongoose.connect('mongodb://test/anki', err => {
			done(err);
		});
	});
});
