package com.hoaxify.ws.shared.viewModels;

import com.hoaxify.ws.models.FileAttachment;
import com.hoaxify.ws.models.Hoax;
import lombok.Data;


@Data
public class HoaxViewModel {

    private long id;

    private String content;

    private long timestamp ;

    private UserViewModel user;

    private FileAttachmentViewModel fileAttachment;

    public HoaxViewModel(Hoax hoax) {
        this.id = hoax.getId();
        this.content = hoax.getContent();
        this.timestamp = hoax.getTimestamp().getTime();
        this.user = new UserViewModel(hoax.getUser());
        if (hoax.getFileAttachment() != null){
            this.fileAttachment = new FileAttachmentViewModel(hoax.getFileAttachment());
        }
    }
}
