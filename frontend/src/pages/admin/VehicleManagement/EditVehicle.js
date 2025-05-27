import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

export const EditVehicle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [vehicle, setVehicle] = useState({});
  const [thumbnailIndex, setThumbnailIndex] = useState(null);

  useEffect(() => {
    const vehicleFromState = location.state?.vehicle;
    console.log(vehicleFromState);
    if (vehicleFromState) {
      setVehicle({
        ...vehicleFromState,
        vehicleImages: vehicleFromState.vehicleImages.map((img, index) => ({
          id: img.id,
          name: img.name,
          type: img.type,
          url: img.imageUri ?? "",
          isThumbnail: img.isThumbnail,
          file: null, // vì không có file thực khi load từ backend
        })),
      });

      const thumbnailIdx = vehicleFromState.vehicleImages.findIndex(
        (img) => img.isThumbnail
      );
      setThumbnailIndex(thumbnailIdx !== -1 ? thumbnailIdx : null);
      console.log(vehicle);
    } else {
      console.error("Không tìm thấy xe trong state.");
    }
  }, [location.state, id]);
  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };
  const handleAddImage = (e) => {
    const files = Array.from(e.target.files);
    const filteredFiles = files.filter(
      (file) =>
        !vehicle.vehicleImages.some(
          (img) =>
            (img.file?.name ?? img.name) === file.name &&
            (img.file?.size ?? img.size) === file.size &&
            (img.file?.type ?? img.type) === file.type
        )
    );
    const newImages = filteredFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      isThumbnail: false,
    }));

    setVehicle((prev) => ({
      ...prev,
      vehicleImages: [...prev.vehicleImages, ...newImages],
    }));

    if (vehicle.vehicleImages.length === 0 && newImages.length > 0) {
      setThumbnailIndex(0);
      setVehicle((prev) => ({
        ...prev,
        vehicleImages: prev.vehicleImages.map((img, index) =>
          index === 0 ? { ...img, isThumbnail: true } : img
        ),
      }));
    }

    e.target.value = null;
  };
  const handleRemoveImage = (index) => {
    const newImages = [...vehicle.vehicleImages];
    newImages.splice(index, 1);

    setVehicle((prev) => ({
      ...prev,
      vehicleImages: newImages,
    }));

    if (thumbnailIndex === index) {
      setThumbnailIndex(newImages.length ? 0 : null);
      setVehicle((prev) => ({
        ...prev,
        vehicleImages: newImages.map((img, i) =>
          i === 0 && newImages.length
            ? { ...img, isThumbnail: true }
            : { ...img, isThumbnail: false }
        ),
      }));
    } else if (thumbnailIndex > index) {
      setThumbnailIndex((prev) => prev - 1);
    }
  };

  const handleThumbnailSelect = (index) => {
    if (index === thumbnailIndex) {
      setVehicle((prev) => ({
        ...prev,
        vehicleImages: prev.vehicleImages.map((img, i) => ({
          ...img,
          isThumbnail: false,
        })),
      }));
      setThumbnailIndex(null);
    } else {
      setVehicle((prev) => ({
        ...prev,
        vehicleImages: prev.vehicleImages.map((img, i) => ({
          ...img,
          isThumbnail: i === index,
        })),
      }));

      setThumbnailIndex(index);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const vehicleToSend = {
      ...vehicle,
      vehicleImages: vehicle.vehicleImages.map(
        ({ file, url, ...rest }) => rest
      ),
    };
    formData.append("vehicle", JSON.stringify(vehicleToSend));
    vehicle.vehicleImages.forEach((image, index) => {
      formData.append(`vehicleImages`, image.file);
    });
    try {
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }
      const response = await axios.post(
        `http://localhost:8081/api/management/vehicle/edit/${id}`,
        formData
      );
      if (response.data === true) {
        alert("Sửa thành công");
        setTimeout(() => {
          navigate("/admin/management/vehicle");
        }, 1000);
      } else {
        alert("Sửa xe thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto p-6 bg-white rounded shadow space-y-6"
    >
      <h1 className="text-2xl font-bold">Sửa xe</h1>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Id", name: "id" },
          { label: "Tên xe", name: "name" },
          { label: "Biển số", name: "licensePlate" },
          { label: "Hãng xe", name: "brand" },
          { label: "Loại xe", name: "type" },
          { label: "Số chỗ", name: "seatCount", type: "number" },
          { label: "Năm sản xuất", name: "manufactureYear", type: "number" },
          { label: "Giá thuê", name: "rentalPrice", type: "number" },
          { label: "Tình trạng", name: "vehicleCondition" },
          { label: "Chủ sở hữu", name: "ownerType" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name}>
            <label className="block px-2 py-1">{label}</label>
            <input
              type={type}
              name={name}
              value={vehicle[name]}
              onChange={handleChange}
              readOnly={["id", "ownerType"].includes(name)}
              className={`w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200 ${
                ["id", "ownerType"].includes(name)
                  ? "bg-gray-100 cursor-not-allowed text-gray-500"
                  : ""
              }`}
              required
            />
          </div>
        ))}
        <div>
          <label className="block px-2 py-1">Mô tả</label>
          <textarea
            name="description"
            value={vehicle.description}
            onChange={handleChange}
            rows="5"
            className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
          ></textarea>
        </div>
      </div>

      {/* Upload ảnh */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Ảnh xe
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleAddImage}
          multiple
        />
        <p className="text-sm text-gray-500 my-2 italic">
          (Chọn vào ảnh bên dưới để đặt làm ảnh thumbnail)
        </p>
      </div>

      {/* Danh sách ảnh */}
      {vehicle.vehicleImages && vehicle.vehicleImages.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {vehicle.vehicleImages.map((img, index) => (
            <div
              key={index}
              className={`relative border-2 rounded overflow-hidden group ${
                thumbnailIndex === index
                  ? "border-blue-500 ring-2 ring-blue-400"
                  : "border-gray-300"
              }`}
            >
              <img
                src={img.url}
                alt={`Ảnh ${index + 1}`}
                className="w-full h-40 object-cover cursor-pointer"
                onClick={() => handleThumbnailSelect(index)}
              />
              {thumbnailIndex === index && (
                <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Thumbnail
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                title="Xoá ảnh"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        className="text-xl bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Sửa xe
      </button>
    </form>
  );
};
