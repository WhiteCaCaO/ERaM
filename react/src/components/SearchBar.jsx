import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../styles/SearchBar.scss';
import { useNavigate } from 'react-router-dom';

function SearchBar({ setSearchKeyword }) {
	const [searchValue, setSearchValue] = useState('');
	const navigate = useNavigate();

	const handleSearch = () => {
		if (searchValue.trim() === '') {
			// 공백일 때는 전체 게시글을 가져오기 위해 빈 문자열로 설정
			setSearchKeyword('');
		} else {
			setSearchKeyword(searchValue);
		}
		navigate(`/posts/page/1?search=${searchValue}`);
	};

	const handleSearchValue = (e) => {
		setSearchValue(e.target.value);
	};

	return (
		<div className="searchBar">
			<input
				className="searchBar__input"
				placeholder="게시글 검색.."
				value={searchValue}
				onChange={handleSearchValue}
				onKeyDown={async (e) => {
					if (e.key === 'Enter') {
						await handleSearch();
					}
				}}
			/>
			<div className="searchBar__icon">
				<FontAwesomeIcon
					icon={faSearch}
					onClick={async () => {
						await handleSearch();
					}}
				/>
			</div>
		</div>
	);
}

export default SearchBar;
