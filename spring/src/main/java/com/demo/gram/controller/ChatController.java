package com.demo.gram.controller;

import com.demo.gram.dto.ChatMessageDTO;
import com.demo.gram.dto.ChatRoomRequest;
import com.demo.gram.dto.MembersDTO;
import com.demo.gram.entity.ChatMessage;
import com.demo.gram.entity.ChatRoom;
import com.demo.gram.entity.ChatRoomResponse;
import com.demo.gram.entity.Members;
import com.demo.gram.repository.ChatMessageRepository;
import com.demo.gram.repository.ChatRoomRepository;
import com.demo.gram.repository.MembersRepository;
import com.demo.gram.repository.PostRepository;
import com.demo.gram.security.util.JWTUtil;
import com.demo.gram.service.ChatRoomService;
import com.demo.gram.service.MembersService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@Log4j2
public class ChatController {

  private final PostRepository postRepository;
  private final ChatRoomRepository chatRoomRepository;
  private final ChatMessageRepository chatMessageRepository;
  private final MembersRepository membersRepository;
  private final MembersService membersService;
  private final JWTUtil jwtUtil;
  private final ObjectMapper objectMapper;
  private final ChatRoomService chatRoomService;

  @DeleteMapping("/{chatRoomId}/leave/{memberId}")
  public void leaveChatRoom(@PathVariable Long chatRoomId, @PathVariable Long memberId) {
    chatRoomService.leaveChatRoom(chatRoomId, memberId);
  }

  @MessageMapping("/chat/{chatRoomId}/send")
  @SendTo("/topic/chat/{chatRoomId}")
  public ChatMessageDTO sendChatMessageViaWebSocket(@DestinationVariable Long chatRoomId, @Payload PayloadMessage payloadMessage) throws Exception {
    ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
        .orElseThrow(() -> new RuntimeException("Chat room not found"));
    String email = jwtUtil.validateAndExtract(payloadMessage.getToken());
    Members user = membersRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));
    ChatMessage chatMessage = new ChatMessage();
    chatMessage.setChatRoom(chatRoom);
    chatMessage.setUser(user);
    chatMessage.setMessage(payloadMessage.getMessage());
    chatMessage.setSentAt(LocalDateTime.now());
    chatMessageRepository.save(chatMessage);
    return chatMessage.toDTO();
  }

  @PostMapping("/{chatRoomId}/send")
  public ResponseEntity<ChatMessageDTO> sendChatMessageViaPost(@PathVariable Long chatRoomId, @RequestBody PayloadMessage payloadMessage) throws Exception {
    ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
        .orElseThrow(() -> new RuntimeException("ChatRoom not found"));
    String email = jwtUtil.validateAndExtract(payloadMessage.getToken());
    Members user = membersRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));
    ChatMessage chatMessage = new ChatMessage();
    chatMessage.setChatRoom(chatRoom);
    chatMessage.setUser(user);
    chatMessage.setMessage(payloadMessage.getMessage());
    chatMessage.setSentAt(LocalDateTime.now());
    chatMessageRepository.save(chatMessage);
    return ResponseEntity.ok(chatMessage.toDTO());
  }

  @GetMapping("/room/by-post/{postId}")
  public ResponseEntity<Map<String, Object>> getChatRoomByPostId(@PathVariable Long postId, @RequestHeader("Authorization") String token) {
    Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findByPostIdWithMembers(postId);

    ChatRoom chatRoom;
    boolean isNewRoom = false;
    if (chatRoomOptional.isPresent()) {
      chatRoom = chatRoomOptional.get();
    } else {
      // 채팅방이 없을 경우 새로 생성
      chatRoom = new ChatRoom();
      chatRoom.setPost(postRepository.findById(postId)
          .orElseThrow(() -> new RuntimeException("Post not found")));
      chatRoom.setName("Chat Room for Post " + postId);
      chatRoom.setCreatedAt(LocalDateTime.now());
      chatRoomRepository.save(chatRoom);
      isNewRoom = true;
    }

    try {
      String email = jwtUtil.validateAndExtract(token.substring(7)); // "Bearer " 부분 제거
      membersService.joinChatRoom(email, chatRoom.getId());
    } catch (Exception e) {
      log.error("Token validation failed", e);
      throw new RuntimeException("Invalid token", e);
    }

    Map<String, Object> response = new HashMap<>();
    response.put("chatRoomId", chatRoom.getId());
    response.put("postId", postId);
    response.put("endDate", chatRoom.getPost().getEndDate()); // endDate 추가
    if (isNewRoom) {
      response.put("message", "Chat room created successfully");
    }
    return ResponseEntity.ok(response);
  }



  @GetMapping("/chatroom/{chatRoomId}/user")
  public ResponseEntity<String> getChatRoomMembers(@PathVariable Long chatRoomId) {
    log.info("Getting members for chat room: " + chatRoomId);
    List<MembersDTO> members = membersService.getChatRoomMembers(chatRoomId);
    return new ResponseEntity<>(convertToJson(members), HttpStatus.OK);
  }

  @MessageMapping("/chat/{chatRoomId}/join")
  @SendTo("/topic/chat/{chatRoomId}/members")
  public List<MembersDTO> joinChatRoom(@DestinationVariable Long chatRoomId, @Payload PayloadMessage payloadMessage) {
    try {
      String email = jwtUtil.validateAndExtract(payloadMessage.getToken());
      membersService.joinChatRoom(email, chatRoomId);
    } catch (Exception e) {
      log.error("Token validation failed", e);
      throw new RuntimeException("Invalid token", e);
    }
    List<MembersDTO> members = membersService.getChatRoomMembers(chatRoomId);
    return members;
  }

  @GetMapping("/chatroom/{chatRoomId}/messages")
  public ResponseEntity<List<ChatMessageDTO>> getMessagesByChatRoomId(@PathVariable Long chatRoomId) {
    List<ChatMessageDTO> messages = chatMessageRepository.findByChatRoomId(chatRoomId)
        .stream()
        .map(ChatMessage::toDTO)
        .collect(Collectors.toList());
    return ResponseEntity.ok(messages);
  }

  @PostMapping("/room")
  public ResponseEntity<String> createChatRoom(@RequestBody ChatRoomRequest chatRoomRequest) {
    Long postId = chatRoomRequest.getPostId();
    // postId에 해당하는 채팅방이 이미 있는지 확인
    Optional<ChatRoom> existingChatRoom = chatRoomRepository.findByPostIdWithMembers(postId);

    if (existingChatRoom.isPresent()) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body("Chat room already exists for this post");
    }

    ChatRoom chatRoom = new ChatRoom();
    chatRoom.setPost(postRepository.findById(postId)
        .orElseThrow(() -> new RuntimeException("Post not found")));
    chatRoom.setName("Chat Room for Post " + postId);
    chatRoom.setCreatedAt(LocalDateTime.now());
    chatRoomRepository.save(chatRoom);

    ChatRoomResponse response = new ChatRoomResponse(chatRoom.getId(), postId);
    return ResponseEntity.ok(convertToJson(response));
  }

  private String convertToJson(Object object) {
    try {
      return objectMapper.writeValueAsString(object);
    } catch (Exception e) {
      throw new RuntimeException("Failed to convert object to JSON", e);
    }
  }

  @Data
  public static class PayloadMessage {
    private String message;
    private String token;

    // 기본 생성자가 필요함
    public PayloadMessage() {}

    public PayloadMessage(String message, String token) {
      this.message = message;
      this.token = token;
    }
  }
}
