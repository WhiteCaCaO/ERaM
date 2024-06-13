package com.demo.gram.dto;

import com.demo.gram.entity.Members;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostDTO {

  private Long id;
//  private Members user;
  private Long mno;  // 게시판 작성자의 기본키
  private String title;
  private String content;
  private Long numberOfUsers;
  private String regdate;
  private String endDate;
  private Long viewCount;
  private String name;  // 닉네임용?
  private String userId;  // 게시판 작성 유저의 id

}
