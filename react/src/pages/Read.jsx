import React, { useState, useEffect } from 'react';
import * as DOMPurify from 'dompurify';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { deletePost, getPostById } from '../service/PostService';
import { getChatRoomByPostId, createChatRoom } from '../service/ChatService';
import '../styles/Read.scss';

export default function Read() {
  return <ReadContent />;
}

function ReadContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isCreatingChatRoom, setIsCreatingChatRoom] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;
      console.log('로컬유저: ', user);
      setCurrentUser(user);
    };
    fetchCurrentUser();

    console.log('게시판 아이디: ', id);
    if (id) {
      getPostById(id)
        .then((response) => {
          console.log('Fetched post:', response.data);
          setPost(response.data);
        })
        .catch((error) => console.error('Error fetching post:', error));
    } else {
      console.error('Error: ID is undefined');
    }
  }, [id]);

  function handleEdit() {
    navigate(`/posts/writingPut/${id}`);
  }

  function handleDelete() {
    if (window.confirm('삭제 하시겠습니까?')) {
      deletePost(id)
        .then(() => {
          alert('삭제되었습니다.');
          navigate('/posts/page/1');
        })
        .catch((error) => {
          console.error('Error deleting post:', error);
          alert('삭제에 실패했습니다.');
        });
    } else {
      alert('삭제 취소');
    }
  }

  async function handleJoinChat() {
    console.log('Joining chat for postId:', id);
    if (id && !isCreatingChatRoom) {
      setIsCreatingChatRoom(true);
      try {
        const response = await getChatRoomByPostId(id);
        console.log('Get chat room response:', response);
        if (response && response.data) {
          navigate(`/chat/${response.data.chatRoomId}`);
          if (response.data.message) {
            alert(response.data.message);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          try {
            const createResponse = await createChatRoom(id);
            console.log('Create chat room response:', createResponse);
            if (createResponse && createResponse.data) {
              alert('채팅방이 만들어졌습니다.');
              navigate(`/chat/${createResponse.data.chatRoomId}`);
            }
          } catch (createError) {
            console.error('Error creating chat room:', createError.response?.data || createError.message);
            alert('채팅방 생성에 실패했습니다.');
          }
        } else {
          console.error('Error fetching chat room:', error.response?.data || error.message);
          alert('채팅방 처리에 실패했습니다.');
        }
      } finally {
        setIsCreatingChatRoom(false);
      }
    } else {
      console.error('Error: ID is undefined');
      alert('포스트 ID가 정의되지 않았습니다.');
    }
  }

  const isAuthor = currentUser && post && currentUser.id === post.userId;

  if (!post) return <div>Loading...</div>;

  return (
    <section className="read_container">
      <div className="read_title">
        {post.title}
        <span>({post.numberOfUsers})</span>
        <span className="numberOfUsers_comment"> &#47;&#47; 제한 인원</span>
      </div>
      <div className="read_info">
        <span className="read_name">{post.name}</span>
        <span className="read_day">
          {post.regdate ? post.regdate : 'Unknown Date'} ~ {post.endDate ? post.endDate : 'Unknown Date'}
        </span>
      </div>
      <div
        className="read_content"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(post.content),
        }}
      />
      <input type="submit" className="chat_button" value="채팅방 입장하기" onClick={handleJoinChat} />
      <div className="button_box">
        {isAuthor && (
          <>
            <input type="submit" className="read_button" value="수정" onClick={handleEdit} />
            <input type="submit" className="read_button delete_button" value="삭제" onClick={handleDelete} />
          </>
        )}
      </div>
    </section>
  );
}
