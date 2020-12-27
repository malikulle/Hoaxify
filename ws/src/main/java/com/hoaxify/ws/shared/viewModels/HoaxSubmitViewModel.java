package com.hoaxify.ws.shared.viewModels;

import lombok.Data;

import javax.persistence.Column;
import javax.validation.constraints.Size;

@Data
public class HoaxSubmitViewModel {

    @Size(min = 1,max = 1000)
    @Column(length = 1000)
    private String content;

    private long attachmentId;
}
