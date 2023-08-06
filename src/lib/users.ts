import { Settings } from './models';

export const authenticateAdminKey = async (key: string) => {
	const auth = await Settings.findOne({}, {oneTimeAdminLoginKey:1});
	if (auth && auth.oneTimeAdminLoginKey === key) return true;
	return false;
};

