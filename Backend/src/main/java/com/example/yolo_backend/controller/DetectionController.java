package com.example.yolo_backend.controller;

import com.example.yolo_backend.service.RoboflowService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.JsonNode;

@RestController
public class DetectionController {

    private final RoboflowService roboflowService;

    public DetectionController(RoboflowService roboflowService) {
        this.roboflowService = roboflowService;
    }

    @PostMapping("/detect")
    public JsonNode detect(
            @RequestParam("image") MultipartFile image
    ) {
        return roboflowService.detect(image);
    }
}