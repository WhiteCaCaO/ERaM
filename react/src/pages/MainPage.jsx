import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import MainProfile from '../components/Profile/MainProfile';
import Story from '../components/Story/Story';
import SideBar from '../components/SideBar';
import '../styles/Pages/MainPage.scss';
import SearchBar from '../components/SearchBar';
import UserService from '../service/UserService';
import { getPosts } from '../service/PostService';
import SearchContext from '../utils/SearchContext';
import store from '../store';

function MainPage() {
	const { UserStore } = store();
	const [posts, setPosts] = useState([]);
	const { pageNum } = useParams(); // 페이징 처리용
	const { searchKeyword, setSearchKeyword } = useContext(SearchContext); // SearchContext 사용

	useEffect(() => {
		async function fetchUserId() {
			try {
				const userData = await UserService.getCurrentUser();
				UserStore.setName(userData.name);
				UserStore.setEmail(userData.email);
				if (userData.profile !== null) {
					UserStore.setImgSrc(userData.profile);
				}
			} catch (error) {
				console.error('Failed to fetch user data:', error);
			}
		}

		async function fetchPosts() {
			try {
				const response = await getPosts();
				setPosts(response.data || []);
			} catch (error) {
				console.error('Failed to fetch posts:', error);
			}
		}

		fetchUserId();
		fetchPosts();
	}, [UserStore]);

	return (
		<div className="main_cpn">
			<Story posts={posts} pageNum={pageNum} searchKeyword={searchKeyword} />
			<div className="Mainpage__rightContainer">
				<MainProfile />
				<SearchBar setSearchKeyword={setSearchKeyword} /> {/* 검색 키워드 설정 함수 전달 */}
				<SideBar />
			</div>
		</div>
	);
}

export default MainPage;
