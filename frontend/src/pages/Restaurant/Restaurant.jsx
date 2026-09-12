import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import "./Restaurant.css";
import verify from "../../assets/verify.png";
import { StoreContext } from "../../Context/StoreContext"; 

const Restaurant = () => {
  const { id } = useParams();
  const { url, restaurants, food_list } = useContext(StoreContext);
  const [restaurantFoods, setRestaurantFoods] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  const fetchRestaurantFoods = async () => {
    try {
      const response = await axios.get(`${url}/api/food/restaurant/${id}`, { timeout: 3000 });
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        setRestaurantFoods(response.data.data);
        setRestaurant(response.data.data[0].restaurantId);
        return;
      }
    } catch (error) {
      // Offline fallback
    }

    const currentRest = restaurants.find((r) => r._id === id);
    if (currentRest) setRestaurant(currentRest);
    setRestaurantFoods(food_list.slice(0, 8));
  };

  useEffect(() => {
    fetchRestaurantFoods();
  }, [id, restaurants, food_list]);

  return (
    <div className="restaurant-page">
      {restaurant && (
        <div className="restaurant-header">
          <div className="restaurant-name-box">
            <h1>{restaurant.restaurantName}</h1>
            {restaurant.isApproved && (
              <img src={verify} alt="Verified" className="restaurant-verified" />
            )}
          </div>
          <p>{restaurant.address}</p>
        </div>
      )}
      <FoodDisplay
        category="All"
        foods={restaurantFoods}
        restaurantName={restaurant?.restaurantName}
      />
    </div>
  );
};

export default Restaurant;
