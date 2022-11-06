import {verify} from '../../lib/jwt.js';
import db from '../db.js';

export default {
	Query: {
		hello() {
			return 'hello';
		},
		jwtVerify(_, {token}) {
			return verify(token);
		},
		read(_, {path}) {
			return db.cat(path);
		}
	}
};