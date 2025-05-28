package com.example.vehicle_service.service;

import com.example.vehicle_service.model.Vehicle;
import com.example.vehicle_service.model.VehicleImage;
import com.example.vehicle_service.repository.VehicleRepository;
import com.example.vehicle_service.utils.ImageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {
    @Autowired
    private  VehicleRepository vehicleRepository;


    public  List<Vehicle> getVehiclesByIds(List<Vehicle> vehicleIds){
        List<Long> ids = new ArrayList<>();
        for (Vehicle vehicle : vehicleIds) {
            ids.add(vehicle.getId());
        }
        return vehicleRepository.findAllById(ids);
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    public List<Vehicle> findByName(String name) {
        List<Vehicle> vehicles = vehicleRepository.findFirst20ByNameContainingIgnoreCase(name);
        for (Vehicle vehicle : vehicles) {
            for (VehicleImage vehicleImage : vehicle.getVehicleImages()) {
                String imgBase64 = ImageUtils.encodeToBase64(vehicleImage.getImageData());
                String imageUri = "data:" + vehicleImage.getType() + ";base64," + imgBase64;
                vehicleImage.setImageUri(imageUri);
            }
        }
        return vehicles;
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    public List<Vehicle> findAll() {
        List<Vehicle> vehicles = vehicleRepository.findTop20ByOrderByIdAsc();
        for (Vehicle vehicle : vehicles) {
            for (VehicleImage vehicleImage : vehicle.getVehicleImages()) {
                String imgBase64 = ImageUtils.encodeToBase64(vehicleImage.getImageData());
                String imageUri = "data:" + vehicleImage.getType() + ";base64," + imgBase64;
                vehicleImage.setImageUri(imageUri);
            }
        }
        return vehicles;
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @Transactional
    public Boolean createVehicle(Vehicle vehicle) {
        try {
            if (vehicle.getVehicleImages() != null) {
                for (VehicleImage image : vehicle.getVehicleImages()) {
                    image.setVehicle(vehicle);
                    if (image.getImageData() != null) {
                        image.setImageData(ImageUtils.compressImage(image.getImageData()));
                    }
                }
            }
            vehicleRepository.save(vehicle);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @Transactional
    public Boolean editVehicle(Long id, Vehicle vehicle) {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(id);
        if (optionalVehicle.isPresent()) {
            Vehicle existingVehicle = optionalVehicle.get();

            try {
                existingVehicle.setName(vehicle.getName());
                existingVehicle.setLicensePlate(vehicle.getLicensePlate());
                existingVehicle.setBrand(vehicle.getBrand());
                existingVehicle.setType(vehicle.getType());
                existingVehicle.setSeatCount(vehicle.getSeatCount());
                existingVehicle.setManufactureYear(vehicle.getManufactureYear());
                existingVehicle.setRentalPrice(vehicle.getRentalPrice());
                existingVehicle.setVehicleCondition(vehicle.getVehicleCondition());
                existingVehicle.setOwnerType(vehicle.getOwnerType());
                existingVehicle.setDescription(vehicle.getDescription());

                if (vehicle.getVehicleImages() != null) {
                    List<VehicleImage> existingImages = existingVehicle.getVehicleImages();
                    List<VehicleImage> newImages = vehicle.getVehicleImages();
                    existingImages
                            .removeIf(existingImage -> newImages.stream().noneMatch(newImage -> newImage.getId() != null
                                    && newImage.getId().equals(existingImage.getId())));
                    for (VehicleImage newImage : newImages) {
                        if (newImage.getId() == null) { // Ảnh mới
                            newImage.setVehicle(existingVehicle);
                            if (newImage.getImageData() != null) {
                                newImage.setImageData(ImageUtils.compressImage(newImage.getImageData()));
                            }
                            existingImages.add(newImage);
                        } else { // Cập nhật ảnh cũ
                            for (VehicleImage existingImage : existingImages) {
                                if (existingImage.getId().equals(newImage.getId())) {
                                    // existingImage.setName(newImage.getName());
                                    // existingImage.setType(newImage.getType());
                                    existingImage.setIsThumbnail(newImage.getIsThumbnail());
                                    // if (newImage.getImageData() != null) {
                                    // existingImage.setImageData(ImageUtils.compressImage(newImage.getImageData()));
                                    // }
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    existingVehicle.getVehicleImages().clear();
                }

                vehicleRepository.save(existingVehicle);
                return true;
            } catch (IOException e) {
                System.err.println("Error compressing image: " + e.getMessage());
                return false;
            }
        } else {
            throw new RuntimeException("Vehicle not found with id: " + id);
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @Transactional
    public Boolean deleteVehicle(Long id) {
        try {
            if (!vehicleRepository.existsById(id)) {
                return false;
            }
            vehicleRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    public List<Vehicle> findAvailableVehicles(List<Vehicle> bookedVehicleIds) {

        List<Long> ids = new ArrayList<>();
        for (Vehicle vehicle : bookedVehicleIds) {
            ids.add(vehicle.getId());
        }
        // Lấy danh sách xe đã được đặt trong khoảng thời gian này
        List<Vehicle> bookedVehicles = vehicleRepository.findByIdIn(ids);

        // Lấy tất cả xe
        List<Vehicle> allVehicles = vehicleRepository.findAll();

        // Lọc ra những xe chưa được đặt
        List<Vehicle> availableVehicles = allVehicles.stream()
                .filter(vehicle -> !bookedVehicles.contains(vehicle))
                .collect(Collectors.toList());
        return availableVehicles;
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
