import pubSub from '../../pubSub.js';
import handleUpload from '../../handleUpload.js';
import {sign} from '../../lib/jwt.js';
import db from '../db.js';
import transaction from '../../lib/transaction.js';

export default {
	Mutation: {
		async echo(parent, {message}) {
			await pubSub.publish('ECHO', message);
			return message;
		},
		upload(_, {files}) {
			return Promise.all(files.map(handleUpload));
		},
		jwtSign(_, {name, email}) {
			return sign({name, email});
		},
		async saveFile(_, {path, file}, {name, email}) {
			if (!name || !email) throw new Error('not authenticated');
			const {createReadStream} = await file;
			await transaction(async () => {
				await db.setUser(name, email);
				await db.save(path, createReadStream());
			});
			return true;
		},
		async save(_, {path, data}, {name, email}) {
			if (!name || !email) throw new Error('not authenticated');
			await transaction(async () => {
				await db.setUser(name, email);
				await db.save(path, data);
			});
			return true;
		},
		async mkdir(_, {path}, {name, email}) {
			if (!name || !email) throw new Error('not authenticated');
			await transaction(async () => {
				await db.setUser(name, email);
				await db.mkdir(path);
			});
			return true;
		},
		async rmdir(_, {path}, {name, email}) {
			if (!name || !email) throw new Error('not authenticated');
			await transaction(async () => {
				await db.setUser(name, email);
				await db.rmdir(path);
			});
			return true;
		},
		async rm(_, {path}, {name, email}) {
			if (!name || !email) throw new Error('not authenticated');
			await transaction(async () => {
				await db.setUser(name, email);
				await db.rm(path);
			});
			return true;
		},
		async cp(_, {fromPath, toPath}, {name, email}) {
			if (!name || !email) throw new Error('not authenticated');
			await transaction(async () => {
				await db.setUser(name, email);
				await db.cp(fromPath, toPath);
			});
			return true;
		},
		async mv(_, {fromPath, toPath}, {name, email}) {
			if (!name || !email) throw new Error('not authenticated');
			await transaction(async () => {
				await db.setUser(name, email);
				await db.mv(fromPath, toPath);
			});
			return true;
		}
	}
};