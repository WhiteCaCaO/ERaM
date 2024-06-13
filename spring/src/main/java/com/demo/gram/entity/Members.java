package com.demo.gram.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = {"chatRooms", "posts", "credits"})
public class Members {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long mno;

  @Column(unique = true)
  private String id;

  @Column(nullable = false)
  private String password;

  @Column(unique = true)
  private String email;
  private String name;
  private String mobile;

  @Column(columnDefinition = "BOOLEAN DEFAULT false")
  private boolean fromSocial;

  private LocalDateTime regDate;
  private LocalDateTime modDate;

  @ElementCollection(fetch = FetchType.LAZY)
  @Builder.Default
  private Set<MembersRole> roleSet = new HashSet<>();

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonBackReference
  private Set<Post> posts = new HashSet<>();

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "member_chatrooms",
      joinColumns = @JoinColumn(name = "member_id"),
      inverseJoinColumns = @JoinColumn(name = "chatroom_id")
  )
  @JsonBackReference
  private Set<ChatRoom> chatRooms = new HashSet<>();

  public void addMemberRole(MembersRole membersRole) {
    roleSet.add(membersRole);
  }

  public void joinChatRoom(ChatRoom chatRoom) {
    this.chatRooms.add(chatRoom);
    chatRoom.getMembers().add(this);
  }

  @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<Credit> credits = new HashSet<>();
}
