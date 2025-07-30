// Скрипт для генерации 50 изображений для новостей
// Каждое изображение будет связано с технологиями, ИИ, стартапами

const imageDescriptions = [
  "AI neural network visualization with glowing connections, futuristic tech background",
  "Startup office with young entrepreneurs working on laptops, modern workspace",
  "Robot hand shaking human hand, artificial intelligence collaboration",
  "Data center with server racks and blue LED lights, technology infrastructure",
  "Mobile app development on smartphone screens, digital innovation",
  "Blockchain network visualization with connected nodes, cryptocurrency technology",
  "Virtual reality headset with holographic interface, immersive technology",
  "Electric car charging station with modern design, sustainable technology",
  "Drone flying over city skyline, autonomous technology",
  "Smart home automation system with connected devices, IoT technology",
  "Quantum computer with quantum bits visualization, next-gen computing",
  "Biotechnology lab with DNA helix, medical innovation",
  "Space technology with satellite orbiting Earth, aerospace innovation",
  "Cybersecurity shield protecting digital data, online security",
  "3D printing technology creating complex objects, additive manufacturing",
  "Augmented reality glasses showing digital overlay, mixed reality",
  "Green energy wind turbines in sunset, renewable technology",
  "Autonomous vehicle on smart road, transportation innovation",
  "Cloud computing infrastructure with data flow, digital transformation",
  "Machine learning algorithm processing big data, AI analytics",
  "Smart city with connected infrastructure, urban technology",
  "Fintech mobile banking app interface, financial technology",
  "Gaming console with virtual reality setup, entertainment technology",
  "Healthcare technology with medical devices, digital health",
  "E-commerce platform with shopping cart, online retail technology",
  "Social media network visualization, digital communication",
  "Cryptocurrency mining rig with graphics cards, digital currency",
  "Smartphone with multiple app screens, mobile technology",
  "Laptop with coding interface, software development",
  "Internet of Things connected devices network, smart technology",
  "Artificial intelligence chatbot interface, conversational AI",
  "Digital marketing analytics dashboard, online advertising",
  "Cybersecurity firewall protecting network, digital security",
  "Cloud storage with data synchronization, digital backup",
  "Mobile payment system with contactless technology, fintech",
  "Video conferencing platform with virtual backgrounds, remote work",
  "E-learning platform with online courses, digital education",
  "Smart watch with health monitoring, wearable technology",
  "Digital art creation with AI tools, creative technology",
  "Smart speaker with voice assistant, home automation",
  "Electric scooter sharing service, urban mobility",
  "Food delivery app with restaurant integration, delivery technology",
  "Music streaming service with personalized playlists, entertainment tech",
  "Fitness tracking app with workout analytics, health technology",
  "Real estate platform with virtual tours, property technology",
  "Travel booking app with AI recommendations, tourism technology",
  "Language learning app with AI tutor, education technology",
  "Smart thermostat controlling home temperature, energy efficiency",
  "Digital wallet with cryptocurrency support, financial innovation",
  "Video streaming platform with content recommendations, media technology"
];

// Экспортируем описания для использования в других скриптах
if (typeof module !== 'undefined' && module.exports) {
  module.exports = imageDescriptions;
}

console.log(`Generated ${imageDescriptions.length} image descriptions for tech news`); 