export const headersToString = (headers:string[], len=5, sep = '\n') => {
	let h = '';
	headers.map((e: string, i: number) => {
		if (e !== '') {
			if (i + 1 >= headers.length) h += e;
			else {
				if (i + 1 >= len) h += e;
				else h += e + sep;
			}
		}
	});
    return h
};

export const handleHeadersArea = (values:any, len:number) => {
    values = values.target.value.trim().split('\n')
    let res: any = [];
    let message:boolean | string = false
    for (let t of values) if (!res.includes(t.trim()) && t !== '') res.push(t.trim());
    res = res.slice(0, len);
    if (values.length > len) message = `headers limit is ${len} we can't add more.`
    return {res, message}
};