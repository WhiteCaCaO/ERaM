// import React, { useState } from 'react';
// import 'styles/MainSearchBar.scss'; // Make sure to link the correct CSS file

// const MainSearchBar = () => {
// 	const [searchType, setSearchType] = useState('HashTag');
// 	const [query, setQuery] = useState('');

// 	const handleSearch = () => {
// 		console.log(`Searching for ${query} in ${searchType}`);
// 		// Implement your search logic here or trigger an event
// 	};

// 	return (
// 		<div className="search-bar">
// 			<select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="search-dropdown">
// 				<option value="게시글">게시글</option>
// 				<option value="작성자">작성자</option>
// 			</select>
// 			<input
// 				type="text"
// 				value={query}
// 				onChange={(e) => setQuery(e.target.value)}
// 				placeholder="Search..."
// 				className="search-input"
// 			/>
// 			<button onClick={handleSearch} className="search-button">
// 				검색
// 			</button>
// 		</div>
// 	);
// };

// export default MainSearchBar;
