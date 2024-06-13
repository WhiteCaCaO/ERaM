package com.demo.gram.repository;

import com.demo.gram.entity.ChatRoom;
import com.demo.gram.entity.Members;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

  @Query("SELECT cr FROM ChatRoom cr LEFT JOIN FETCH cr.members WHERE cr.post.id = :postId")
  Optional<ChatRoom> findByPostIdWithMembers(@Param("postId") Long postId);

  @Query("SELECT cr FROM ChatRoom cr LEFT JOIN FETCH cr.members WHERE cr.id = :chatRoomId")
  Optional<ChatRoom> findByIdWithMembers(@Param("chatRoomId") Long chatRoomId);

  @Query("SELECT cr FROM ChatRoom cr JOIN cr.members m WHERE m = :member")
  List<ChatRoom> findByMembersContains(@Param("member") Members member);
}
