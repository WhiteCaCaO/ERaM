import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import ImgModal from '../ImgModal';
import AuthService from '../../service/AuthService';
import UserService from '../../service/UserService';
import defaultProfileImage from '../../assets/images/default-profile.png';
import postImage from '../../assets/images/post.png';
import chatImage from '../../assets/images/chat.png';
import '../../styles/Profile/MyPageProfile.scss';
import UserStore from '../../store/UserStore';

function MyPageProfile({ userId, onComponentChange }) {
	const [edit, setEdit] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [mouseEnter, setMouseEnter] = useState(false);
	const [user, setUser] = useState({ name: '', description: '', imgSrc: '' });

	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const userData = await UserService.getCurrentUser();
				setUser({
					name: userData.name,
					description: userData.intro,
					imgSrc: userData.imgSrc || defaultProfileImage,
				});
				if (userId === userData.id) {
					setIsAdmin(true);
				}
			} catch (error) {
				console.error('Failed to fetch user data:', error);
			}
		};

		fetchUserData();
	}, [userId]);

	const openModal = () => {
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
	};

	const handleName = (e) => {
		setUser({ ...user, name: e.target.value });
	};

	const handleDescription = (e) => {
		setUser({ ...user, description: e.target.value });
	};

	const toggleEdit = () => {
		setEdit((prevEdit) => !prevEdit);
	};

	const onMouseEnter = () => {
		setMouseEnter(true);
	};

	const onMouseLeave = () => {
		setMouseEnter(false);
	};

	const handleDeleteAccount = async () => {
		if (window.confirm('정말 탈퇴하시겠습니까?')) {
			try {
				await AuthService.deleteAccount();
				alert('계정이 성공적으로 삭제되었습니다.');
				navigate('/main');
			} catch (error) {
				console.error('Failed to delete account:', error);
				alert('계정 삭제에 실패했습니다.');
			}
		}
	};

	const handleButtonClick = (component) => {
		console.log(`Button clicked: ${component}`);
		if (typeof onComponentChange === 'function') {
			onComponentChange(component);
		}
	};

	return (
		<div className="MyPageProfile__profile">
			<div className="MyPageProfile__container__left" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
				{isAdmin ? (
					<>
						<img src={user.imgSrc} alt="profile" onClick={openModal} className="AdminProfile" />
						{mouseEnter && <FontAwesomeIcon icon={faPen} className="Profile__icon" />}
					</>
				) : (
					<img src={user.imgSrc || defaultProfileImage} alt="profile" />
				)}
			</div>
			<ImgModal
				open={modalOpen}
				close={closeModal}
				imgSrc={user.imgSrc}
				setImgSrc={(imgSrc) => setUser({ ...user, imgSrc })}
				name={user.name}
				description={user.description}
			/>
			<div className="MyPageProfile__container__right">
				<div className="description">
					<span>{user.name || '닉네임'} 님</span>
					{isAdmin ? (
						edit ? (
							<textarea onChange={handleDescription} placeholder={user.description} value={user.description} />
						) : (
							<p>{user.description}</p>
						)
					) : (
						<p>{user.description}</p>
					)}
					<div className="button-group">
						<button type="button" onClick={() => handleButtonClick('Credit')}>
							충전하기
						</button>
						<Link to={`/modify/${user.name}`}>
							<button type="button">회원수정</button>
						</Link>
						<button type="button" onClick={handleDeleteAccount}>
							회원탈퇴
						</button>
					</div>
				</div>
			</div>
			<div className="MyPageProfile__container__right2">
				<div className="button-group">
					<div className="items">
						<img src={postImage} alt="mylist" className="iconImage" />
						<button type="button" onClick={() => handleButtonClick('MyStory')}>
							게시글
						</button>
					</div>
					<div className="items">
						<img src={chatImage} alt="mychat" className="iconImage" />
						<button type="button" onClick={() => handleButtonClick('MyChat')}>
							채팅방
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MyPageProfile;
