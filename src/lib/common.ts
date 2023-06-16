import { bg40Colors, border40Colors } from './constant';

export const chartDatasetOptions = () => {
	return {
		backgroundColor: bg40Colors,
		borderColor: border40Colors,
		borderRadius: 2,
		borderWidth: 2
	};
};

export const chartOptions = (title: any, xaxis: any, yaxis: any): {} => {
	return {
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: 'top'
				},
				filler: {
					propagate: false
				}
			},
			interaction: {
				intersect: false
			},
			scales: {
				x: {
					display: xaxis,
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
					beginAtZero: false,
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

export const getRandomColor = (transparent: boolean = true, obj:any = false):{}|any => {
	const r = Math.ceil(Math.random() * (bg40Colors.length - 1));
	if (obj) {
		return { backgroundColor: bg40Colors[r], borderColor: border40Colors[r] };
	}
	return transparent ? bg40Colors[r] : border40Colors[r];
};
