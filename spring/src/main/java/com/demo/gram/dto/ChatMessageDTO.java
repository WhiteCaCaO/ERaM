package com.demo.gram.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessageDTO {
  private Long id;
  private String message;
  private LocalDateTime sentAt;
  private String senderName;

  public ChatMessageDTO(Long id, String message, LocalDateTime sentAt, String senderName) {
    this.id = id;
    this.message = message;
    this.sentAt = sentAt;
    this.senderName = senderName;
  }
}
