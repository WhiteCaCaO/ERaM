import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Pages/Writing.scss';
import ReactQuill from 'react-quill';
import store from '../store';
import { modules, formats } from '../constants/editor';
import { createPost } from '../service/PostService';

export default function Writing() {
	return <WriteContent />;
}

function WriteContent() {
	const { UserStore } = store();
	const navigate = useNavigate();
	const titleRef = useRef(null);
	const quillRef = useRef(null);
	const [content, setContent] = useState('');
	const endDateRef = useRef(null);
	const [numberOfUsers, setNumberOfUsers] = useState('');
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchUser = () => {
			try {
				const userJson = localStorage.getItem('user');
				const currentUser = userJson ? JSON.parse(userJson) : null;
				console.log('로그인유저: ', currentUser);
				setUser(currentUser);
			} catch (error) {
				console.error('Failed to load user info:', error);
			}
		};

		fetchUser();
	}, []);

	// 커서 문제로 주석처리
	// useEffect(() => {
	// 	if (quillRef.current) {
	// 		const quill = quillRef.current.getEditor();
	// 		quill.on('text-change', () => {
	// 			const range = quill.getSelection();
	// 			if (range && range.index === quill.getLength() - 1) {
	// 				quill.setSelection(range.index - 1, range.length);
	// 			}
	// 		});
	// 	}
	// }, [quillRef]);

	function handleNumberOfUsersChange(e) {
		const num = e.target.value;
		if (num === '' || /^\d+$/.test(num)) {
			setNumberOfUsers(num);
		}
	}

	function storySubmit(e) {
		if (!user) {
			alert('사용자 정보를 불러오는 중 오류가 발생했습니다. 다시 로그인 해주세요.');
			return;
		}
		e.preventDefault();
		if (endDateRef.current.value === '') {
			alert('끝나는 날짜를 선택해주세요.');
			return;
		}

		if (titleRef.current.value.length === 0) {
			alert('제목을 입력해주세요.');
			return;
		}
		if (content.length === 0) {
			alert('내용을 입력해주세요.');
			return;
		}
		if (numberOfUsers === '') {
			alert('방 인원을 입력해주세요.');
			return;
		}
		// content 길이 확인 (65535 바이트 이하로 제한)
		if (new Blob([content]).size > 65535) {
			alert('내용이 너무 깁니다. 내용을 줄여주세요.');
			return;
		}

		const { mno } = user;

		const postData = {
			mno,
			title: titleRef.current.value,
			content,
			endDate: endDateRef.current.value,
			numberOfUsers: parseInt(numberOfUsers, 10),
			viewCount: 0,
		};

		createPost(postData)
			.then((response) => {
				console.log(response.status);
				navigate('/posts/page/1');
			})
			.catch((error) => {
				console.error('게시글 등록 실패:', error);
				alert('게시글 등록에 실패했습니다.');
			});
	}

	return (
		<section className="write_container">
			<form className="editor-container">
				<div className="input-row">
					<div className="column column-left">
						<label htmlFor="endDate">
							*끝나는 날짜
							<input type="date" id="endDate" name="endDate" ref={endDateRef} className="endDate" />
						</label>
					</div>
					<div className="column column-right">
						<label htmlFor="numberOfUsers">
							*방 인원
							<input
								type="text"
								id="numberOfUsers"
								name="numberOfUsers"
								className="userNumber small-width"
								placeholder="숫자만 입력"
								value={numberOfUsers}
								onChange={handleNumberOfUsersChange}
							/>
						</label>
					</div>
				</div>
				<input type="text" placeholder="제목을 입력하세요" className="write_title write_style" ref={titleRef} />
				<div>
					<ReactQuill
						style={{ width: '830px', height: '500px' }}
						modules={modules}
						formats={formats}
						value={content}
						ref={quillRef}
						onChange={setContent}
						placeholder="내용을 입력해주세요."
					/>
					<style>
						{`
							.ql-editor .ql-size-huge {
								line-height: 1.1;
							}
						`}
					</style>
				</div>
			</form>
			<input type="submit" className="write_post" value="글 등록" onClick={storySubmit} />
		</section>
	);
}
