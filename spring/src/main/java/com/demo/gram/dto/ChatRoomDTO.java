package com.demo.gram.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomDTO {
  private Long id;
  private String name;
  private LocalDateTime createdAt;
  private Set<Long> memberIds;
  private String postUserName; // 작성자 이름
  private String postTitle;    // 게시글 제목
}
