package com.hoaxify.ws.shared.viewModels;

import com.hoaxify.ws.shared.annotations.FileType;
import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class UserUpdateViewModel {

    @NotNull(message = "{hoaxify.validation.constraints.displayName.NotNull.message}")
    @Size(min = 4, max = 255)
    private String displayName;

    @FileType(types = {"jpeg","png"})
    private String image;
}
