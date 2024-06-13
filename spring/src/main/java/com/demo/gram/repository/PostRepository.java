package com.demo.gram.repository;

import com.demo.gram.entity.Members;
import com.demo.gram.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {


  List<Post> findByUser(Members user);
}

