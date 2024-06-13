import React, { useContext, useEffect, useState } from 'react';
import '../styles/SideBar.scss';
import { useNavigate } from 'react-router-dom';
import SearchContext from '../utils/SearchContext'; // SearchContext 임포트

function SideBar() {
	const { setSearchKeyword } = useContext(SearchContext);
	const navigate = useNavigate();
	const [randomLinks, setRandomLinks] = useState([]);

	const links = [
		{ id: 'link1', label: '아이스링크' },
		{ id: 'link2', label: '볼더링' },
		{ id: 'link3', label: '양궁' },
		{ id: 'link4', label: '사격' },
		{ id: 'link5', label: '스쿼시' },
		{ id: 'link6', label: '플라잉요가' },
		{ id: 'link7', label: '바둑' },
		{ id: 'link8', label: '체스' },
		{ id: 'link9', label: '홀덤' },
		{ id: 'link10', label: '트릭킹' },
		{ id: 'link11', label: '폴댄스' },
		{ id: 'link12', label: '실내서바이벌' },
		{ id: 'link13', label: '스쿠버다이빙' },
		{ id: 'link14', label: '프리다이빙' },
		{ id: 'link15', label: '스노클링' },
		{ id: 'link16', label: '비치 발리볼' },
		{ id: 'link17', label: '서핑' },
		{ id: 'link18', label: '게이트볼' },
		{ id: 'link19', label: '승마' },
		{ id: 'link20', label: '패러글라이딩' },
		{ id: 'link21', label: '카누' },
		{ id: 'link22', label: '카약' },
		{ id: 'link23', label: '산악자전거' },
		{ id: 'link24', label: '스케이트보드' },
	];

	useEffect(() => {
		const shuffled = links.sort(() => 0.5 - Math.random());
		setRandomLinks(shuffled.slice(0, 6));
	}, []);

	const handleLinkClick = (keyword) => {
		setSearchKeyword(keyword);
		navigate(`/posts/page/1?search=${keyword}`);
	};
	const comuLinkClick = (keyword) => {
		setSearchKeyword(keyword);
		navigate(`/posts/page/1`);
	};

	return (
		<div className="Sidebar__container">
			<div className="link">
				<h2 className="under">
					<button onClick={() => comuLinkClick()} className="all" type="button">
						모든 게시글 보기
					</button>
				</h2>
				<hr/>
				<h2>추천 이색 스포츠</h2>
				{randomLinks.map((link) => (
					<p key={link.id}>
						<button onClick={() => handleLinkClick(link.label)} className="Sidebtn" type="button">
							{link.label}
						</button>
					</p>
				))}
				<div className="footer">
					<p>© 2024 ERaM</p>
				</div>
			</div>
		</div>
	);
}

export default SideBar;
