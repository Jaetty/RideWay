package com.example.demo.domain;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@NoArgsConstructor(access = AccessLevel.PROTECTED) 
@Getter 
@Setter
@Entity 
public class CertInfo {

    @Id
    @Column(length = 50)
    private String email;

    @Column(length = 50)
    private String code;

    @Builder
    public CertInfo(String email, String code) {
        this.email = email;
        this.code = code;
    }

}