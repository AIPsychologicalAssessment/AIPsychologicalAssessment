package com.example.yolo_backend.service;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Set;

@Service
public class RoboflowService {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private final HttpClient httpClient;
    private final JsonMapper jsonMapper;
    private final String apiKey;
    private final String modelId;

    public RoboflowService(
            JsonMapper jsonMapper,
            @Value("${roboflow.api-key}") String apiKey,
            @Value("${roboflow.model-id}") String modelId
    ) {
        this.httpClient = HttpClient.newHttpClient();
        this.jsonMapper = jsonMapper;
        this.apiKey = apiKey;
        this.modelId = modelId;
    }

    public JsonNode detect(MultipartFile image) {
        validateImage(image);

        try {
            String base64Image = Base64.getEncoder()
                    .encodeToString(image.getBytes());

            String encodedApiKey = URLEncoder.encode(
                    apiKey,
                    StandardCharsets.UTF_8
            );

            String endpoint =
                    "https://serverless.roboflow.com/"
                            + modelId
                            + "?api_key=" + encodedApiKey
                            + "&confidence=0.4"
                            + "&format=json";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(endpoint))
                    .header(
                            "Content-Type",
                            "application/x-www-form-urlencoded"
                    )
                    .POST(HttpRequest.BodyPublishers.ofString(base64Image))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() < 200
                    || response.statusCode() >= 300) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Roboflow 호출 실패: "
                                + response.statusCode()
                                + " / "
                                + response.body()
                );
            }

            return jsonMapper.readTree(response.body());

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Roboflow 요청이 중단됐습니다.",
                    e
            );

        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "이미지 또는 Roboflow 응답을 처리하지 못했습니다.",
                    e
            );
        }
    }

    private void validateImage(MultipartFile image) {
        if (image == null || image.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "이미지 파일이 필요합니다."
            );
        }

        if (image.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(
                    HttpStatus.PAYLOAD_TOO_LARGE,
                    "이미지는 최대 10MB까지 가능합니다."
            );
        }

        String contentType = image.getContentType();

        if (contentType == null
                || !ALLOWED_TYPES.contains(contentType)) {
            throw new ResponseStatusException(
                    HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                    "JPEG, PNG, WEBP 이미지만 지원합니다."
            );
        }
    }
}