package com.mybrary.backend.domain.mybrary.dto;

import com.mybrary.backend.domain.member.dto.MemberGetDto;
import com.mybrary.backend.domain.rollingpaper.dto.RollingPaperGetDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MybraryGetDto {

    /**
     *  내 마이브러리 정보 요청
     */

    private Long mybraryId;
    private String frameImageUrl;
    private int backgroundColor;
    private int deskColor;
    private int bookshelfColor;
    private int easelColor;
    private MemberGetDto member;
    private int threadCount;
    private int bookCount;
    private int followerCount;
    private int followingCount;
    private Long bookShelfId;
    private Long rollingPaperId;

}