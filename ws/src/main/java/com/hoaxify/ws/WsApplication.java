package com.hoaxify.ws;

import com.hoaxify.ws.models.Hoax;
import com.hoaxify.ws.models.User;
import com.hoaxify.ws.services.HoaxService;
import com.hoaxify.ws.services.UserService;
import com.hoaxify.ws.shared.viewModels.HoaxSubmitViewModel;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Profile;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class WsApplication {

    public static void main(String[] args) {
        SpringApplication.run(WsApplication.class, args);
    }

    @Bean
    @Profile("dev")
    CommandLineRunner createInitialUsers(UserService userService, HoaxService hoaxService) {
        return (args) -> {
            for (int i = 1; i < 25; i++) {
                User user = new User();
                user.setUsername("user" + i);
                user.setDisplayName("displayName" + i);
                user.setPassword("P4ssword");
                userService.save(user);
                for (int j = 1; j <= 20; j++) {
                    HoaxSubmitViewModel hoax = new HoaxSubmitViewModel();
                    hoax.setContent("haox (" + j + ") from (user" + i + ")");
                    hoaxService.save(hoax, user);
                }
            }


        };
    }

}

