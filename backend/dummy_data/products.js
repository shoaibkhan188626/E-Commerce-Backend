const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Product = require("../models/productModel");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/market", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Function to generate a random image URL using Picsum
function fetchImageUrl() {
  const width = 640;
  const height = 480;
  return `https://picsum.photos/${width}/${height}`;
}

// Categories with sub-categories and specific names
const categories = {
  Electronics: {
    subCategories: ["Smartphones", "Laptops", "Cameras"],
    names: {
      Smartphones: [
        "iPhone 14",
        "Samsung Galaxy S23",
        "Google Pixel 7",
        "OnePlus 11",
        "Xiaomi 12",
        "Sony Xperia 1",
        "Oppo Find X5",
        "Realme GT",
        "Vivo V21",
        "Nokia G50",
      ],
      Laptops: [
        "MacBook Pro",
        "Dell XPS 13",
        "HP Spectre x360",
        "Lenovo ThinkPad",
        "Asus ROG Zephyrus",
        "Acer Swift 3",
        "Microsoft Surface Laptop",
        "Razer Blade 15",
        "LG Gram",
        "Huawei MateBook",
      ],
      Cameras: [
        "Canon EOS R5",
        "Nikon Z9",
        "Sony A7 III",
        "Fujifilm X-T4",
        "Panasonic Lumix S5",
        "Olympus OM-D E-M1",
      ],
    },
  },
  Beauty: {
    subCategories: ["Skincare", "Makeup", "Hair Care"],
    names: {
      Skincare: [
        "Moisturizing Cream",
        "Sunscreen Lotion",
        "Anti-Aging Serum",
        "Cleansing Gel",
        "Face Mask",
        "Toner",
        "Exfoliating Scrub",
        "Night Cream",
        "Eye Cream",
        "Facial Oil",
      ],
      Makeup: [
        "Foundation",
        "Lipstick",
        "Mascara",
        "Eyeshadow Palette",
        "Blush",
        "Highlighter",
        "Setting Spray",
        "Concealer",
        "Eyebrow Pencil",
        "Lip Gloss",
      ],
      HairCare: [
        "Shampoo",
        "Conditioner",
        "Hair Serum",
        "Styling Gel",
        "Hair Spray",
        "Hair Mask",
        "Leave-In Conditioner",
        "Curl Cream",
        "Heat Protectant",
        "Dry Shampoo",
      ],
    },
  },
  Fashion: {
    subCategories: ["Clothing", "Footwear", "Accessories"],
    names: {
      Clothing: [
        "T-Shirt",
        "Jeans",
        "Jacket",
        "Dress",
        "Skirt",
        "Sweater",
        "Shorts",
        "Blouse",
        "Pajamas",
        "Coat",
      ],
      Footwear: [
        "Sneakers",
        "Boots",
        "Sandals",
        "Loafers",
        "Heels",
        "Flip Flops",
        "Brogues",
        "Slippers",
        "Wedges",
        "Espadrilles",
      ],
      Accessories: [
        "Watches",
        "Belts",
        "Hats",
        "Sunglasses",
        "Scarves",
        "Bags",
        "Jewelry",
        "Wallets",
        "Ties",
        "Headphones",
      ],
    },
  },
  Home: {
    subCategories: ["Furniture", "Appliances", "Decor"],
    names: {
      Furniture: [
        "Sofa",
        "Dining Table",
        "Bed",
        "Office Chair",
        "Bookshelf",
        "Coffee Table",
        "Wardrobe",
        "Dresser",
        "Nightstand",
        "TV Stand",
      ],
      Appliances: [
        "Refrigerator",
        "Microwave",
        "Washing Machine",
        "Oven",
        "Dishwasher",
        "Air Conditioner",
        "Vacuum Cleaner",
        "Blender",
        "Coffee Maker",
        "Toaster",
      ],
      Decor: [
        "Wall Art",
        "Rug",
        "Curtains",
        "Lighting Fixture",
        "Vase",
        "Throw Pillow",
        "Candles",
        "Picture Frame",
        "Mirrors",
        "Planters",
      ],
    },
  },
  Sports: {
    subCategories: ["Outdoor Equipment", "Fitness Gear", "Clothing"],
    names: {
      "Outdoor Equipment": [
        "Tent",
        "Sleeping Bag",
        "Camping Stove",
        "Fishing Rod",
        "Hiking Backpack",
        "Cooler",
      ],
      "Fitness Gear": [
        "Yoga Mat",
        "Dumbbells",
        "Resistance Bands",
        "Treadmill",
        "Exercise Bike",
        "Kettlebell",
      ],
      Clothing: [
        "Running Shoes",
        "Cycling Jersey",
        "Gym Shorts",
        "Track Pants",
        "Sports Bra",
        "Compression Tights",
      ],
    },
  },
  Music: {
    subCategories: ["Instruments", "Audio Equipment", "Music Accessories"],
    names: {
      Instruments: [
        "Guitar",
        "Piano",
        "Drums",
        "Violin",
        "Flute",
        "Trumpet",
        "Saxophone",
        "Keyboard",
        "Ukulele",
        "Accordion",
      ],
      "Audio Equipment": [
        "Speakers",
        "Microphone",
        "Headphones",
        "Mixer",
        "Amplifier",
        "Turntable",
      ],
      "Music Accessories": [
        "Guitar Picks",
        "Straps",
        "Cables",
        "Sheet Music",
        "Drumsticks",
        "Metronome",
      ],
    },
  },
  Toys: {
    subCategories: ["Action Figures", "Board Games", "Educational Toys"],
    names: {
      "Action Figures": [
        "Superhero Figure",
        "Doll",
        "Robot",
        "Dinosaur Toy",
        "Vehicle Toy",
        "Fantasy Creature",
      ],
      "Board Games": [
        "Chess Set",
        "Monopoly",
        "Scrabble",
        "Uno",
        "Clue",
        "Catan",
      ],
      "Educational Toys": [
        "Puzzle",
        "Building Blocks",
        "Science Kit",
        "Art Supplies",
        "Math Game",
        "Language Learning Toy",
      ],
    },
  },
  Books: {
    subCategories: ["Fiction", "Non-Fiction", "Children's Books"],
    names: {
      Fiction: [
        "Novel",
        "Mystery Book",
        "Romance Novel",
        "Science Fiction",
        "Fantasy Book",
        "Thriller",
      ],
      "Non-Fiction": [
        "Biography",
        "Self-Help Book",
        "Cooking Book",
        "History Book",
        "Travel Guide",
        "Health Book",
      ],
      "Children's Books": [
        "Picture Book",
        "Storybook",
        "Activity Book",
        "Learning Book",
        "Fairy Tale",
        "Bedtime Story",
      ],
    },
  },
  Automotive: {
    subCategories: ["Car Accessories", "Motorcycle Gear", "Tools"],
    names: {
      "Car Accessories": [
        "Seat Covers",
        "Steering Wheel Cover",
        "Floor Mats",
        "Dash Cam",
        "Phone Mount",
        "Car Charger",
      ],
      "Motorcycle Gear": [
        "Helmet",
        "Gloves",
        "Jacket",
        "Pants",
        "Boots",
        "Protective Gear",
      ],
      Tools: [
        "Wrench Set",
        "Screwdriver Set",
        "Drill",
        "Jack",
        "Tire Inflator",
        "Car Cleaning Kit",
      ],
    },
  },
};

async function generateFakeProducts(batchSize, totalRecords) {
  try {
    for (const category of Object.keys(categories)) {
      const { subCategories, names } = categories[category];
      const totalPerSubCategory = Math.floor(
        totalRecords / subCategories.length
      );

      for (const subCategory of subCategories) {
        for (let i = 0; i < totalPerSubCategory; i++) {
          const imageUrl = fetchImageUrl();
          const productNames = names[subCategory];
          const productName =
            productNames[Math.floor(Math.random() * productNames.length)]; // Randomly select a name from the specific list

          const product = {
            name: productName, // Product name
            description: `${faker.commerce.productAdjective()} ${subCategory} product that provides quality and satisfaction.`,
            price: parseFloat(faker.commerce.price()), // Generates a price
            ratings: faker.number.int({ min: 1, max: 5 }), // Generates a rating between 1 and 5
            images: [
              {
                public_id: faker.string.uuid(),
                url: imageUrl, // Fetches random image URL
              },
            ],
            category: category, // Main category
            subCategory: subCategory, // Sub-category
            stock: faker.number.int({ min: 1, max: 9999 }), // Generates stock quantity
            numOfReviews: faker.number.int({ min: 0, max: 100 }), // Number of reviews
            reviews: [
              {
                user: mongoose.Types.ObjectId(), // Replace with a valid user ID if needed
                name: faker.person.firstName(),
                rating: faker.number.int({ min: 1, max: 5 }), // Random rating
                comment: faker.lorem.sentence(),
              },
            ],
            user: mongoose.Types.ObjectId(), // User ID
            createdAt: faker.date.past(), // Date of creation
          };

          await Product.create(product); // Insert the product into MongoDB
          console.log(`Inserted: ${JSON.stringify(product)}`); // Log the inserted product
        }

        console.log(
          `Inserted ${totalPerSubCategory} products for ${subCategory} in ${category}`
        );
      }
    }
  } catch (error) {
    console.error("Error generating fake data:", error);
  } finally {
    mongoose.connection.close(); // Close the connection after insertion
  }
}

// Generate products
generateFakeProducts(1000, 1000000); // Total records set to 1 million
