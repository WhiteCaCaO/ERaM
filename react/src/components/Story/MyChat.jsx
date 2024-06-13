import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Story/MyChat.scss';
import UserService from '../../service/UserService'; // UserService를 임포트

function MyChat() {
    const [chatRooms, setChatRooms] = useState([]);

    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const userData = await UserService.getCurrentUser();
                const chatRoomsData = await UserService.getCurrentUserChatRooms();
                console.log('Fetched chat rooms:', chatRoomsData);
                if (chatRoomsData) {
                    setChatRooms(chatRoomsData);
                }
            } catch (error) {
                console.error('Failed to fetch chat rooms:', error);
            }
        };

        fetchChatRooms();
    }, []);

    return (
        <section className="MyChat_container">
            <ChatInfo />
            <ChatRooms chatRooms={chatRooms} />
        </section>
    );
}

function ChatRooms({ chatRooms }) {
    return chatRooms.map((room) => (
        <div className="MyChat" key={room.id}>
            <span className="chatroom_number chatroom_child">{room.id}</span>
          
            <Link to={`/Chat/${room.id}`}>
                <span className="chatroom_title chatroom_child">
                    {room.name}
                </span>
            </Link>
            <span className="chatroom_time chatroom_child">{room.postTitle || 'Unknown'}</span> {/* 게시글 제목 */}
              <span className="chatroom_name chatroom_child">{room.postUserName || 'Unknown'}</span> {/* 작성자 이름 */}
           
        </div>
    ));
}

function ChatInfo() {
    return (
        <div className="MyChat MyChatInfo">
            <span className="chatroom_number chatroom_child">번호</span>
            <span className="chatroom_title chatroom_child">채팅방 제목</span>
            <span className="chatroom_time chatroom_child">게시글 제목</span>
            <span className="chatroom_name chatroom_child">작성자</span>
          
        </div>
    );
}

export default MyChat;
