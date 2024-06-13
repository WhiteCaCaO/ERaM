package com.demo.gram.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "chat_rooms")
@Data
public class ChatRoom {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id", nullable = false)
  private Post post;

  @ManyToMany(mappedBy = "chatRooms", fetch = FetchType.LAZY)
  private Set<Members> members = new HashSet<>();

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference // 순환 참조 방지
  private Set<ChatMessage> messages = new HashSet<>();
}
