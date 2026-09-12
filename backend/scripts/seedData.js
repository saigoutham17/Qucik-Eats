import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import userModel from "../models/userModel.js";
import restaurantModel from "../models/restaurantModel.js";
import foodModel from "../models/foodModel.js";
import riderModel from "../models/riderModel.js";

dotenv.config();

const seed = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is missing in environment variables (.env)");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB!");

    const salt = await bcrypt.genSalt(10);
    const demoPassword = await bcrypt.hash("QuickEats@123", salt);

    // 1. Seed Super Admin
    let admin = await userModel.findOne({ email: "admin@quickeats.com" });
    if (!admin) {
      admin = await userModel.create({
        name: "Sai Goutham (Admin)",
        email: "admin@quickeats.com",
        password: demoPassword,
        isAdmin: true,
      });
      console.log("✅ Created Super Admin: admin@quickeats.com / QuickEats@123");
    } else {
      console.log("ℹ️  Super Admin already exists");
    }

    // 2. Seed Customer
    let customer = await userModel.findOne({ email: "customer@quickeats.com" });
    if (!customer) {
      customer = await userModel.create({
        name: "Demo Customer",
        email: "customer@quickeats.com",
        password: demoPassword,
        isAdmin: false,
      });
      console.log("✅ Created Customer: customer@quickeats.com / QuickEats@123");
    } else {
      console.log("ℹ️  Customer already exists");
    }

    // 3. Seed Restaurant
    let restaurant = await restaurantModel.findOne({ email: "restaurant@quickeats.com" });
    if (!restaurant) {
      restaurant = await restaurantModel.create({
        restaurantName: "The Royal Biryani & Grill",
        ownerName: "Chef Raghav",
        email: "restaurant@quickeats.com",
        password: demoPassword,
        phone: "+919876543210",
        address: "742 Evergreen Terrace, Food District",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        isApproved: true,
        rejected: false,
        location: {
          lat: 12.9716,
          lng: 77.5946,
        },
      });
      console.log("✅ Created Restaurant: restaurant@quickeats.com / QuickEats@123");

      // Seed Foods for this restaurant
      const sampleFoods = [
        {
          restaurantId: restaurant._id,
          name: "Hyderabadi Dum Biryani",
          description: "Fragrant basmati rice slow-cooked with tender marinated spices and herbs.",
          price: 349,
          image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800",
          category: "Biriyani",
          prepTime: 25,
          spiceLevel: "Hot",
          tags: ["Chef Special", "Bestseller"],
          isAvailable: true,
          avgRating: 4.8,
          ratingCount: 120,
        },
        {
          restaurantId: restaurant._id,
          name: "Paneer Butter Masala",
          description: "Cottage cheese simmered in a rich tomato, butter, and cashew gravy.",
          price: 279,
          image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800",
          category: "Pure Veg",
          prepTime: 20,
          spiceLevel: "Medium",
          tags: ["Vegetarian", "Popular"],
          isAvailable: true,
          avgRating: 4.7,
          ratingCount: 85,
        },
        {
          restaurantId: restaurant._id,
          name: "Wood-Fired Margherita Pizza",
          description: "Artisan sourdough base topped with San Marzano tomatoes, fresh mozzarella and basil.",
          price: 399,
          image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800",
          category: "Pizza",
          prepTime: 15,
          spiceLevel: "Mild",
          tags: ["Italian", "Cheesy"],
          isAvailable: true,
          avgRating: 4.9,
          ratingCount: 210,
        },
        {
          restaurantId: restaurant._id,
          name: "Classic Chocolate Lava Cake",
          description: "Warm molten dark chocolate center dusted with powdered sugar.",
          price: 199,
          image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800",
          category: "Deserts",
          prepTime: 12,
          spiceLevel: "Mild",
          tags: ["Dessert", "Sweet"],
          isAvailable: true,
          avgRating: 4.9,
          ratingCount: 340,
        },
      ];

      await foodModel.insertMany(sampleFoods);
      console.log(`✅ Added ${sampleFoods.length} sample dishes for ${restaurant.restaurantName}`);
    } else {
      console.log("ℹ️  Restaurant already exists");
    }

    // 4. Seed Rider
    let rider = await riderModel.findOne({ email: "rider@quickeats.com" });
    if (!rider) {
      rider = await riderModel.create({
        name: "Vikram Singh",
        email: "rider@quickeats.com",
        password: demoPassword,
        phone: "+919123456780",
        vehicleType: "Bike",
        vehicleNumber: "KA-01-EQ-9876",
        verificationStatus: "approved",
        isOnline: true,
        isAvailable: true,
        location: {
          lat: 12.9720,
          lng: 77.5950,
          updatedAt: new Date(),
        },
        totalEarnings: 1540,
        lifetimeDeliveries: 38,
      });
      console.log("✅ Created Delivery Rider: rider@quickeats.com / QuickEats@123");
    } else {
      console.log("ℹ️  Rider already exists");
    }

    console.log("\n==========================================");
    console.log("🎉 QUICK EATS DEMO SEED COMPLETED!");
    console.log("==========================================");
    console.log("Default Credentials for all demo accounts:");
    console.log("🔑 Password: QuickEats@123");
    console.log("👑 Super Admin: admin@quickeats.com");
    console.log("🍽️ Restaurant:   restaurant@quickeats.com");
    console.log("🛵 Rider:        rider@quickeats.com");
    console.log("👤 Customer:     customer@quickeats.com");
    console.log("==========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeder failed:", error);
    process.exit(1);
  }
};

seed();
