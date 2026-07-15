package com.example.yolo_backend.controller;

import com.example.yolo_backend.service.AssessmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> start(
            @RequestParam("image") MultipartFile image
    ) {
        if (image == null || image.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "이미지 파일이 필요합니다."
            );
        }

        try {
            String assessmentId = assessmentService.createJob();

            assessmentService.processAsync(
                    assessmentId,
                    image.getBytes(),
                    image.getContentType()
            );

            return ResponseEntity.accepted().body(
                    Map.of(
                            "assessmentId", assessmentId,
                            "status", "PENDING"
                    )
            );
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "이미지 파일을 읽을 수 없습니다.",
                    e
            );
        }
    }

    @GetMapping("/{assessmentId}/status")
    public Map<String, Object> status(
            @PathVariable String assessmentId
    ) {
        return assessmentService.getStatus(assessmentId);
    }

    @GetMapping("/{assessmentId}/result")
    public Map<String, Object> result(
            @PathVariable String assessmentId
    ) {
        return assessmentService.getResult(assessmentId);
    }
}
