import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainProfile from '../Profile/MainProfile';
import Story from '../Story/Story';
import SideBar from '../SideBar';
import '../../styles/Pages/MainPage.scss';
import SearchBar from '../SearchBar';

import store from '../../store';

function PostList() {
	const { UserStore } = store();
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		async function fetchUserId() {
			await fetch(`https://elice-server.herokuapp.com/mypage/${localStorage.getItem('id')}`, {
				method: 'GET',
			})
				.then((res) => res.json())
				.then((result) => {
					UserStore.setNickname(result.data.nickname);
					UserStore.setEmail(result.data.id);
					if (result.data.profile !== null) {
						UserStore.setImgSrc(result.data.profile);
					}
				});
		}

		async function fetchPosts() {
			await fetch('https://example.com/posts')
				.then((res) => res.json())
				.then((data) => {
					setPosts(data.posts);
				});
		}

		fetchUserId();
		fetchPosts();
	}, []);

	return (
		<div className="main_cpn">
			<Story />
			<div className="Mainpage__rightContainer">
				<MainProfile />
				<SearchBar />
				<SideBar />
				<ul>
					{posts.map((post) => (
						<li key={post.id}>
							<Link to={`/posts/${post.id}`}>{post.title}</Link> - 작성일: {post.createdAt}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default PostList;
