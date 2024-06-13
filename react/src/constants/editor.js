export const formats = [
	'font',
	'header',
	'bold',
	'italic',
	'underline',
	'strike',
	'blockquote',
	'list',
	'bullet',
	'indent',
	'link',
	'align',
	'color',
	'background',
	'size',
	'image',
];

export const modules = {
	toolbar: {
		container: [
			[{ font: [] }],
			[{ size: ['small', false, 'large', 'huge'] }],
			[{ align: [] }],
			['bold', 'italic', 'underline', 'strike'],
			[{ list: 'ordered' }, { list: 'bullet' }],
			[{ color: [] }, { background: [] }],
			['image'],
		],
	},
};
