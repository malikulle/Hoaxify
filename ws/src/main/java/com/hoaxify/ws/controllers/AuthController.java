package com.hoaxify.ws.controllers;

import com.hoaxify.ws.services.AuthService;
import com.hoaxify.ws.shared.GenericResponse;
import com.hoaxify.ws.shared.viewModels.AuthResponse;
import com.hoaxify.ws.shared.viewModels.Credentials;
import com.hoaxify.ws.shared.viewModels.UserViewModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/1.0/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping
    public ResponseEntity<?> handleAuthentication(@RequestBody Credentials credentials) {
        AuthResponse auth = authService.authenticate(credentials);
        return ResponseEntity.ok().body(auth);
    }

    @PostMapping("/logout")
    public GenericResponse handleLogout(@RequestHeader(name = "Authorization") String authorization){
        String token = authorization.substring(7);
        authService.clearToken(token);
        return new GenericResponse("Logout Success");
    }
}
