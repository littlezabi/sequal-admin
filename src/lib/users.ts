import { Admin, Settings } from './models';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export const authenticateAdminKey = async (key: string) => {
	const auth = await Settings.findOne({}, { oneTimeAdminLoginKey: 1 });
	if (auth && auth.oneTimeAdminLoginKey === key) return true;
	return false;
};

export const authenticateAdmin = async (admin: any = false, admin_key = false) => {
	const confirm = admin || admin_key
	if (!confirm) return 0;
	if (admin) {
		if (typeof admin === 'string') admin = JSON.parse(admin);
		return verifyJWT(admin.jwt) ? true : false;
	}
	if (admin_key) {
		const auth = await Settings.findOne({}, { oneTimeAdminLoginKey: 1 });
		if (auth && auth.oneTimeAdminLoginKey === admin_key) return true;
		return false;
	}
	return false;
};

export const generateJWT = (payload: any, options = {}) =>
	jwt.sign(payload, JWT_SECRET, { expiresIn: '1d', ...options });

export const verifyJWT = (token: string) => {
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		return decoded;
	} catch (error) {
		// If the token is invalid or has expired, an error will be thrown
		return null;
	}
};
