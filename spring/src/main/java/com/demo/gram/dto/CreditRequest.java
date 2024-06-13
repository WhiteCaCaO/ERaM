package com.demo.gram.dto;

import lombok.Data;

@Data
public class CreditRequest {
  private Long memberId;
  private int amount;
}
