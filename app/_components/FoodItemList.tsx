import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FoodItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  img_path: string;
}

interface RestaurantUser {
  _id: string;
  name: string;
  email: string;
  restaurantName: string;
  city: string;
}

const FoodItemList = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadFoodItems();
  }, []);

  const loadFoodItems = async () => {
    setLoading(true);

    try {
      const localData = localStorage.getItem("restaurantUser");

      if (!localData) {
        console.error("restaurantUser not found in localStorage");
        return;
      }

      let restaurantData: RestaurantUser;

      try {
        restaurantData = JSON.parse(localData);
      } catch (err) {
        console.error("Invalid JSON in localStorage:", err);
        return;
      }

      if (!restaurantData?._id) {
        console.error("Restaurant ID missing in localStorage");
        return;
      }

      const resto_id = restaurantData._id;

      const res = await fetch(`/api/restaurant/foods/${resto_id}`);
      const response = await res.json();

      if (response.success) {
        setFoodItems(response.result);
      } else {
        alert("Food items not found");
      }
    } catch (error) {
      console.error("Error loading food items:", error);
    } finally {
      // This runs AFTER everything above completes
      setLoading(false);
    }
  };

  const deleteFoodItem = async (id: string) => {
    let response = await fetch(`/api/restaurant/foods/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (data.success) {
      loadFoodItems();
    } else {
      alert("food item not deleted");
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow p-8 rounded-xl">
        <p className="text-center text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Food Items</h2>

      <div className="overflow-x-auto rounded-xl shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3">S.N</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Description</th>
              <th className="p-3">Image</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {foodItems.map((item, key) => (
              <tr key={item._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{key + 1}</td>
                <td className="p-3 font-medium">{item.name}</td>
                <td className="p-3">{item.price}</td>
                <td className="p-3 text-gray-600">{item.description}</td>

                <td className="p-3">
                  {item.img_path ? (
                    <div className="h-16 w-16 overflow-hidden rounded">
                      <img
                        src={item.img_path}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 rounded"></div>
                  )}
                </td>

                <td className="p-3 flex gap-3 justify-center">
                  <button
                    onClick={() => deleteFoodItem(item._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => router.push("dashboard/" + item._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FoodItemList;
