package com.example.vehicle_service.controller;

import com.example.vehicle_service.model.Vehicle;
import com.example.vehicle_service.model.VehicleImage;
import com.example.vehicle_service.service.VehicleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;


    @PostMapping("/batch")
    public List<Vehicle> getVehiclesByIds(@RequestBody List<Vehicle> vehicleIds) {
        return vehicleService.getVehiclesByIds(vehicleIds);
    }

    @GetMapping(value = "/search")
    public List<Vehicle> findByName(@RequestParam String name) {
        return vehicleService.findByName(name);
    }

    @GetMapping(value = "/search/all")
    public List<Vehicle> findAll() {
        return vehicleService.findAll();
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public boolean createVehicle(
            @RequestParam("vehicle") String vehicleJson,
            @RequestParam(value = "vehicleImages", required = false) List<MultipartFile> imageFiles)
            throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Vehicle vehicle = objectMapper.readValue(vehicleJson, Vehicle.class);

        List<VehicleImage> vehicleImages = vehicle.getVehicleImages();
        if (imageFiles != null && vehicleImages != null && imageFiles.size() == vehicleImages.size()) {
            for (int i = 0; i < imageFiles.size(); i++) {
                VehicleImage vehicleImage = vehicleImages.get(i);
                vehicleImage.setImageData(imageFiles.get(i).getBytes());
                vehicleImage.setVehicle(vehicle);
            }
        } else if (imageFiles != null && vehicleImages != null && imageFiles.size() != vehicleImages.size()) {
            return false;
        }

        return vehicleService.createVehicle(vehicle);
    }

    @PostMapping(value = "/edit/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public boolean editVehicle(
            @PathVariable("id") Long id,
            @RequestParam("vehicle") String vehicleJson,
            @RequestParam(value = "vehicleImages", required = false) List<MultipartFile> imageFiles)
            throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Vehicle vehicle = objectMapper.readValue(vehicleJson, Vehicle.class);

        List<VehicleImage> vehicleImages = vehicle.getVehicleImages();
        if (vehicleImages != null) {
            int imageFileIndex = 0;

            for (VehicleImage img : vehicleImages) {
                // Luôn set lại mối quan hệ
                img.setVehicle(vehicle);

                // Ảnh mới → không có id
                if (img.getId() == null && imageFiles != null && imageFileIndex < imageFiles.size()) {
                    MultipartFile file = imageFiles.get(imageFileIndex);
                    img.setImageData(file.getBytes());
                    imageFileIndex++;
                }

            }

            // Kiểm tra số ảnh mới và file upload có khớp không
            if (imageFiles != null && imageFileIndex != imageFiles.size()) {
                return false; // dữ liệu không khớp → trả lỗi
            }
        }

        return vehicleService.editVehicle(id, vehicle);
    }

    @DeleteMapping(value = "/del/{id}")
    public boolean deleteVehicle(@PathVariable Long id) {
        return vehicleService.deleteVehicle(id);
    }

    @PostMapping(value = "/available")
    public List<Vehicle> findAvailableVehicles(@RequestBody  List<Vehicle> bookedVehicleIds) {
        return vehicleService.findAvailableVehicles(bookedVehicleIds);
    }

}
