import database from '$lib/database';
import { categoriesModel, smartModel, Admin } from '$lib/models';
import bcrypt from 'bcryptjs';
import countries from '$lib/assets/countries.json';
import { authenticateAdmin, generateJWT } from '$lib/users';

await database.connect();
export const POST = async ({ request, cookies }: any) => {
	const body = await request.json();
	if (body.adminLogin) {
		const { username, password } = body;
		let response: any = { message: '', status: 0, admin: false };
		if (username !== '' && password !== '') {
			let admin = await Admin.findOne({ username });
			if (!admin) {
				admin = await Admin.findOne({ email: username });
			}
			if (admin) {
				if (bcrypt.compareSync(password, admin.password)) {
					const a = {
						username: admin.username,
						email: admin.email,
						avatar: admin.avatar,
						_id: admin._id
					};
					const jwt = generateJWT(a);
					response = { message: 'successfully logged!', admin: { ...a, jwt }, status: 1 };
				} else response = { message: 'Username password is incorrect!', status: 0 };
			} else response = { message: 'Username or email is incorrect try again!', status: 0 };
		} else
			response = { message: 'Authentication is not correct please check it again!', status: 0 };

		return new Response(JSON.stringify(response), { status: 200 });
	}
	// Above code run without authenticating admin.
	
	// let authenticated = await authenticateAdmin(
	// 	cookies.get('admin'),
	// 	request.headers.get('admin_key')
	// );
	// if (!authenticated) {
	// 	cookies.delete('admin');
	// 	return new Response(
	// 		JSON.stringify({
	// 			message: 'Admin Authentication Failed!',
	// 			success: 0,
	// 			error: 'unauthenticated_user'
	// 		})
	// 	);
	// }
	return new Response(
		JSON.stringify({ message: "Don't try to access api without authorization!" }),
		{ status: 401 }
	);
};
export const GET = async ({ url, cookies, request }: any) => {
	let authenticated = await authenticateAdmin(
		cookies.get('admin'),
		request.headers.get('admin_key')
	);
	if (!authenticated) {
		cookies.delete('admin');
		return new Response(
			JSON.stringify({
				message: 'Admin Authentication Failed!',
				success: 0,
				error: 'unauthenticated_user'
			})
		);
	}
	if (url.searchParams.get('getCountries'))
		return new Response(JSON.stringify(countries), { status: 200 });

	if (url.searchParams.get('checkUsername')) {
		return new Response(
			JSON.stringify({
				exist: (await Admin.findOne(
					{ username: url.searchParams.get('username') },
					{ username: 1 }
				))
					? 1
					: 0
			}),
			{ status: 200 }
		);
	}
	if (url.searchParams.get('smart_device')) {
		let cats = [];
		const item: any = await smartModel.findOne(
			{ _id: url.searchParams.get('_id') },
			{
				_id: 0,
				title: 0,
				category: 0,
				image: 0,
				integrity: 0,
				createdAt: 0,
				isActive: 0
			}
		);
		if (Number(url.searchParams.get('getCats')))
			cats = await categoriesModel.find({}, { image: 0 }).lean();
		return new Response(JSON.stringify({ item, cats }), { status: 200 });
	}
};
