package com.mybrary.backend.global.exception.member;

import com.mybrary.backend.global.format.ErrorCode;
import lombok.Getter;

@Getter
public class MemberNotFoundException extends RuntimeException{
    private final ErrorCode errorCode;

    public MemberNotFoundException(ErrorCode errorCode){
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
