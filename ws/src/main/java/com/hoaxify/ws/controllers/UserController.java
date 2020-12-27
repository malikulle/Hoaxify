package com.hoaxify.ws.controllers;

import com.hoaxify.ws.models.User;
import com.hoaxify.ws.services.UserService;
import com.hoaxify.ws.shared.GenericResponse;
import com.hoaxify.ws.shared.annotations.CurrentUser;
import com.hoaxify.ws.shared.viewModels.UserUpdateViewModel;
import com.hoaxify.ws.shared.viewModels.UserViewModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/1.0/users")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping
    public GenericResponse createUser(@Valid @RequestBody User model) {
        GenericResponse response = new GenericResponse("User Created");
        userService.save(model);
        return response;
    }

    @GetMapping
    public Page<UserViewModel> getUsers(Pageable page, @CurrentUser User user) {
        return userService.getUsers(page, user).map(UserViewModel::new);
    }

    @GetMapping("{username}")
    public UserViewModel getUser(@PathVariable String username) {
        User user = userService.getByUsername(username);
        return new UserViewModel(user);
    }

    @PutMapping("{username}")
    @PreAuthorize("#username == #loggedInUser.username")
    public UserViewModel updateUser(@Valid @RequestBody UserUpdateViewModel model, @PathVariable String username, @CurrentUser User loggedInUser) {
        User user = userService.updateUser(username, model);
        return new UserViewModel(user);
    }

    @DeleteMapping("{username}")
    @PreAuthorize("#username == principal.username")
    public GenericResponse deleteUser(@PathVariable String username) {
        userService.deleteUser(username);
        return new GenericResponse("User is removed");
    }
}
