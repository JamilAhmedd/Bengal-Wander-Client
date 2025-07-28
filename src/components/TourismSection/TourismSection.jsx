import React, { useState, useEffect } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css"; // Default styles for react-tabs

// Helper function to shuffle an array for random selection
const shuffleArray = (array) => {
  const shuffled = [...array]; // Create a shallow copy to avoid modifying the original array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// --- Demo Data ---
const demoPackages = [
  {
    id: "pkg1",
    photo: "https://placehold.co/400x300/F0F8FF/000000?text=Cox%27s+Bazar",
    tourType: "Beach Holiday",
    tripTitle: "Cox's Bazar Escape",
    price: "$599",
    description:
      "A relaxing trip to the world's longest natural sea beach, perfect for sunbathing and water sports.",
  },
  {
    id: "pkg2",
    photo: "https://placehold.co/400x300/E0FFFF/000000?text=Sylhet+Tea",
    tourType: "Nature & Culture",
    tripTitle: "Sylhet Tea Garden Tour",
    price: "$750",
    description:
      "Explore the lush green tea gardens, waterfalls, and spiritual sites of Sylhet.",
  },
  {
    id: "pkg3",
    photo: "https://placehold.co/400x300/F5F5DC/000000?text=Sundarbans",
    tourType: "Wildlife Safari",
    tripTitle: "Sundarbans Mangrove Adventure",
    price: "$1200",
    description:
      "An adventurous journey into the largest mangrove forest, home to Royal Bengal Tigers and diverse wildlife.",
  },
  {
    id: "pkg4",
    photo: "https://placehold.co/400x300/FFFACD/000000?text=Dhaka+City",
    tourType: "City Exploration",
    tripTitle: "Dhaka Heritage Walk",
    price: "$300",
    description:
      "Discover the historical sites, bustling markets, and vibrant life of Old Dhaka.",
  },
  {
    id: "pkg5",
    photo: "https://placehold.co/400x300/ADD8E6/000000?text=Sajek+Valley",
    tourType: "Mountain Trek",
    tripTitle: "Sajek Valley Expedition",
    price: "$650",
    description:
      "Trek through the clouds in the beautiful Sajek Valley, offering panoramic views.",
  },
  {
    id: "pkg6",
    photo: "https://placehold.co/400x300/98FB98/000000?text=St.+Martins",
    tourType: "Island Getaway",
    tripTitle: "St. Martin's Island Paradise",
    price: "$850",
    description:
      "Relax on the pristine coral beaches of Bangladesh's only coral island.",
  },
];

const demoTourGuides = [
  {
    id: "guide1",
    photo: "https://placehold.co/150x150/FFD700/000000?text=Ahmed",
    name: "Ahmed Khan",
    specialty: "Adventure Tours",
    bio: "With 10 years experience, Ahmed specializes in trekking, wildlife safaris, and eco-tourism.",
    rating: 4.8,
    languages: ["Bengali", "English"],
  },
  {
    id: "guide2",
    photo: "https://placehold.co/150x150/ADFF2F/000000?text=Fatima",
    name: "Fatima Begum",
    specialty: "Cultural & Heritage",
    bio: "Fatima is passionate about sharing the rich history, traditions, and local cuisine of Bangladesh.",
    rating: 4.9,
    languages: ["Bengali", "English", "Hindi"],
  },
  {
    id: "guide3",
    photo: "https://placehold.co/150x150/87CEEB/000000?text=Rahim",
    name: "Rahim Uddin",
    specialty: "Beach & Island Trips",
    bio: "Rahim knows all the best spots for a relaxing beach holiday or island hopping in the Bay of Bengal.",
    rating: 4.7,
    languages: ["Bengali", "English"],
  },
  {
    id: "guide4",
    photo: "https://placehold.co/150x150/FF6347/000000?text=Nusrat",
    name: "Nusrat Jahan",
    specialty: "Nature Photography",
    bio: "Nusrat helps you capture the stunning natural beauty of Bangladesh, from landscapes to local life.",
    rating: 4.9,
    languages: ["Bengali", "English", "Urdu"],
  },
  {
    id: "guide5",
    photo: "https://placehold.co/150x150/DA70D6/000000?text=Jamal",
    name: "Jamal Hossain",
    specialty: "Food & Local Experiences",
    bio: "Jamal guides you through authentic Bangladeshi culinary journeys and vibrant local markets.",
    rating: 4.6,
    languages: ["Bengali", "English", "Arabic"],
  },
  {
    id: "guide6",
    photo: "https://placehold.co/150x150/7FFF00/000000?text=Shanta",
    name: "Shanta Islam",
    specialty: "Family & Group Tours",
    bio: "Shanta ensures smooth, fun, and educational trips for families and large groups of all ages.",
    rating: 4.8,
    languages: ["Bengali", "English"],
  },
  {
    id: "guide7",
    photo: "https://placehold.co/150x150/FFB6C1/000000?text=Kazi",
    name: "Kazi Rahman",
    specialty: "Historical Sites",
    bio: "Kazi brings history to life with his deep knowledge of ancient ruins, monuments, and historical events.",
    rating: 4.7,
    languages: ["Bengali", "English"],
  },
  {
    id: "guide8",
    photo: "https://placehold.co/150x150/20B2AA/000000?text=Laila",
    name: "Laila Chowdhury",
    specialty: "Eco-Tourism",
    bio: "Laila is committed to sustainable travel and exploring Bangladesh's rich biodiversity and natural habitats.",
    rating: 4.9,
    languages: ["Bengali", "English"],
  },
];

const TourismSection = () => {
  const [randomPackages, setRandomPackages] = useState([]);
  const [randomGuides, setRandomGuides] = useState([]);

  // Effect to shuffle data on component mount (simulating "every visit")
  useEffect(() => {
    setRandomPackages(shuffleArray(demoPackages).slice(0, 3));
    setRandomGuides(shuffleArray(demoTourGuides).slice(0, 6));
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to simulate navigation to a detail page
  const handleViewDetails = (type, id) => {
    console.log(`Navigating to ${type} details page for ID: ${id}`);
    // In a real application, you would use React Router or similar:
    // history.push(`/${type}-details/${id}`);
    alert(`Simulating navigation to ${type} details for ID: ${id}`); // Using alert for demo
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
          Explore Bangladesh
        </h2>

        <Tabs className="rounded-lg shadow-xl overflow-hidden bg-white">
          <TabList className="flex border-b border-gray-200 bg-gray-100">
            <Tab className="flex-1 text-center py-4 px-6 cursor-pointer text-lg font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 focus:outline-none ui-selected:border-b-4 ui-selected:border-blue-600 ui-selected:text-blue-800 ui-selected:font-bold">
              Our Packages
            </Tab>
            <Tab className="flex-1 text-center py-4 px-6 cursor-pointer text-lg font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 focus:outline-none ui-selected:border-b-4 ui-selected:border-blue-600 ui-selected:text-blue-800 ui-selected:font-bold">
              Meet Our Tour Guides
            </Tab>
          </TabList>

          {/* Our Packages Tab Panel */}
          <TabPanel className="p-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Handpicked Tour Packages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {randomPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={pkg.photo}
                    alt={pkg.tripTitle}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                      {pkg.tourType}
                    </span>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {pkg.tripTitle}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {pkg.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-green-600">
                        {pkg.price}
                      </span>
                      <button
                        onClick={() => handleViewDetails("package", pkg.id)}
                        className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-md"
                      >
                        View Package
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {randomPackages.length === 0 && (
              <p className="text-center text-gray-500 text-lg">
                No packages available at the moment. Please check back later!
              </p>
            )}
          </TabPanel>

          {/* Meet Our Tour Guides Tab Panel */}
          <TabPanel className="p-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Meet Our Expert Tour Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {randomGuides.map((guide) => (
                <div
                  key={guide.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col items-center p-6 text-center"
                >
                  <img
                    src={guide.photo}
                    alt={guide.name}
                    className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-200"
                  />
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {guide.name}
                  </h4>
                  <p className="text-blue-600 font-semibold mb-2">
                    {guide.specialty}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {guide.bio}
                  </p>
                  <div className="text-gray-700 text-sm mb-2">
                    <span className="font-semibold">Rating:</span>{" "}
                    {guide.rating} ⭐
                  </div>
                  <div className="text-gray-700 text-sm mb-4">
                    <span className="font-semibold">Languages:</span>{" "}
                    {guide.languages.join(", ")}
                  </div>
                  <button
                    onClick={() => handleViewDetails("guide", guide.id)}
                    className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition-colors duration-300 shadow-md mt-auto"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
            {randomGuides.length === 0 && (
              <p className="text-center text-gray-500 text-lg">
                No tour guides available at the moment. Please check back later!
              </p>
            )}
          </TabPanel>
        </Tabs>
      </div>
    </section>
  );
};

export default TourismSection;
