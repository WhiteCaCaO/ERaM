package com.demo.gram.security.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Log4j2
@Component
public class JWTUtil {

  @Value("${jwt.secretKey}")
  private String secretKey;

  private byte[] secretKeyBytes;
  private final long expire = 60 * 24 * 30 * 1000; // 30 days in milliseconds

  @PostConstruct
  public void init() {
    if (secretKey == null || secretKey.length() < 64) {
      throw new RuntimeException("The secret key must be at least 512 bits long.");
    }
    this.secretKeyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
  }

  public String generateToken(String username) {
    return Jwts.builder()
        .setSubject(username)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + expire))
        .signWith(Keys.hmacShaKeyFor(secretKeyBytes), SignatureAlgorithm.HS512)
        .compact();
  }

  public boolean validateToken(String token) {
    try {
      Jwts.parser()
          .setSigningKey(Keys.hmacShaKeyFor(secretKeyBytes))
          .build()
          .parseClaimsJws(token);
      return true;
    } catch (Exception e) {
      log.error("JWT validation failed", e);
      return false;
    }
  }

  public String getUsernameFromToken(String token) {
    Claims claims = Jwts.parser()
        .setSigningKey(Keys.hmacShaKeyFor(secretKeyBytes))
        .build()
        .parseClaimsJws(token)
        .getBody();
    return claims.getSubject();
  }

  public String validateAndExtract(String tokenStr) {
    if (validateToken(tokenStr)) {
      return getUsernameFromToken(tokenStr);
    }
    return null;
  }
}