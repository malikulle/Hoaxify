package com.hoaxify.ws.services;

import com.hoaxify.ws.models.Token;
import com.hoaxify.ws.models.User;
import com.hoaxify.ws.repositories.TokenRepository;
import com.hoaxify.ws.repositories.UserRepository;
import com.hoaxify.ws.shared.error.AuthException;
import com.hoaxify.ws.shared.viewModels.AuthResponse;
import com.hoaxify.ws.shared.viewModels.Credentials;
import com.hoaxify.ws.shared.viewModels.UserViewModel;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.persistence.Transient;
import javax.transaction.Transactional;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    TokenRepository tokenRepository;

    public AuthResponse authenticate(Credentials credentials) {
        User user = userRepository.findByUsername(credentials.getUsername());
        if (user == null) {
            throw new AuthException();
        }
        boolean matches = passwordEncoder.matches(credentials.getPassword(), user.getPassword());
        if (!matches) {
            throw new AuthException();
        }

        UserViewModel userViewModel = new UserViewModel(user);

        /*String token = Jwts.builder()
                .setSubject("" + user.getId())
                .signWith(SignatureAlgorithm.HS512, "SUPERSECRETKEY!!!")
                .compact();*/
        String token = generateRandomToken();

        Token tokenEntity =new Token();
        tokenEntity.setToken(token);
        tokenEntity.setUser(user);
        tokenRepository.save(tokenEntity);

        AuthResponse response = new AuthResponse();
        response.setUser(userViewModel);
        response.setToken(token);
        return response;
    }

    @Transactional
    public UserDetails getUserDetails(String token) {
        Optional<Token> optionalToken= tokenRepository.findById(token);
        if (!optionalToken.isPresent()){
            return null;
        }
        return optionalToken.get().getUser();
//        JwtParser parser = Jwts.parser().setSigningKey("SUPERSECRETKEY!!!");
//        try {
//            parser.parse(token);
//            Claims claims = parser.parseClaimsJws(token).getBody();
//            long userId = new Long(claims.getSubject());
//            User user = userRepository.getOne(userId);
//            User actualUser =(User)((HibernateProxy)user).getHibernateLazyInitializer().getImplementation();
//            return actualUser;
//        } catch (Exception e) {
//
//        }
//        return null;
    }

    public String generateRandomToken(){
        return UUID.randomUUID().toString().replaceAll("-","");
    }

    public void clearToken(String token) {
        tokenRepository.deleteById(token);
    }
}
