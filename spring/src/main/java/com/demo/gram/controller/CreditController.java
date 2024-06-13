package com.demo.gram.controller;

import com.demo.gram.dto.CreditRequest;
import com.demo.gram.entity.Credit;
import com.demo.gram.service.CreditService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/credit")
@RequiredArgsConstructor

public class CreditController {

  private static final Logger logger = LoggerFactory.getLogger(CreditController.class);

  private final CreditService creditService;

  @PostMapping("/add")
  public ResponseEntity<?> addCredit(@RequestBody CreditRequest creditRequest) {
    logger.info("Received request to add credit: memberId={}, amount={}", creditRequest.getMemberId(), creditRequest.getAmount());
    try {
      Credit credit = creditService.addCredit(creditRequest.getMemberId(), creditRequest.getAmount());
      logger.info("Credit added successfully for memberId={}", creditRequest.getMemberId());
      return ResponseEntity.ok(credit);
    } catch (Exception e) {
      logger.error("Error adding credit: {}", e.getMessage(), e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }
  }

  @GetMapping("/balance/{memberId}")
  public ResponseEntity<?> getBalance(@PathVariable Long memberId) {
    logger.info("Received request to get balance for memberId: {}", memberId);
    try {
      int balance = creditService.getBalance(memberId);
      logger.info("Retrieved balance: {}", balance);
      return ResponseEntity.ok(balance);
    } catch (Exception e) {
      logger.error("Error fetching balance: {}", e.getMessage(), e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }
  }
}
