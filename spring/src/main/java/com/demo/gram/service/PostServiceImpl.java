package com.demo.gram.service;


import com.demo.gram.dto.PostDTO;
import com.demo.gram.entity.Post;
import com.demo.gram.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

  private final PostRepository postRepository;

  @Autowired
  public PostServiceImpl(PostRepository postRepository) {
    this.postRepository = postRepository;
  }

  @Override
  public List<PostDTO> findAllPosts() {
    List<Post> posts = postRepository.findAll();
    if (posts == null || posts.isEmpty()) {
      return List.of(); // 빈 리스트 반환
    }
    return posts.stream().map(this::entityToDTO).collect(Collectors.toList());
  }

  @Override
  public PostDTO findPostById(Long id) {
    if (id == null) {
      throw new IllegalArgumentException("ID cannot be null");
    }
    Optional<Post> postOptional = postRepository.findById(id);
    if (postOptional.isEmpty()) {
      throw new EntityNotFoundException("Post with ID " + id + " not found");
    }
    return entityToDTO(postOptional.get());
  }

  @Override
  public void writePost(PostDTO postDTO) {
    if (postDTO == null) {
      throw new IllegalArgumentException("PostDTO cannot be null");
    }
    try {
      postRepository.save(dtoToEntity(postDTO));
    } catch (Exception e) {
      // 서버 로그에 예외를 기록
      System.err.println("Error while writing post: " + e.getMessage());
      e.printStackTrace();
      throw new RuntimeException("Failed to write post", e);
    }
  }

  @Override
  public void updatePost(Long id, PostDTO postDTO) {
    if (id == null) {
      throw new IllegalArgumentException("ID cannot be null");
    }
    Optional<Post> postOptional = postRepository.findById(id);
    if (postOptional.isEmpty()) {
      throw new EntityNotFoundException("Post with ID " + id + " not found");
    }
    Post postById = postOptional.get();
    // 업데이트할 필드
    postById.setTitle(postDTO.getTitle());
    postById.setContent(postDTO.getContent());
    postById.setEndDate(LocalDate.parse(postDTO.getEndDate()));
    postRepository.save(postById);
  }

  @Override
  public void delPost(Long id) {
    if (id == null) {
      throw new IllegalArgumentException("ID cannot be null");
    }
    postRepository.deleteById(id);
  }
}
