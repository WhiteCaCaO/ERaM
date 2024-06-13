package com.demo.gram.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;


@Document(collection = "sport_collection")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Sport {
  @Id
  private String id;
  private String name;
  private String category; // 예를 들어 "수중 스포츠", "겨울 스포츠" 등
  private String description;
  private List<String> tags; // 예: ["실외", "팀스포츠", "물속"]

  private String environment; // "실내", "실외"
  private String activityType; // "개인", "팀"
  private String activityLevel; // "상", "중", "하"
  private String skillLevel; // "초급", "중급", "고급"
  private String accessibility; // "높음", "중간", "낮음"
  private String popularity; // "높음", "보통", "낮음"
  private String riskLevel; // "높음", "중간", "낮음"
  private String src;




}
