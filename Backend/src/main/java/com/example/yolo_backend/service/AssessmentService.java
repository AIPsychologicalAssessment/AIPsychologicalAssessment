package com.example.yolo_backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.JsonNode;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AssessmentService {

    private final RoboflowService roboflowService;
    private final Map<String, AssessmentJob> jobs = new ConcurrentHashMap<>();

    public AssessmentService(RoboflowService roboflowService) {
        this.roboflowService = roboflowService;
    }

    public String createJob() {
        String id = UUID.randomUUID().toString();
        jobs.put(id, new AssessmentJob());
        return id;
    }

    @Async
    public void processAsync(
            String assessmentId,
            byte[] imageBytes,
            String contentType
    ) {
        AssessmentJob job = findJob(assessmentId);
        job.status = "PROCESSING";
        job.message = "이미지를 분석하고 있습니다.";

        try {
            JsonNode detection = roboflowService.detect(
                    imageBytes,
                    contentType
            );

            job.detection = detection;
            job.summary = makeSummary(detection);
            job.status = "COMPLETED";
            job.message = "분석이 완료되었습니다.";
        } catch (Exception e) {
            job.status = "FAILED";
            job.message = e.getMessage() == null
                    ? "분석에 실패했습니다."
                    : e.getMessage();
        }
    }

    public Map<String, Object> getStatus(String assessmentId) {
        AssessmentJob job = findJob(assessmentId);

        return Map.of(
                "assessmentId", assessmentId,
                "status", job.status,
                "message", job.message
        );
    }

    public Map<String, Object> getResult(String assessmentId) {
        AssessmentJob job = findJob(assessmentId);

        if ("FAILED".equals(job.status)) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    job.message
            );
        }

        if (!"COMPLETED".equals(job.status)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "아직 분석이 완료되지 않았습니다."
            );
        }

        return Map.of(
                "assessmentId", assessmentId,
                "summary", job.summary,
                "disclaimer",
                "이 결과는 객체탐지 기반 기능 검증용이며 심리 진단이나 의료적 판단이 아닙니다.",
                "detection", job.detection
        );
    }

    private AssessmentJob findJob(String assessmentId) {
        AssessmentJob job = jobs.get(assessmentId);

        if (job == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "검사 정보를 찾을 수 없습니다."
            );
        }

        return job;
    }

    private String makeSummary(JsonNode detection) {
        JsonNode predictions = detection.path("predictions");

        if (!predictions.isArray() || predictions.isEmpty()) {
            return "탐지된 객체가 없습니다.";
        }

        Map<String, Integer> counts = new LinkedHashMap<>();

        for (JsonNode prediction : predictions) {
            String className = prediction.path("class").asText("object");
            counts.merge(className, 1, Integer::sum);
        }

        StringBuilder summary = new StringBuilder("탐지된 객체: ");

        counts.forEach((name, count) ->
                summary.append(name)
                        .append(" ")
                        .append(count)
                        .append("개, ")
        );

        return summary.substring(0, summary.length() - 2);
    }

    private static class AssessmentJob {
        private volatile String status = "PENDING";
        private volatile String message = "분석을 기다리고 있습니다.";
        private volatile String summary;
        private volatile JsonNode detection;
    }
}
