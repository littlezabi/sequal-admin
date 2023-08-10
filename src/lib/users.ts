import { Admin, Settings } from './models';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '$env/static/private'


export const authenticateAdminKey = async (key: string) => {
	const auth = await Settings.findOne({}, {oneTimeAdminLoginKey:1});
	if (auth && auth.oneTimeAdminLoginKey === key) return true;
	return false;
};


export const generateJWT = (payload:any) => {
	  const options = {expiresIn: '1d'};
	  return jwt.sign(payload, JWT_SECRET, options);
}

export const verifyJWT = (token:string) => {
	try {
	  const decoded = jwt.verify(token, JWT_SECRET);
	  return decoded;
	} catch (error) {
	  // If the token is invalid or has expired, an error will be thrown
	  return null;
	}
  }
  