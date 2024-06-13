package com.demo.gram.controller;


import com.demo.gram.dto.MembersDTO;
import com.demo.gram.dto.ResponseDTO;
import com.demo.gram.security.util.JWTUtil;
import com.demo.gram.service.MembersService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@Log4j2
@RequestMapping("auth")
@RequiredArgsConstructor
@Validated

public class AuthController {

  private final MembersService membersService;
  private final JWTUtil jwtUtil;
  private final PasswordEncoder passwordEncoder;

  // 회원가입
  @PostMapping("/join")
  public ResponseEntity<?> join(@RequestBody MembersDTO membersDTO) {
    try {
      Long memberId = membersService.registMembersDTO(membersDTO);
      return ResponseEntity.ok(memberId);
    } catch (Exception e) {
      log.error("Error during registration: ", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }
  }

  @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Map<String, Object>> getToken(@RequestBody Map<String, String> loginRequest) {
    String email = loginRequest.get("email");
    String password = loginRequest.get("password");

    if (email == null || password == null) {
      String errorMessage = "Email or password is missing in the login request";
      log.error(errorMessage);
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("error", errorMessage));
    }

    log.info("Login attempt with email: " + email);

    try {
      String token = membersService.login(email, password, jwtUtil);
      MembersDTO user = membersService.getUserByEmail(email);

      if (token != null && !token.isEmpty() && user != null) {
        log.info("Login successful. Generating token...");
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        return ResponseEntity.ok(response);
      } else {
        String errorMessage = "Login failed. Invalid email or password.";
        log.error(errorMessage);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", errorMessage));
      }
    } catch (Exception e) {
      String errorMessage = "An error occurred during login: " + e.getMessage();
      log.error(errorMessage, e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", errorMessage));
    }
  }

  @PostMapping("/logout")
  public ResponseEntity<ResponseDTO> logout(HttpServletRequest request, HttpServletResponse response) {
    try {
      new SecurityContextLogoutHandler().logout(request, response, SecurityContextHolder.getContext().getAuthentication());
      return new ResponseEntity<>(new ResponseDTO("success", true), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(new ResponseDTO(e.getMessage(), false), HttpStatus.NOT_FOUND);
    }
  }

  // 로그인 폼 읽어오기
  @GetMapping("/login2")
  public String loginForm() {
    return "login";
  }

  // 회원가입 폼 읽어오기
  @GetMapping("/join2")
  public String joinForm() {
    return "join";
  }

}
