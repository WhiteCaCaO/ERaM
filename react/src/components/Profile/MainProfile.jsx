import React from 'react';
import '../../styles/Profile/MainProfile.scss';
import { Link } from 'react-router-dom';
import UserStore from '../../store/UserStore';
import defaultProfileImage from '../../assets/images/default-profile.png'; // 기본 이미지 경로

function MainProfile({ imgSrc, name, id, email }) {
	const profileImage = imgSrc || defaultProfileImage; // imgSrc가 없으면 기본 이미지 사용

	return (
		<div className="MainProfile">
			<Link to={`/members/get/${id}`} style={{ textDecoration: 'none' }}>
				<img src={profileImage} alt="Profile" />
			</Link>
			<h2>{UserStore.name}</h2>
			<span>{email}</span>
		</div>
	);
}

export default MainProfile;
