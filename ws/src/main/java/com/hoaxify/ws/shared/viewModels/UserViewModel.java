package com.hoaxify.ws.shared.viewModels;

import com.hoaxify.ws.models.User;
import lombok.Data;

@Data
public class UserViewModel {

    private String username;
    private String displayName;
    private String image;

    public UserViewModel(User user) {
        this.username = user.getUsername();
        this.displayName = user.getDisplayName();
        this.image = user.getImage();
    }
}
