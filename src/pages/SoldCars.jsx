import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import ImageUpload from "../components/ImageUpload";

const SoldCars = () => {
  const [soldCars, setSoldCars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: [], // Change from 'image' to 'images' array
    soldDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchSoldCars();
  }, []);

  const fetchSoldCars = async () => {
    try {
      const response = await apiService.soldCars.getAll();
      setSoldCars(response.data.data);
    } catch (error) {
      console.error("Error fetching sold cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("soldDate", formData.soldDate);

      // Handle image upload properly
      if (formData.images && formData.images.length > 0) {
        const imageValue = formData.images[0];
        if (imageValue instanceof File) {
          formDataToSend.append("image", imageValue);
        } else if (typeof imageValue === "string" && imageValue.trim()) {
          formDataToSend.append("imageUrl", imageValue);
        }
      }

      console.log("Submitting sold car data:", {
        name: formData.name,
        description: formData.description,
        soldDate: formData.soldDate,
        hasImage: !!(formData.images && formData.images.length > 0),
      });

      if (editingCar) {
        // Update existing car
        await apiService.soldCars.update(editingCar._id, formDataToSend);
        alert("Sold car updated successfully!");
      } else {
        // Create new car
        await apiService.soldCars.create(formDataToSend);
        alert("Sold car added successfully!");
      }

      fetchSoldCars();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving sold car:", error);
      console.error("Error details:", error.response?.data);
      alert(error.response?.data?.message || "Error saving sold car");
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      description: car.description,
      images: car.image ? [car.image] : [],
      soldDate: new Date(car.soldDate).toISOString().split("T")[0],
    });
    setShowModal(true);
  };

  const handleDelete = async (carId) => {
    if (
      window.confirm("Are you sure you want to delete this sold car record?")
    ) {
      try {
        await apiService.soldCars.delete(carId);
        alert("Sold car deleted successfully!");
        fetchSoldCars();
      } catch (error) {
        console.error("Error deleting sold car:", error);
        alert(error.response?.data?.message || "Error deleting sold car");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      images: [], // Reset to empty array
      soldDate: new Date().toISOString().split("T")[0],
    });
    setEditingCar(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Sold Cars</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Sold Car
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {soldCars.map((car) => (
          <div
            key={car._id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            {car.image && (
              <img
                src={
                  car.image.startsWith("http")
                    ? car.image
                    : `${
                        import.meta.env.VITE_API_URL?.replace("/api", "") ||
                        "http://localhost:5001"
                      }${car.image}`
                }
                alt={car.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                }}
              />
            )}
            {!car.image && (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold">{car.name}</h3>
              <p className="text-gray-600">{car.description}</p>
              <p className="text-sm text-gray-500">
                Sold on: {new Date(car.soldDate).toLocaleDateString()}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(car)}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  <PencilIcon className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(car._id)}
                  className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <form onSubmit={handleSubmit} className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingCar ? "Edit Sold Car" : "Add Sold Car"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Car Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sold Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.soldDate}
                    onChange={(e) =>
                      setFormData({ ...formData, soldDate: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image
                  </label>
                  <ImageUpload
                    images={formData.images}
                    onImagesChange={(images) =>
                      setFormData({ ...formData, images: images })
                    }
                    maxImages={1}
                    type="cars"
                    uploadMode="file"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {editingCar ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoldCars;
