import { useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AuthService from '../service/AuthService';
import UserStore from '../store/UserStore';

const ModifyProfileFormBlock = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #f0f0f0;
`;

const FormContainer = styled.div`
	width: 100%;
	height: 100%;
	padding: 20px;
	background-color: #fff;
	border-radius: 8px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
	text-align: center;
	font-size: 25px;
`;

const ButtonGroup = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 20px;
	gap: 20px; /* 버튼 사이 간격을 늘리기 위해 추가 */
`;

function ModifyProfileForm() {
	const [mno, setMno] = useState('');
	const [id, setId] = useState('');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [mobile, setMobile] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const navigate = useNavigate();
	const params = useParams();

	const fetchUserData = async () => {
		try {
			setLoading(true);
			const userData = await AuthService.fetchUserData();
			setMno(userData.mno); // mno 필드 설정
			setId(userData.id); // id 필드 설정
			setName(userData.name);
			setEmail(userData.email);
			setMobile(userData.mobile);
			UserStore.setId(userData.id);
			UserStore.setName(userData.name);
			UserStore.setEmail(userData.email);
			UserStore.setDescription(userData.intro);
			UserStore.setMobile(userData.mobile);
			setLoading(false);
		} catch (error) {
			console.error('Failed to fetch user data:', error);
			setError('Failed to fetch user data');
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUserData();
	}, []);

	const handleProfileUpdate = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			await AuthService.updateProfile({
				mno, // mno 필드 추가
				id, // id 필드 추가
				name, // name 필드 추가
				password: newPassword || undefined, // 빈 문자열 대신 undefined 전달
				mobile, // mobile 필드 추가
			});
			// Update UserStore immediately
			UserStore.setName(name);
			UserStore.setMobile(mobile);
			if (newPassword) {
				UserStore.setPassword(newPassword);
			}
			console.log('Profile updated successfully');
			navigate(`/members/get/${UserStore.id}`); // Navigate to the user's page using UserStore.id
		} catch (error) {
			console.error('Profile update failed:', error);
			setError('Profile update failed');
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		navigate(`/members/get/${UserStore.id}`);
	};

	return (
		<ModifyProfileFormBlock>
			<FormContainer>
				<Title>회원 정보 수정</Title>
				<form onSubmit={handleProfileUpdate}>
					<input type="text" placeholder="Mno" value={mno} readOnly /> {/* mno 필드 추가 */}
					<input type="text" placeholder="Id" value={id} readOnly /> {/* id 필드 추가 */}
					<input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
					<input type="email" placeholder="Email" value={email} readOnly />
					<input
						type="password"
						placeholder="New Password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
					/>
					<input type="text" placeholder="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
					<ButtonGroup>
						<button type="submit" disabled={loading}>
							Update Profile
						</button>
						<button type="button" onClick={handleCancel}>
							Cancel
						</button>
					</ButtonGroup>
					{error && <p>{error}</p>}
				</form>
			</FormContainer>{' '}
			{/* 수정된 부분 */}
		</ModifyProfileFormBlock>
	);
}

export default ModifyProfileForm;
