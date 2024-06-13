import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Story/Story.scss';

function Story({ posts, pageNum, searchKeyword }) {
	return (
		<div className="story-page">
			<StoryContent posts={posts} pageNum={pageNum} searchKeyword={searchKeyword} />
		</div>
	);
}

function StoryContent({ posts, searchKeyword }) {
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage] = useState(10);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const query = new URLSearchParams(location.search);
		const page = query.get('page');
		if (page) {
			setCurrentPage(parseInt(page, 10));
		} else {
			setCurrentPage(1);
		}
	}, [location.search]);

	const filteredPosts = searchKeyword
		? posts.filter((post) => post.title && post.title.includes(searchKeyword))
		: posts;

	// Calculate the current posts
	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

	const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
	const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

	const handleClick = (event) => {
		const pageNumber = parseInt(event.target.id, 10);
		setCurrentPage(pageNumber);
		navigate(`?page=${pageNumber}`);
	};

	const renderPageNumbers = pageNumbers.map((number) => (
		<button key={number} id={number} onClick={handleClick} className="pageNav_btn" type="button">
			{number}
		</button>
	));

	return (
		<section className="story_parent">
			<div className="story_container">
				<div className="story_length">
					<span>{filteredPosts.length}개의 게시글</span>
					<FontAwesomeIcon icon={faArrowRotateRight} className="refresh__icon" onClick={() => setCurrentPage(1)} />
				</div>
				<StoryInfo />

				{currentPosts.map((el) => (
					<div className="story" key={el.id}>
						<span className="story_number story_child">{el.id}</span>
						<span className="story_name story_child">{el.name ? el.name : 'Unknown User'}</span>
						<Link to={`/posts/read/${el.id}`}>
							<span className="story_title story_child">
								{el.title.length < 25 ? el.title : `${el.title.slice(0, 25)}...`}
							</span>
						</Link>
						<span className="story_time story_child">{el.regdate ? el.regdate.slice(0, 10) : 'Unknown Date'}</span>
					</div>
				))}
			</div>
			<Link className="writeBtn" to="/posts/writing">
				글쓰기
			</Link>
			<div className="pageNav">
				&lt;
				{renderPageNumbers}
				&gt;
			</div>
		</section>
	);
}

function StoryInfo() {
	return (
		<div className="story storyInfo">
			<span className="story_number story_child">번호</span>
			<span className="story_title story_child">제목</span>
			<span className="story_name story_child">작성자</span>
			<span className="story_time story_child">작성일</span>
		</div>
	);
}

export default StoryContent;
