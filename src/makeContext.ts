import parseAuthorization from './lib/parseAuthorization.js';
import {verify} from './lib/jwt.js';

type MakeContextParams = {
	ctx?: any,
	connectionParams?: any
}

export default async ({ctx, connectionParams}: MakeContextParams) => {
	const auth = ctx.get('authorization');
	if (!auth) return {};

	const token = parseAuthorization(ctx.get('authorization'));
	if (token)
		return await verify(token);

	return {};

}