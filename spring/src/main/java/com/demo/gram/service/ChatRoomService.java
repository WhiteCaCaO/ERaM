package com.demo.gram.service;

import com.demo.gram.entity.ChatRoom;
import com.demo.gram.entity.Members;
import com.demo.gram.repository.ChatRoomRepository;
import com.demo.gram.repository.MembersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChatRoomService {

  @Autowired
  private ChatRoomRepository chatRoomRepository;

  @Autowired
  private MembersRepository membersRepository;

  @Transactional
  public void leaveChatRoom(Long chatRoomId, Long memberId) {
    ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
        .orElseThrow(() -> new IllegalArgumentException("Invalid chat room ID"));

    Members member = membersRepository.findById(memberId)
        .orElseThrow(() -> new IllegalArgumentException("Invalid member ID"));

    chatRoom.getMembers().remove(member);
    member.getChatRooms().remove(chatRoom);

    chatRoomRepository.save(chatRoom);
    membersRepository.save(member);
  }
}
