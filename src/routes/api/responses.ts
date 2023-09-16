export default (
	index?: number | undefined,
	status: number = 200,
	success: number = 0,
	response_obj: any = false
) => {
	const msgs: any = {
		0: 'Slug already exist. sure that you not have same item in db',
		1: 'Failed to save!',
		2: 'Operation success!',
		3: 'Successfully Added!',
		4: 'Slug already exist. make sure that you not have same item in db',
		5: 'Deleted successfully!',
		6: 'Not deleted please try again!'
	};
	let res_obj = {};
	if (response_obj !== false) res_obj = { success, ...response_obj };
	else if (!index) res_obj = { success: 1, message: msgs[2] };
	else res_obj = {success, message: msgs[index]}
	return new Response(JSON.stringify(res_obj), { status });
};
