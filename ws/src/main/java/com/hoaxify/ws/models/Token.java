package com.hoaxify.ws.models;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Token {
    @Id
    private String token;

    @ManyToOne
    private User user;
}
