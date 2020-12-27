package com.hoaxify.ws.shared.viewModels;

import lombok.Data;

@Data
public class AuthResponse {

    private String token;
    private UserViewModel user;
}
