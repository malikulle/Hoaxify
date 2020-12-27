package com.hoaxify.ws.shared.viewModels;

import com.hoaxify.ws.models.FileAttachment;
import lombok.Data;

@Data
public class FileAttachmentViewModel {

    private String name;

    public FileAttachmentViewModel(FileAttachment fileAttachment) {
        this.name = fileAttachment.getName();
    }
}
