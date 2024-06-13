package com.demo.gram.entity;

import com.demo.gram.dto.ChatMessageDTO;
import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;

@Entity
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ChatMessage {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "chat_room_id", nullable = false)
  private ChatRoom chatRoom;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private Members user;

  @Column(nullable = false)
  private String message;

  @Column(nullable = false)
  private LocalDateTime sentAt;

  public ChatMessageDTO toDTO() {
    return new ChatMessageDTO(this.id, this.message, this.sentAt, this.user.getName());
  }
}
