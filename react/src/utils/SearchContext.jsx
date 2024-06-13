import React, { createContext, useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SearchContext = createContext();

export function SearchProvider({ children }) {
	const [searchKeyword, setSearchKeyword] = useState('');
	const location = useLocation();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const keyword = params.get('search');
		if (keyword) {
			setSearchKeyword(keyword);
		}
	}, [location]);

	const contextValue = useMemo(() => ({ searchKeyword, setSearchKeyword }), [searchKeyword]);

	return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>;
}

export default SearchContext;
