package com.demo.gram.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jdk.jshell.Snippet;
import lombok.*;
import org.springframework.context.annotation.Lazy;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity(name = "Posts")

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "user"})
public class Post extends BaseEntity{  // regDate, modDate 상속 -> createdAt, updatedAt 삭제
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  @Lazy
  private Members user;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String content;

  @Column(nullable = false)
  private Long numberOfUsers;

  @Column(nullable = false)
  private LocalDate endDate;

  @Column(nullable = false)
  private Long viewCount = 0L;


}
