package com.demo.gram.dto;

import lombok.Data;

@Data
public class ChatRoomRequest {
  private Long postId;

  public ChatRoomRequest() {}

  public ChatRoomRequest(Long postId) {
    this.postId = postId;
  }
}