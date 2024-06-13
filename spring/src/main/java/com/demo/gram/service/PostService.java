package com.demo.gram.service;

import com.demo.gram.dto.PostDTO;
import com.demo.gram.entity.Members;
import com.demo.gram.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PostService {
  List<PostDTO> findAllPosts();
  PostDTO findPostById(Long id);
  void writePost(PostDTO postDTO);
  void updatePost(Long id, PostDTO postDTO);
  void delPost(Long id);


  default Post dtoToEntity(PostDTO postDTO) {
    Members user = new Members();
    user.setMno(postDTO.getMno());  // 로그인 유저의 기본키를 가진 유저 추가
    Post post = Post.builder()
        .title(postDTO.getTitle())
        .content(postDTO.getContent())
        .endDate(LocalDate.parse(postDTO.getEndDate()))
        .numberOfUsers(postDTO.getNumberOfUsers())
        .user(user)
        .viewCount(postDTO.getViewCount())
        .build();
    return post;
  }

  default PostDTO entityToDTO(Post post) {
    PostDTO postDTO = PostDTO.builder()
        .id(post.getId())
        .title(post.getTitle())
        .content(post.getContent())
        .regdate(post.getRegDate().toString())
        .endDate(post.getEndDate().toString())
        .name(post.getUser().getName())
        .viewCount(post.getViewCount())
        .numberOfUsers(post.getNumberOfUsers())
        .userId(post.getUser().getId())
        .build();
    return postDTO;
  }

}
