
import { Coffee, Gift, ShoppingBag, Sparkles } from "lucide-react-native";
import React from "react";

/* Styles & Constants */
import { COLORS } from '@/constants';






// Sample Data for the Grid



 const SUGGESTIONS = [
  { id: '1', title: 'Summer Trends', icon: <Sparkles size={18} color={COLORS.accent} />, prompt: "Show me trending summer outfits" },
  { id: '2', title: 'Tech Gadgets', icon: <ShoppingBag size={18} color={COLORS.secondary} />, prompt: "Latest high-quality wireless earbuds" },
  { id: '3', title: 'Gift Ideas', icon: <Gift size={18} color="#FF6B6B" />, prompt: "Unique gift ideas for tech lovers" },
  { id: '4', title: 'Coffee Gear', icon: <Coffee size={18} color="#D4A373" />, prompt: "Best espresso machines for home" },

  { id: '5', title: 'Home Decor', icon: <Sparkles size={18} color="#8E44AD" />, prompt: "Modern home decor ideas for small spaces" },
  { id: '6', title: 'Fitness Gear', icon: <ShoppingBag size={18} color="#27AE60" />, prompt: "Top home workout equipment for beginners" },
  { id: '7', title: 'Smartphones', icon: <Sparkles size={18} color="#2980B9" />, prompt: "Best smartphones under $500" },
  { id: '8', title: 'Gaming Setup', icon: <ShoppingBag size={18} color="#2C3E50" />, prompt: "Ultimate gaming setup ideas" },
  { id: '9', title: 'Travel Essentials', icon: <Gift size={18} color="#16A085" />, prompt: "Must-have travel accessories for long flights" },
  { id: '10', title: 'Skincare', icon: <Sparkles size={18} color="#E67E22" />, prompt: "Daily skincare routine for glowing skin" },

  { id: '11', title: 'Kitchen Tools', icon: <Coffee size={18} color="#C0392B" />, prompt: "Best kitchen gadgets for beginners" },
  { id: '12', title: 'Books to Read', icon: <Gift size={18} color="#7F8C8D" />, prompt: "Top books to read this year" },
  { id: '13', title: 'Outdoor Gear', icon: <ShoppingBag size={18} color="#1ABC9C" />, prompt: "Camping essentials for beginners" },
  { id: '14', title: 'Luxury Watches', icon: <Sparkles size={18} color="#34495E" />, prompt: "Best luxury watches under $2000" },
  { id: '15', title: 'Sneaker Picks', icon: <ShoppingBag size={18} color="#9B59B6" />, prompt: "Trending sneakers this year" },

  { id: '16', title: 'Work From Home', icon: <Sparkles size={18} color="#2ECC71" />, prompt: "Best work-from-home setup ideas" },
  { id: '17', title: 'Healthy Snacks', icon: <Gift size={18} color="#F1C40F" />, prompt: "Healthy snack ideas for busy days" },
  { id: '18', title: 'Car Accessories', icon: <ShoppingBag size={18} color="#E74C3C" />, prompt: "Top car accessories for comfort" },
  { id: '19', title: 'Photography', icon: <Sparkles size={18} color="#3498DB" />, prompt: "Beginner photography gear guide" },
  { id: '20', title: 'Pet Supplies', icon: <Gift size={18} color="#E84393" />, prompt: "Essential supplies for new pet owners" },

  { id: '21', title: 'Minimalist Style', icon: <Sparkles size={18} color="#BDC3C7" />, prompt: "Minimalist wardrobe essentials" },
  { id: '22', title: 'Budget Tech', icon: <ShoppingBag size={18} color="#2D3436" />, prompt: "Best budget tech gadgets 2026" },
  { id: '23', title: 'DIY Projects', icon: <Gift size={18} color="#6C5CE7" />, prompt: "Fun DIY projects for home" },
  { id: '24', title: 'Office Chairs', icon: <ShoppingBag size={18} color="#00B894" />, prompt: "Best ergonomic office chairs" },
  { id: '25', title: 'Perfumes', icon: <Sparkles size={18} color="#FD79A8" />, prompt: "Top perfumes for everyday wear" },

  { id: '26', title: 'Winter Fashion', icon: <Sparkles size={18} color="#0984E3" />, prompt: "Winter fashion trends 2026" },
  { id: '27', title: 'Backpacks', icon: <ShoppingBag size={18} color="#6D4C41" />, prompt: "Best backpacks for travel and work" },
  { id: '28', title: 'Streaming Gear', icon: <Sparkles size={18} color="#D63031" />, prompt: "Starter streaming setup guide" },
  { id: '29', title: 'Smart Home', icon: <ShoppingBag size={18} color="#00CEC9" />, prompt: "Best smart home devices" },
  { id: '30', title: 'Meal Prep', icon: <Coffee size={18} color="#E17055" />, prompt: "Easy meal prep ideas for the week" },

  { id: '31', title: 'Hair Care', icon: <Sparkles size={18} color="#FAB1A0" />, prompt: "Hair care routine for healthy hair" },
  { id: '32', title: 'Laptops', icon: <ShoppingBag size={18} color="#636E72" />, prompt: "Best laptops for students" },
  { id: '33', title: 'Yoga Gear', icon: <Gift size={18} color="#55EFC4" />, prompt: "Essential yoga gear for beginners" },
  { id: '34', title: 'Cycling', icon: <ShoppingBag size={18} color="#81ECEC" />, prompt: "Best cycling gear for beginners" },
  { id: '35', title: 'Board Games', icon: <Gift size={18} color="#A29BFE" />, prompt: "Fun board games for family nights" },

  { id: '36', title: 'Music Gear', icon: <Sparkles size={18} color="#FF7675" />, prompt: "Best music production gear" },
  { id: '37', title: 'Sleep Essentials', icon: <Gift size={18} color="#74B9FF" />, prompt: "Products for better sleep quality" },
  { id: '38', title: 'Camping Food', icon: <Coffee size={18} color="#00B894" />, prompt: "Easy camping food ideas" },
  { id: '39', title: 'Sunglasses', icon: <Sparkles size={18} color="#FDCB6E" />, prompt: "Trending sunglasses styles" },
  { id: '40', title: 'Wallets', icon: <ShoppingBag size={18} color="#2C3E50" />, prompt: "Best minimalist wallets" },

  { id: '41', title: 'Digital Art', icon: <Sparkles size={18} color="#6C5CE7" />, prompt: "Tools for digital art beginners" },
  { id: '42', title: 'Running Shoes', icon: <ShoppingBag size={18} color="#E17055" />, prompt: "Best running shoes for beginners" },
  { id: '43', title: 'Fitness Apps', icon: <Sparkles size={18} color="#00CEC9" />, prompt: "Top fitness apps to try" },
  { id: '44', title: 'Travel Bags', icon: <ShoppingBag size={18} color="#D35400" />, prompt: "Best carry-on travel bags" },
  { id: '45', title: 'Makeup Kits', icon: <Gift size={18} color="#E84393" />, prompt: "Beginner makeup kit essentials" },

  { id: '46', title: 'Desk Setup', icon: <Sparkles size={18} color="#34495E" />, prompt: "Clean and aesthetic desk setup ideas" },
  { id: '47', title: 'Water Bottles', icon: <ShoppingBag size={18} color="#0984E3" />, prompt: "Best reusable water bottles" },
  { id: '48', title: 'Phone Accessories', icon: <ShoppingBag size={18} color="#2ECC71" />, prompt: "Must-have phone accessories" },
  { id: '49', title: 'Cooking Recipes', icon: <Coffee size={18} color="#E67E22" />, prompt: "Quick dinner recipes for busy people" },
  { id: '50', title: 'Budget Travel', icon: <Gift size={18} color="#16A085" />, prompt: "Tips for traveling on a budget" },
  { id: '51', title: 'Content Creation', icon: <Sparkles size={18} color="#9B59B6" />, prompt: "Tools for content creators" },
  { id: '52', title: 'Freelancing', icon: <Sparkles size={18} color="#1ABC9C" />, prompt: "How to start freelancing online" },
];


export { SUGGESTIONS };

