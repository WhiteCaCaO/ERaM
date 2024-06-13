import React, { useState } from 'react';
import MyPageProfile from '../components/Profile/MyPageProfile';
import MyStory from '../components/Story/MyStory';
import MyChat from '../components/Story/MyChat';
import Credit from '../components/Story/Credit';

function MyPage() {
    const [activeComponent, setActiveComponent] = useState('MyPageProfile');
    const [userId, setUserId] = useState('');

    const handleComponentChange = (component) => {
        setActiveComponent(component);
    };

    const handleUserIdChange = (id) => {
        setUserId(id);
    };

    return (
        <>
            <MyPageProfile userId={userId} onComponentChange={handleComponentChange} onUserIdChange={handleUserIdChange} />
            {activeComponent === 'MyStory' && <MyStory userId={userId} />}
            {activeComponent === 'MyChat' && <MyChat userId={userId} />}
            {activeComponent === 'Credit' && <Credit userId={userId} />}
        </>
    );
}

export default MyPage;
