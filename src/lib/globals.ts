import { bg40Colors, border40Colors } from './constant';

export const life = (__time__: string) => {
	/**
	 * Format Datetime (Created by LittleZabi -> blueterminal Lab )
	 * @param {time} time object
	 * FORMATS:
	 * month formats ~
	 * MM -> full month name e.g March
	 * Mm -> short month name e.g Mar
	 * mm -> month number with zero if month < 10 e.g 03
	 * m -> month number e.g 3
	 * Date formats ~
	 * Do -> Date with ordinal indicators like 1st, 2nd, 3rd, 20th
	 * DD -> Date with zero if Date less then 10 e.g 08
	 * D -> only Date number
	 * Days formats ~
	 * dddd -> Day of the week full like Monday
	 * ddd -> Day of the week only 3 chars like Mon
	 * dd -> Day of the week only 2 chars like Mo
	 * Year formats ~
	 * YYYY -> Full Year like 2023
	 * YY -> only last two numbers like 23
	 */
	let dt = new Date(__time__);
	if (!dt.getDate()) dt = new Date();
	const mF = (_i: number) =>
		'January_February_March_April_May_June_July_August_September_October_November_December'.split(
			'_'
		)[_i];
	const mS = (_i: number) => 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_')[_i];
	const dF = (_i: number) =>
		'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_')[_i];
	const dS = (_i: number) => 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_')[_i];
	const dSx = (_i: number) => 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_')[_i];
	const xd = [dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getDay()];
	return {
		format: (f_: string) => {
			let __: string = f_;
			if (f_.includes('MM')) __ = __.replace('MM', mF(xd[1]));
			if (f_.includes('Mm')) __ = __.replace('Mm', mS(xd[1]));
			if (f_.includes('mm'))
				__ = __.replace(
					'mm',
					xd[1] + 1 < 10 ? '0' + (xd[1] + 1).toString() : (xd[1] + 1).toString()
				);
			if (f_.includes('m')) __ = __.replace('m', (xd[1] + 1).toString());
			if (f_.includes('Do'))
				__ = __.replace(
					'Do',
					xd[2] > 3 ? xd[2].toString() + 'th' : xd[2] === 1 ? '1st' : xd[2] === 2 ? '2nd' : '3rd'
				);
			if (f_.includes('DD'))
				__ = __.replace('DD', xd[2] < 10 ? '0' + xd[1].toString() : xd[1].toString());
			if (f_.includes('D')) __ = __.replace('D', xd[2].toString());
			if (f_.includes('dddd')) __ = __.replace('dddd', dF(xd[3]).toString());
			if (f_.includes('ddd')) __ = __.replace('ddd', dS(xd[3]).toString());
			if (f_.includes('dd')) __ = __.replace('dd', dSx(xd[3]).toString());
			if (f_.includes('YYYY')) __ = __.replace('YYYY', xd[0].toString());
			if (f_.includes('YY')) __ = __.replace('YY', xd[0].toString().substring(2, 4));
			return __;
		},
		from: () => {
			let dn = new Date().getTime();
			let e = dn - dt.getTime();
			if (e < 1000) return 'Just now';
			const s = Math.floor(e / 1000);
			if (s < 60) return `${s} seconds ago`;
			const m = Math.floor(e / (60 * 1000));
			if (m < 60) return `${m} minutes ago`;
			const h = Math.floor(e / (1000 * 60 * 60));
			if (h < 24) return `${h} hours ago`;
			const d = Math.floor(e / (1000 * 60 * 60 * 24));
			if (d < 7) return d === 1 ? `24 hours ago` : `${d} days ago`;
			if (d <= 30) return `${Math.floor(d / 7)} week ago`;
			const mo = Math.floor(d / 30);
			if (mo >= 1 && mo < 12) return mo > 1 ? `${mo} months ago` : `1 month ago`;
			if (mo === 12) return '1 year ago';
			const moy = Math.floor((e % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
			const y = Math.floor(e / (1000 * 60 * 60 * 24 * 365));
			if (moy === 0) return `${y} yrs ago`;
			return `${y} ${y === 1 ? 'years' : 'years'} and ${moy} months ago`;
		},
		dayPortion: () => {
			let a = '';
			let b = '';
			let curTime = dt.getHours();
			a =
				curTime >= 2 && curTime < 12
					? 'morning'
					: curTime >= 12 && curTime <= 18
					? 'afternoon'
					: 'evening';
			a = `Good ${a}!`;
			b =
				curTime >= 0 && curTime < 1
					? 'Midnight'
					: curTime >= 1 && curTime < 2
					? 'Middle of the night'
					: curTime >= 2 && curTime < 6
					? 'Early morning'
					: curTime >= 6 && curTime < 8
					? 'Dawn'
					: curTime >= 8 && curTime < 9
					? 'Morning'
					: curTime >= 9 && curTime < 12
					? 'Late morning'
					: curTime >= 12 && curTime < 13
					? 'Noon'
					: curTime >= 13 && curTime < 14
					? 'Afternoon'
					: curTime >= 14 && curTime < 17
					? 'Late afternoon'
					: curTime >= 17 && curTime < 18
					? 'Dusk'
					: curTime >= 18 && curTime < 19
					? 'Early evening'
					: curTime >= 19 && curTime < 21
					? 'Evening'
					: curTime >= 21 && curTime < 23
					? 'Late evening'
					: 'Night';
			return [a, b];
		}
	};
};
export const trimTitle = (
	title: string,
	minchars = 20,
	lastchars = 7,
	midchars = "..."
  ) => {
	const _len = title.length;
	if (_len < minchars) return title;
	let _ = "";
	if (_len > minchars + lastchars) {
	  _ = title.substring(0, minchars);
	  _ = _ + midchars + title.substring(_len - lastchars, _len);
	} else _ = title;
	return _;
  };
export const chartDatasetOptions = () => {
	return {
		backgroundColor: bg40Colors,
		borderColor: border40Colors,
		borderRadius: 2,
		borderWidth: 2
	};
};

export const setUserCharName = (name: string) => {
  const k = name.split(" ");
  let n = "";
  k.map((e, i) => e ? (i < 2 ? (n += e[0]) : "") : '');
  if (n === "") n = name[0];
  return n.toUpperCase();
};
export const chartOptions = (title: any, xaxis: any, yaxis: any): {} => {
	return {
		options: {
			// scale: {
			// 	ticks: {
			// 	  beginAtZero: true
			// 	}
			//   },
			responsive: true,
			beginAtZero: false,
			plugins: {
				legend: {
					position: 'top'
				},
				filler: {
					propagate: true
				}
			},
			interaction: {
				intersect: true
			},

			scales: {
				// r: {
				// 	beginAtZero: true
				//   },
				x: {
					display: xaxis,
					beginAtZero: true,
					grid: {
						color: '#73737333'
					},
					ticks: {
						color: '#9b9b9b',
						font: { size: 15, transform: 'uppercase', family: 'consolas' }
					}
				},
				y: {
					display: Object.keys(yaxis).length > 0 ? true : false,
					beginAtZero: true,
					ticks: {
						display: true,
						color: '#9b9b9b',
						font: { size: 16, family: 'consolas' }
					},

					grid: {
						color: '#73737333'
					},
					title: {
						display: true,
						text: title,
						color: '#9b9b9b',
						font: { size: 18 }
					},
					...yaxis
				}
			}
		}
	};
};

export const numberFormat = (__num__: number) => {
	return __num__ >= 1000000
		? (__num__ / 1000000).toFixed(1) + 'M'
		: __num__ >= 1000
		? (__num__ / 1000).toFixed(1) + 'k'
		: __num__.toString();
};

export const alterNumberFormat = (number: number) => {
	const match = numberFormat(number).match(/^(\d+\.?\d*)(.*)$/);
	if (match) return { counts: parseFloat(match[1]), postfix: match[2] };
	else return { counts: number, postfix: '' };
};

export const getRandomColor = (
	transparency: number = 0.1,
	obj: any = false,
	number_of_colors: any = 0,
	borderTransparency: number = 1
): any => {
	let borderColor = [];
	let backgroundColor = [];
	if (number_of_colors === 0) number_of_colors = 1;
	for (let i = 0; i < number_of_colors; i++) {
		const r = Math.ceil(Math.random() * (bg40Colors.length - 1));
		backgroundColor.push(bg40Colors[r].replace('0.5', String(transparency)));
		borderColor.push(bg40Colors[r].replace('0.5', String(borderTransparency)));
	}
	if (obj) return { backgroundColor, borderColor };
	else return backgroundColor[0];
};