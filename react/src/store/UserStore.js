import { observable } from 'mobx';
import profile from '../public/profile.jpg';

const UserStore = observable({
	id: '',
	name: '',
	email: '',
	description: '',
	mobile: '',
	imgSrc: profile,

	setId(id) {
		this.id = id;
	},
	setName(name) {
		this.name = name;
	},
	setEmail(email) {
		this.email = email;
	},
	setDescription(description) {
		this.description = description;
	},
	setMobile(mobile) {
		this.mobile = mobile;
	},
	setImgSrc(imgSrc) {
		this.imgSrc = imgSrc;
	},
	reset() {
		this.id = '';
		this.name = '';
		this.email = '';
		this.description = '';
		this.mobile = '';
		this.imgSrc = profile;
	},
});

export default UserStore;
