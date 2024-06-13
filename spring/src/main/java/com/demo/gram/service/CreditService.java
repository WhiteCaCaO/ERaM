package com.demo.gram.service;

import com.demo.gram.entity.Credit;
import com.demo.gram.entity.Members;
import com.demo.gram.repository.CreditRepository;
import com.demo.gram.repository.MembersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreditService {


  private final CreditRepository creditRepository;


  private final MembersRepository memberRepository;

  @Transactional
  public Credit addCredit(Long memberId, int amount) {
    Members member = memberRepository.findById(memberId)
        .orElseThrow(() -> new RuntimeException("Member not found"));
    Credit credit = Credit.builder()
        .member(member)
        .amount(amount)
        .build();
    member.getCredits().add(credit);
    return creditRepository.save(credit);
  }

  public int getBalance(Long memberId) {
    Members member = memberRepository.findById(memberId)
        .orElseThrow(() -> new RuntimeException("Member not found"));
    return member.getCredits().stream().mapToInt(Credit::getAmount).sum();
  }
}
