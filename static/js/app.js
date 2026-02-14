// API Base URL
const API_BASE = window.location.origin + "/api";

// State Management
const state = {
  currentPage: "home",
  modules: [],
  currentModule: null,
  currentLesson: null,
  userProgress: [],
  isOnline: navigator.onLine,
  user: null,
  isAuthenticated: false,
};

// Utility Functions
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function showLoading() {
  document.getElementById("loading").classList.remove("hidden");
}

function hideLoading() {
  document.getElementById("loading").classList.add("hidden");
}

function showError(message) {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
            <div class="flex items-center">
                <i class="fas fa-exclamation-triangle text-2xl mr-3"></i>
                <div>
                    <strong class="font-bold">Error!</strong>
                    <span class="block sm:inline"> ${message}</span>
                </div>
            </div>
        </div>
    `;
}

function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  const icon = button.querySelector('i');
  
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

// API Functions
async function fetchAPI(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();

    // Handle paginated responses from DRF
    if (data && typeof data === "object" && "results" in data) {
      return data.results;
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Page Renderers
async function renderHome() {
  showLoading();
  const mainContent = document.getElementById("main-content");
  
  try {
    // Fetch platform stats
    const stats = await fetchAPI("/stats/");
    
    mainContent.innerHTML = `
        <!-- Hero Section -->
        <div class="hero-gradient text-white py-12 sm:py-16 md:py-24 lg:py-32">
            <div class="container mx-auto px-4 sm:px-6">
                <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
                    <div class="text-center lg:text-left">
                        <div class="inline-block bg-white bg-opacity-20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
                            <span class="text-xs sm:text-sm font-semibold"><i class="fas fa-map-marker-alt mr-1"></i> Proudly Ghanaian</span>
                        </div>
                        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                            Digital Skills Meet <span class="text-ghana-yellow">Cultural Wisdom</span>
                        </h1>
                        <p class="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-white text-opacity-90 leading-relaxed">
                            Learn essential digital literacy through Ghana's rich Adinkra symbols. 
                            Free, accessible, and designed for you.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                            <button onclick="navigateTo('modules')" class="bg-white text-adinkra-brown px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition">
                                <span class="hidden sm:inline">Start Learning Free</span>
                                <span class="sm:hidden">Start Learning</span>
                                <i class="fas fa-arrow-right ml-2"></i>
                            </button>
                            <button onclick="navigateTo('about')" class="bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-bold hover:bg-white hover:text-adinkra-brown transition">
                                Learn More
                            </button>
                        </div>
                    </div>
                    <div class="hidden lg:flex justify-center items-center">
                        <div class="relative">
                            <img src="/static/logo.jpg" alt="Adinkra Logo" class="w-48 lg:w-64 h-auto float-animation opacity-90 rounded-2xl shadow-2xl" />
                            <div class="absolute -top-3 lg:-top-4 -right-3 lg:-right-4 bg-ghana-yellow text-adinkra-dark font-bold px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm shadow-lg">
                                100% Free
                            </div>
                            <div class="absolute -bottom-3 lg:-bottom-4 -left-3 lg:-left-4 bg-ghana-green text-white font-bold px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm shadow-lg">
                                Self-Paced
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Stats Section -->
        <div class="bg-white py-12 shadow-md">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                    <div class="text-center">
                        <div class="text-4xl font-bold text-adinkra-brown mb-2">${stats.active_learners}${stats.active_learners >= 100 ? '+' : ''}</div>
                        <div class="text-gray-600 text-sm">Active Learners</div>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl font-bold text-ghana-green mb-2">${stats.total_modules}</div>
                        <div class="text-gray-600 text-sm">Learning Modules</div>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl font-bold text-ghana-yellow mb-2">${stats.total_lessons}${stats.total_lessons >= 20 ? '+' : ''}</div>
                        <div class="text-gray-600 text-sm">Interactive Lessons</div>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl font-bold text-ghana-red mb-2">100%</div>
                        <div class="text-gray-600 text-sm">Free Access</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Features Section -->
        <div class="container mx-auto px-4 py-20">
            <div class="text-center mb-16">
                <h3 class="text-4xl font-bold text-adinkra-dark mb-4">What You'll Master</h3>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                    From basic mobile skills to advanced cybersecurity, learn everything you need for the digital world
                </p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
                <div class="feature-card bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl border-t-4 border-adinkra-brown">
                    <div class="bg-gradient-to-br from-adinkra-brown to-adinkra-dark text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                        <i class="fas fa-shield-alt text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-center mb-3 text-adinkra-dark">Cybersecurity</h3>
                    <p class="text-gray-600 text-center mb-4">Protect your digital identity and personal information online</p>
                    <div class="text-center">
                        <span class="inline-block bg-adinkra-brown bg-opacity-10 text-adinkra-brown text-xs font-semibold px-3 py-1 rounded-full">
                            Beginner Friendly
                        </span>
                    </div>
                </div>
                
                <div class="feature-card bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl border-t-4 border-ghana-green">
                    <div class="bg-gradient-to-br from-ghana-green to-green-700 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                        <i class="fas fa-comments text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-center mb-3 text-adinkra-dark">WhatsApp Mastery</h3>
                    <p class="text-gray-600 text-center mb-4">Use WhatsApp securely for personal and business communication</p>
                    <div class="text-center">
                        <span class="inline-block bg-ghana-green bg-opacity-10 text-ghana-green text-xs font-semibold px-3 py-1 rounded-full">
                            Most Popular
                        </span>
                    </div>
                </div>
                
                <div class="feature-card bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl border-t-4 border-ghana-yellow">
                    <div class="bg-gradient-to-br from-ghana-yellow to-yellow-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                        <i class="fas fa-mobile-alt text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-center mb-3 text-adinkra-dark">Mobile Money</h3>
                    <p class="text-gray-600 text-center mb-4">Master safe mobile money practices for all transactions</p>
                    <div class="text-center">
                        <span class="inline-block bg-ghana-yellow bg-opacity-20 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
                            Essential Skill
                        </span>
                    </div>
                </div>
                
                <div class="feature-card bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl border-t-4 border-blue-500">
                    <div class="bg-gradient-to-br from-blue-500 to-blue-700 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                        <i class="fas fa-globe text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-center mb-3 text-adinkra-dark">Internet Skills</h3>
                    <p class="text-gray-600 text-center mb-4">Navigate the web, find information, and use online resources</p>
                    <div class="text-center">
                        <span class="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                            Foundation
                        </span>
                    </div>
                </div>
                
                <div class="feature-card bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl border-t-4 border-purple-500">
                    <div class="bg-gradient-to-br from-purple-500 to-purple-700 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                        <i class="fas fa-share-alt text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-center mb-3 text-adinkra-dark">Social Media</h3>
                    <p class="text-gray-600 text-center mb-4">Build positive digital presence and protect your privacy</p>
                    <div class="text-center">
                        <span class="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                            Trending
                        </span>
                    </div>
                </div>
                
                <div class="feature-card bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl border-t-4 border-pink-500">
                    <div class="bg-gradient-to-br from-pink-500 to-pink-700 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                        <i class="fas fa-certificate text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-center mb-3 text-adinkra-dark">Earn Badges</h3>
                    <p class="text-gray-600 text-center mb-4">Complete lessons and quizzes to earn achievements</p>
                    <div class="text-center">
                        <span class="inline-block bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full">
                            Rewards
                        </span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Cultural Connection -->
        <div class="bg-gradient-to-r from-adinkra-brown via-adinkra-dark to-adinkra-brown text-white py-20">
            <div class="container mx-auto px-4">
                <div class="max-w-5xl mx-auto">
                    <div class="text-center mb-12">
                        <img src="/static/logo.jpg" alt="Adinkra Logo" class="w-24 h-auto mx-auto mb-4 rounded-xl shadow-lg" />
                        <h3 class="text-4xl font-bold mb-4">Culture Meets Technology</h3>
                        <p class="text-xl text-white text-opacity-90">
                            Each lesson is built around Adinkra symbols, connecting digital skills with Ghana's rich cultural heritage
                        </p>
                    </div>
                    
                    <div class="grid md:grid-cols-3 gap-6 text-center">
                        <div class="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl">
                            <div class="text-4xl mb-3 text-white"><i class="fas fa-graduation-cap"></i></div>
                            <h4 class="font-bold text-lg mb-2">Learn Your Way</h4>
                            <p class="text-white text-opacity-80 text-sm">Self-paced lessons you can complete anytime, anywhere</p>
                        </div>
                        <div class="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl">
                            <div class="text-4xl mb-3 text-white"><i class="fas fa-heart"></i></div>
                            <h4 class="font-bold text-lg mb-2">Culturally Relevant</h4>
                            <p class="text-white text-opacity-80 text-sm">Examples and context from everyday Ghanaian life</p>
                        </div>
                        <div class="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl">
                            <div class="text-4xl mb-3 text-white"><i class="fas fa-gift"></i></div>
                            <h4 class="font-bold text-lg mb-2">Completely Free</h4>
                            <p class="text-white text-opacity-80 text-sm">No hidden costs, no subscriptions, just learning</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- CTA Section -->
        <div class="bg-white py-20">
            <div class="container mx-auto px-4 text-center">
                <h3 class="text-4xl font-bold text-adinkra-dark mb-6">Ready to Start Your Digital Journey?</h3>
                <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Join hundreds of Ghanaians learning essential digital skills through our culturally-rooted platform
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onclick="navigateTo('modules')" class="bg-gradient-to-r from-adinkra-brown to-adinkra-dark text-white px-10 py-4 rounded-lg text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition">
                        <i class="fas fa-play-circle mr-2"></i>Start Learning Now
                    </button>
                    ${!state.isAuthenticated ? `
                    <button onclick="navigateTo('register')" class="bg-ghana-green text-white px-10 py-4 rounded-lg text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition">
                        <i class="fas fa-user-plus mr-2"></i>Create Free Account
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
  } catch (error) {
    console.error("Error loading home page:", error);
    mainContent.innerHTML = `<div class="text-center py-12"><p class="text-red-600">Failed to load page. Using default values.</p></div>`;
  } finally {
    hideLoading();
  }
}

async function renderModules() {
  showLoading();
  const mainContent = document.getElementById("main-content");

  try {
    const modules = await fetchAPI("/modules/");
    state.modules = modules;
    
    // Debug: Log the first module to check image data
    console.log("First module data:", modules[0]);

    mainContent.innerHTML = `
        <!-- Modules Hero Section -->
        <div class="bg-gradient-to-br from-adinkra-brown via-adinkra-dark to-ghana-green text-white py-12 sm:py-16 md:py-20">
            <div class="container mx-auto px-4 sm:px-6">
                <div class="max-w-4xl mx-auto text-center">
                    <div class="inline-block bg-white bg-opacity-20 px-4 py-2 rounded-full mb-4">
                        <span class="text-sm font-semibold"><i class="fas fa-graduation-cap mr-2"></i>Start Your Journey</span>
                    </div>
                    <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                        Learning Modules
                    </h1>
                    <p class="text-base sm:text-lg md:text-xl text-white text-opacity-90 max-w-2xl mx-auto mb-6">
                        Master digital skills through culturally-grounded lessons. Each module connects technology with Ghana's rich Adinkra wisdom.
                    </p>
                    <div class="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
                        <div class="bg-white bg-opacity-10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                            <div class="text-2xl sm:text-3xl font-bold">${modules.length}</div>
                            <div class="text-xs sm:text-sm text-white text-opacity-90">Modules</div>
                        </div>
                        <div class="bg-white bg-opacity-10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                            <div class="text-2xl sm:text-3xl font-bold">${modules.reduce((sum, m) => sum + m.lesson_count, 0)}</div>
                            <div class="text-xs sm:text-sm text-white text-opacity-90">Lessons</div>
                        </div>
                        <div class="bg-white bg-opacity-10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                            <div class="text-2xl sm:text-3xl font-bold">100%</div>
                            <div class="text-xs sm:text-sm text-white text-opacity-90">Free</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modules Grid -->
        <div class="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 max-w-7xl">
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                ${modules
                  .map(
                    (module) => {
                      const hasImage = module.adinkra_symbol && module.adinkra_symbol.image;
                      console.log(`Module: ${module.title}, Has Image: ${hasImage}, Image URL: ${module.adinkra_symbol?.image}`);
                      
                      const difficultyColors = {
                        'Beginner': 'bg-green-100 text-green-700 border-green-200',
                        'Intermediate': 'bg-yellow-100 text-yellow-700 border-yellow-200',
                        'Advanced': 'bg-red-100 text-red-700 border-red-200'
                      };
                      
                      return `
                        <div class="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2" 
                             onclick="viewModule('${module.slug}')">
                            <!-- Module Header with Image -->
                            <div class="relative bg-gradient-to-br from-adinkra-brown to-adinkra-dark p-6 sm:p-8">
                                <div class="flex justify-center mb-4">
                                    ${hasImage
                                        ? `<img src="${module.adinkra_symbol.image}" alt="${module.adinkra_symbol.name}" class="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300">`
                                        : `<img src="/static/logo.jpg" alt="Adinkra Logo" class="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-2xl drop-shadow-2xl group-hover:scale-110 transition-transform duration-300">`
                                    }
                                </div>
                                ${module.adinkra_symbol ? `
                                    <div class="text-center">
                                        <h4 class="text-white font-semibold text-sm sm:text-base">${module.adinkra_symbol.name}</h4>
                                        <p class="text-adinkra-gold text-xs sm:text-sm italic">"${module.adinkra_symbol.meaning}"</p>
                                    </div>
                                ` : ''}
                                <!-- Difficulty Badge -->
                                <div class="absolute top-4 right-4">
                                    <span class="px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColors[module.difficulty_level] || difficultyColors['Beginner']}">
                                        ${module.difficulty_level}
                                    </span>
                                </div>
                            </div>
                            
                            <!-- Module Content -->
                            <div class="p-5 sm:p-6">
                                <h3 class="text-xl sm:text-2xl font-bold text-adinkra-brown mb-3 group-hover:text-adinkra-dark transition-colors">
                                    ${module.title}
                                </h3>
                                <p class="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2">
                                    ${module.description}
                                </p>
                                
                                <!-- Module Stats -->
                                <div class="flex flex-wrap gap-2 mb-4">
                                    <div class="flex items-center gap-1.5 bg-ghana-green bg-opacity-10 text-ghana-green px-3 py-1.5 rounded-lg text-sm font-medium">
                                        <i class="fas fa-book-open"></i>
                                        <span>${module.lesson_count} Lessons</span>
                                    </div>
                                    <div class="flex items-center gap-1.5 bg-ghana-yellow bg-opacity-20 text-adinkra-dark px-3 py-1.5 rounded-lg text-sm font-medium">
                                        <i class="far fa-clock"></i>
                                        <span>${module.estimated_duration_minutes} min</span>
                                    </div>
                                </div>
                                
                                <!-- Digital Literacy Topic -->
                                <div class="pt-4 border-t border-gray-100">
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                                            <i class="fas fa-desktop"></i>
                                            ${module.digital_literacy_topic}
                                        </span>
                                        <div class="text-adinkra-brown group-hover:translate-x-1 transition-transform">
                                            <i class="fas fa-arrow-right text-xl"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                      `;
                    }
                  )
                  .join("")}
            </div>
            
            <!-- Call to Action -->
            ${!state.isAuthenticated ? `
                <div class="mt-12 sm:mt-16 bg-gradient-to-r from-ghana-green to-adinkra-brown rounded-2xl p-6 sm:p-8 md:p-10 text-white text-center">
                    <h3 class="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Start Learning?</h3>
                    <p class="text-base sm:text-lg mb-6 text-white text-opacity-90 max-w-2xl mx-auto">
                        Create a free account to track your progress, earn certificates, and unlock achievements!
                    </p>
                    <button onclick="navigateTo('register')" class="bg-white text-adinkra-brown px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-bold hover:shadow-xl transform hover:scale-105 transition-all">
                        <i class="fas fa-user-plus mr-2"></i>Create Free Account
                    </button>
                </div>
            ` : ''}
        </div>
    `;
  } catch (error) {
    showError("Failed to load modules. Please check your connection.");
  } finally {
    hideLoading();
  }
}

async function viewModule(slug) {
  showLoading();
  const mainContent = document.getElementById("main-content");
  
  // Update URL hash to preserve state on refresh
  window.location.hash = `module/${slug}`;

  try {
    const module = await fetchAPI(`/modules/${slug}/`);
    state.currentModule = module;

    const difficultyColors = {
      'Beginner': 'bg-green-100 text-green-700 border-green-300',
      'Intermediate': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Advanced': 'bg-red-100 text-red-700 border-red-300'
    };

    mainContent.innerHTML = `
        <div class="min-h-screen bg-gray-50">
            <!-- Module Header -->
            <div class="bg-gradient-to-br from-adinkra-brown via-adinkra-dark to-ghana-green text-white py-8 sm:py-12 md:py-16">
                <div class="container mx-auto px-4 sm:px-6 max-w-6xl">
                    <button onclick="navigateTo('modules')" class="inline-flex items-center gap-2 text-white hover:text-adinkra-gold mb-6 transition-colors group">
                        <i class="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                        <span class="font-medium">Back to Modules</span>
                    </button>
                    
                    <div class="grid lg:grid-cols-3 gap-8 items-center">
                        <!-- Module Image -->
                        <div class="flex justify-center lg:justify-start">
                            <div class="relative">
                                ${module.adinkra_symbol?.image 
                                    ? `<img src="${module.adinkra_symbol.image}" alt="${module.adinkra_symbol.name}" 
                                           class="w-40 h-40 sm:w-48 sm:h-48 object-contain drop-shadow-2xl float-animation">`
                                    : `<img src="/static/logo.jpg" alt="Adinkra Logo" 
                                           class="w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-3xl drop-shadow-2xl float-animation">`
                                }
                                <div class="absolute -bottom-3 -right-3">
                                    <span class="px-4 py-2 rounded-full text-sm font-semibold border-2 ${difficultyColors[module.difficulty_level] || difficultyColors['Beginner']}">
                                        ${module.difficulty_level}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Module Info -->
                        <div class="lg:col-span-2 text-center lg:text-left">
                            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">${module.title}</h1>
                            ${module.adinkra_symbol ? `
                                <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-6">
                                    <h3 class="text-lg sm:text-xl font-semibold mb-2">
                                        <i class="fas fa-book-open mr-2"></i>${module.adinkra_symbol.name} 
                                        <span class="text-adinkra-gold">(${module.adinkra_symbol.pronunciation})</span>
                                    </h3>
                                    <p class="text-sm sm:text-base text-white text-opacity-90 italic mb-2">
                                        "${module.adinkra_symbol.meaning}"
                                    </p>
                                    <p class="text-xs sm:text-sm text-white text-opacity-80">
                                        ${module.adinkra_symbol.cultural_significance}
                                    </p>
                                </div>
                            ` : ''}
                            <p class="text-base sm:text-lg text-white text-opacity-90 mb-6">${module.description}</p>
                            
                            <!-- Module Stats -->
                            <div class="flex flex-wrap gap-3 justify-center lg:justify-start">
                                <div class="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                    <i class="fas fa-book-open mr-2"></i>
                                    <span class="font-semibold">${module.lessons?.length || module.lesson_count || 0}</span> Lessons
                                </div>
                                <div class="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                    <i class="far fa-clock mr-2"></i>
                                    <span class="font-semibold">${module.estimated_duration_minutes || 0}</span> Minutes
                                </div>
                                <div class="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                    <i class="fas fa-desktop mr-2"></i>
                                    ${module.digital_literacy_topic || 'Digital Skills'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Lessons Section -->
            <div class="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl">
                <div class="mb-8">
                    <h2 class="text-2xl sm:text-3xl font-bold text-adinkra-brown mb-2">
                        <i class="fas fa-list-ul mr-2"></i>Course Lessons
                    </h2>
                    <p class="text-gray-600">Complete all lessons to master this module</p>
                </div>
                
                <div class="space-y-4">
                    ${module.lessons
                      .map(
                        (lesson, index) => `
                        <div class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-x-2"
                             onclick="viewLesson('${module.slug}', '${lesson.slug}')">
                            <div class="flex items-center p-4 sm:p-6">
                                <!-- Lesson Number -->
                                <div class="flex-shrink-0 mr-4 sm:mr-6">
                                    <div class="bg-gradient-to-br from-adinkra-brown to-adinkra-dark text-white rounded-xl w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg group-hover:scale-110 transition-transform">
                                        ${index + 1}
                                    </div>
                                </div>
                                
                                <!-- Lesson Info -->
                                <div class="flex-1 min-w-0">
                                    <h3 class="font-bold text-lg sm:text-xl text-adinkra-dark mb-1 group-hover:text-adinkra-brown transition-colors">
                                        ${lesson.title}
                                    </h3>
                                    <div class="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                        <span class="flex items-center gap-1">
                                            <i class="far fa-clock text-ghana-yellow"></i>
                                            <span class="font-medium">${lesson.estimated_duration_minutes} minutes</span>
                                        </span>
                                        ${lesson.content_type ? `
                                            <span class="flex items-center gap-1">
                                                <i class="fas fa-tag text-ghana-green"></i>
                                                <span>${lesson.content_type.charAt(0).toUpperCase() + lesson.content_type.slice(1)}</span>
                                            </span>
                                        ` : ''}
                                    </div>
                                </div>
                                
                                <!-- Arrow Icon -->
                                <div class="flex-shrink-0 ml-4">
                                    <div class="text-adinkra-brown text-2xl group-hover:translate-x-2 transition-transform">
                                        <i class="fas fa-arrow-right"></i>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Progress Bar (placeholder for future) -->
                            <div class="h-1 bg-gray-100">
                                <div class="h-full bg-gradient-to-r from-ghana-green to-adinkra-gold w-0 group-hover:w-full transition-all duration-500"></div>
                            </div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        </div>
    `;
  } catch (error) {
    showError("Failed to load module details.");
  } finally {
    hideLoading();
  }
}

async function viewLesson(moduleSlug, lessonSlug) {
  showLoading();
  const mainContent = document.getElementById("main-content");
  
  // Update URL hash to preserve state on refresh
  window.location.hash = `module/${moduleSlug}/lesson/${lessonSlug}`;

  try {
    const [lesson, module] = await Promise.all([
      fetchAPI(`/lessons/${lessonSlug}/`),
      fetchAPI(`/modules/${moduleSlug}/`)
    ]);
    
    console.log("Lesson data:", lesson); // Debug: Check if video_url exists
    console.log("Video URL:", lesson.video_url); // Debug: Check video URL specifically
    
    state.currentLesson = lesson;
    state.currentModule = module;
    
    // Find current lesson index and navigation
    const currentIndex = module.lessons.findIndex(l => l.slug === lessonSlug);
    const prevLesson = currentIndex > 0 ? module.lessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < module.lessons.length - 1 ? module.lessons[currentIndex + 1] : null;
    const progress = Math.round(((currentIndex + 1) / module.lessons.length) * 100);

    mainContent.innerHTML = `
        <div class="min-h-screen bg-gray-50">
            <!-- Lesson Header -->
            <div class="bg-gradient-to-r from-adinkra-brown to-adinkra-dark text-white py-6 sm:py-8 sticky top-0 z-40 shadow-lg">
                <div class="container mx-auto px-4 sm:px-6 max-w-6xl">
                    <div class="flex items-center justify-between mb-4">
                        <button onclick="viewModule('${moduleSlug}')" class="inline-flex items-center gap-2 text-white hover:text-adinkra-gold transition-colors group">
                            <i class="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                            <span class="font-medium hidden sm:inline">Back to ${module.title}</span>
                            <span class="font-medium sm:hidden">Back</span>
                        </button>
                        <div class="text-right">
                            <div class="text-xs sm:text-sm text-white text-opacity-80">Lesson ${currentIndex + 1} of ${module.lessons.length}</div>
                            <div class="text-xs sm:text-sm font-semibold text-adinkra-gold">${progress}% Complete</div>
                        </div>
                    </div>
                    
                    <!-- Progress Bar -->
                    <div class="bg-white bg-opacity-20 rounded-full h-2 overflow-hidden mb-4">
                        <div class="bg-adinkra-gold h-full transition-all duration-500" style="width: ${progress}%"></div>
                    </div>
                    
                    <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold">${lesson.title}</h1>
                    <div class="flex items-center gap-4 mt-3 text-sm text-white text-opacity-90">
                        ${lesson.estimated_duration_minutes ? `
                            <span class="flex items-center gap-1">
                                <i class="far fa-clock"></i>
                                ${lesson.estimated_duration_minutes} minutes
                            </span>
                        ` : ''}
                        ${lesson.content_type ? `
                            <span class="flex items-center gap-1">
                                <i class="fas fa-tag"></i>
                                ${lesson.content_type.charAt(0).toUpperCase() + lesson.content_type.slice(1)}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <!-- Main Content -->
            <div class="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
                <!-- Lesson Content Card -->
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div class="p-6 sm:p-8 md:p-10">
                        ${lesson.content ? `
                            <div class="prose prose-lg max-w-none mb-8">
                                <p class="text-gray-700 leading-relaxed text-base sm:text-lg">${lesson.content}</p>
                            </div>
                        ` : ''}
                        
                        ${lesson.blocks && lesson.blocks.length > 0 ? `
                            <div class="space-y-6">
                                ${lesson.blocks.map((block) => renderContentBlock(block)).join('')}
                            </div>
                        ` : ''}
                        
                        ${lesson.video_url ? renderLessonVideo(lesson.video_url) : ''}
                    </div>
                    
                    <!-- Quiz Section -->
                    ${lesson.quiz ? `
                        <div class="bg-gradient-to-r from-ghana-yellow to-adinkra-gold p-6 sm:p-8">
                            <div class="flex items-start gap-4">
                                <div class="bg-white bg-opacity-20 rounded-full p-3 sm:p-4 flex-shrink-0">
                                    <i class="fas fa-clipboard-list text-2xl sm:text-3xl text-white"></i>
                                </div>
                                <div class="flex-1">
                                    <h3 class="text-xl sm:text-2xl font-bold text-white mb-2">Ready to Test Your Knowledge?</h3>
                                    <p class="text-white text-opacity-90 mb-4">Complete this quiz to verify your understanding and earn points!</p>
                                    <button onclick="startQuiz(${lesson.quiz.id})" 
                                            class="bg-white text-adinkra-brown px-6 py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all">
                                        <i class="fas fa-play-circle mr-2"></i>Start Quiz
                                    </button>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Action Buttons -->
                <div class="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
                    <h3 class="text-lg font-bold text-adinkra-brown mb-4">
                        <i class="fas fa-tasks mr-2"></i>Mark Your Progress
                    </h3>
                    <button onclick="markLessonComplete('${lessonSlug}')" 
                            class="w-full bg-gradient-to-r from-ghana-green to-green-600 text-white px-6 py-4 rounded-xl hover:shadow-xl transition-all font-bold text-lg flex items-center justify-center gap-3 group">
                        <i class="fas fa-check-circle text-2xl group-hover:scale-110 transition-transform"></i>
                        <span>Mark Lesson as Complete</span>
                    </button>
                </div>
                
                <!-- Lesson Navigation -->
                <div class="grid ${prevLesson && nextLesson ? 'sm:grid-cols-2' : 'grid-cols-1'} gap-4">
                    ${prevLesson ? `
                        <button onclick="viewLesson('${moduleSlug}', '${prevLesson.slug}')" 
                                class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 text-left group">
                            <div class="text-sm text-gray-500 mb-2">
                                <i class="fas fa-arrow-left mr-1"></i>Previous Lesson
                            </div>
                            <div class="font-bold text-adinkra-brown group-hover:text-adinkra-dark transition-colors">
                                ${prevLesson.title}
                            </div>
                        </button>
                    ` : ''}
                    
                    ${nextLesson ? `
                        <button onclick="viewLesson('${moduleSlug}', '${nextLesson.slug}')" 
                                class="bg-gradient-to-br from-adinkra-brown to-adinkra-dark text-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 text-right group ${!prevLesson ? 'sm:col-span-2' : ''}">
                            <div class="text-sm text-white text-opacity-80 mb-2">
                                Next Lesson<i class="fas fa-arrow-right ml-1"></i>
                            </div>
                            <div class="font-bold group-hover:text-adinkra-gold transition-colors">
                                ${nextLesson.title}
                            </div>
                        </button>
                    ` : `
                        <button onclick="viewModule('${moduleSlug}')" 
                                class="bg-gradient-to-br from-ghana-green to-green-600 text-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 text-center group ${!prevLesson ? 'sm:col-span-2' : ''}">
                            <div class="text-lg font-bold mb-2">
                                <i class="fas fa-trophy mr-2"></i>Module Complete!
                            </div>
                            <div class="text-sm text-white text-opacity-90">
                                Return to module overview
                            </div>
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;
  } catch (error) {
    console.error("Failed to load lesson:", error);
    showError("Failed to load lesson content. Please try again.");
  } finally {
    hideLoading();
  }
}

function renderLessonVideo(videoUrl) {
  console.log("Rendering video:", videoUrl); // Debug log
  
  if (!videoUrl) return '';
  
  // Clean the URL - remove whitespace
  videoUrl = videoUrl.trim();
  
  // Check if it's a YouTube URL - handle multiple formats
  let videoId = null;
  
  // Try different YouTube URL patterns
  if (videoUrl.includes('youtube.com/watch')) {
    // Standard format: https://www.youtube.com/watch?v=VIDEO_ID
    const match = videoUrl.match(/[?&]v=([^&\s]+)/);
    if (match && match[1]) {
      videoId = match[1].split('&')[0]; // Remove any additional parameters
    }
  } else if (videoUrl.includes('youtu.be/')) {
    // Short format: https://youtu.be/VIDEO_ID
    const match = videoUrl.match(/youtu\.be\/([^?&\s]+)/);
    if (match && match[1]) {
      videoId = match[1];
    }
  } else if (videoUrl.includes('youtube.com/embed/')) {
    // Embed format: https://www.youtube.com/embed/VIDEO_ID
    const match = videoUrl.match(/youtube\.com\/embed\/([^?&\s]+)/);
    if (match && match[1]) {
      videoId = match[1];
    }
  }
  
  if (videoId) {
    // Clean the video ID - YouTube IDs are 11 characters, alphanumeric plus - and _
    videoId = videoId.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 11);
    console.log("YouTube video ID extracted:", videoId); // Debug log
    
    return `
      <div class="my-8">
        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" 
           class="block w-full max-w-4xl mx-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl shadow-2xl p-8 sm:p-12 text-center transition-all transform hover:scale-105">
          <div class="flex flex-col items-center gap-4">
            <div class="text-6xl sm:text-7xl text-white">
              <i class="fab fa-youtube"></i>
            </div>
            <h3 class="text-2xl sm:text-3xl font-bold text-white">Watch on YouTube</h3>
            <p class="text-white/90 text-lg">Click to open this video on YouTube</p>
            <div class="mt-2 inline-flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-lg font-semibold">
              <i class="fas fa-play"></i>
              <span>Play Video</span>
              <i class="fas fa-external-link-alt text-sm"></i>
            </div>
          </div>
        </a>
      </div>
    `;
  }
  
  // Check if it's a Vimeo URL
  const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    const vimeoId = vimeoMatch[1];
    console.log("Vimeo video ID:", vimeoId); // Debug log
    return `
      <div class="my-8">
        <div class="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl" style="padding-bottom: 56.25%;">
          <iframe class="absolute top-0 left-0 w-full h-full"
                  src="https://player.vimeo.com/video/${vimeoId}"
                  frameborder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowfullscreen>
          </iframe>
        </div>
      </div>
    `;
  }
  
  // For direct video files, use HTML5 video player
  if (videoUrl.match(/\.(mp4|webm|ogg)$/i)) {
    console.log("Direct video file:", videoUrl); // Debug log
    return `
      <div class="my-8">
        <video controls class="w-full max-w-4xl mx-auto rounded-xl shadow-lg">
          <source src="${videoUrl}" type="video/${videoUrl.split('.').pop()}">
          Your browser does not support the video tag.
        </video>
      </div>
    `;
  }
  
  // Fallback: show link for unrecognized video URLs
  console.log("Unrecognized video format, showing link:", videoUrl); // Debug log
  return `
    <div class="my-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-lg p-6 sm:p-8 text-center">
      <div class="text-4xl mb-4 text-gray-600">
        <i class="fas fa-video"></i>
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">Video Content</h3>
      <p class="text-gray-600 mb-4">Click below to watch this video</p>
      <a href="${videoUrl}" target="_blank" 
         class="inline-block bg-adinkra-brown text-white px-6 py-3 rounded-lg font-semibold hover:bg-adinkra-dark transition-all shadow-md">
        <i class="fas fa-external-link-alt mr-2"></i>Watch Video
      </a>
    </div>
  `;
}

function renderContentBlock(block) {
  const blockStyles = {
    heading: {
      class: "text-2xl sm:text-3xl font-bold text-adinkra-dark mb-4",
      icon: "fas fa-heading"
    },
    text: {
      class: "text-gray-700 leading-relaxed text-base sm:text-lg",
      icon: "fas fa-paragraph"
    },
    tip: {
      class: "bg-blue-50 border-l-4 border-blue-500 p-4 sm:p-6 rounded-lg shadow-sm",
      icon: "fas fa-lightbulb",
      iconColor: "text-blue-500"
    },
    warning: {
      class: "bg-yellow-50 border-l-4 border-yellow-500 p-4 sm:p-6 rounded-lg shadow-sm",
      icon: "fas fa-exclamation-triangle",
      iconColor: "text-yellow-500"
    },
    example: {
      class: "bg-green-50 border-l-4 border-green-500 p-4 sm:p-6 rounded-lg shadow-sm",
      icon: "fas fa-code",
      iconColor: "text-green-500"
    },
  };

  const style = blockStyles[block.block_type] || blockStyles.text;

  // Handle dedicated image blocks
  if (block.block_type === 'image') {
    return `
      <div class="my-8">
        ${block.image ? `
          <img src="${block.image}" alt="${block.content || 'Lesson image'}" 
               class="w-full max-w-3xl mx-auto rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
        ` : ''}
        ${block.content ? `<p class="text-center text-sm text-gray-600 mt-4 italic">${block.content}</p>` : ''}
      </div>
    `;
  }

  // Handle dedicated video blocks
  if (block.block_type === 'video' && block.video_url) {
    // Check if it's a YouTube URL
    const youtubeMatch = block.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      return `
        <div class="my-8">
          <div class="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg" style="padding-bottom: 56.25%;">
            <iframe class="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/${videoId}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
            </iframe>
          </div>
          ${block.content ? `<p class="text-center text-sm text-gray-600 mt-4">${block.content}</p>` : ''}
        </div>
      `;
    }
    
    // Check if it's a Vimeo URL
    const vimeoMatch = block.video_url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      const videoId = vimeoMatch[1];
      return `
        <div class="my-8">
          <div class="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg" style="padding-bottom: 56.25%;">
            <iframe class="absolute top-0 left-0 w-full h-full"
                    src="https://player.vimeo.com/video/${videoId}"
                    frameborder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowfullscreen>
            </iframe>
          </div>
          ${block.content ? `<p class="text-center text-sm text-gray-600 mt-4">${block.content}</p>` : ''}
        </div>
      `;
    }
    
    // For other video URLs (direct video files), use HTML5 video player
    if (block.video_url.match(/\.(mp4|webm|ogg)$/i)) {
      return `
        <div class="my-6">
          <video controls class="w-full max-w-3xl mx-auto rounded-lg shadow-md">
            <source src="${block.video_url}" type="video/${block.video_url.split('.').pop()}">
            Your browser does not support the video tag.
          </video>
          ${block.content ? `<p class="text-center text-sm text-gray-600 mt-2">${block.content}</p>` : ''}
        </div>
      `;
    }
    
    // Fallback: show link for unrecognized video URLs
    return `
      <div class="my-6 bg-gray-100 rounded-lg p-4 text-center">
        <p class="text-gray-600 mb-2"><i class="fas fa-video"></i> Video Content</p>
        ${block.content ? `<p class="text-gray-700 mb-2">${block.content}</p>` : ''}
        <a href="${block.video_url}" target="_blank" 
           class="text-adinkra-brown hover:underline font-semibold">Watch Video</a>
      </div>
    `;
  }

  // Handle text-based blocks with optional image (heading, text, tip, warning, example)
  const className = style.class;
  
  let html = '';
  
  // For special block types (tip, warning, example), add icon header
  if (['tip', 'warning', 'example'].includes(block.block_type)) {
    html += `<div class="${className}">`;
    html += `
      <div class="flex items-start gap-3 mb-3">
        <i class="${style.icon} ${style.iconColor} text-xl flex-shrink-0 mt-1"></i>
        <div class="flex-1">
          <h4 class="font-bold text-lg mb-2 capitalize">${block.block_type}</h4>
        </div>
      </div>
    `;
  }
  
  // If block has an image, show it
  if (block.image) {
    const imageHtml = `
      <div class="mb-4">
        <img src="${block.image}" alt="${block.content || 'Content image'}" 
             class="w-full max-w-3xl mx-auto rounded-xl shadow-md">
      </div>
    `;
    
    if (['tip', 'warning', 'example'].includes(block.block_type)) {
      html += imageHtml;
    } else {
      html = imageHtml + html;
    }
  }
  
  // Add the text content
  const contentHtml = `
    <div class="${['tip', 'warning', 'example'].includes(block.block_type) ? '' : className}">
        ${block.content
          .split("\n")
          .map((line) => `<p class="mb-3">${line}</p>`)
          .join("")}
    </div>
  `;
  
  if (['tip', 'warning', 'example'].includes(block.block_type)) {
    html += contentHtml + '</div>';
  } else {
    html += contentHtml;
  }

  return html;
}

async function markLessonComplete(lessonSlug) {
  try {
    await fetch(`${API_BASE}/lessons/${lessonSlug}/mark_complete/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      credentials: "include",
    });
    alert("✓ Lesson marked as complete!");
  } catch (error) {
    alert("Please log in to track your progress.");
  }
}

async function renderProgress() {
  const mainContent = document.getElementById("main-content");

  if (!state.isAuthenticated) {
    mainContent.innerHTML = `
      <div class="max-w-2xl mx-auto py-16 px-4">
        <div class="bg-white rounded-lg shadow-lg p-8 text-center">
          <div class="text-6xl mb-4"><i class="fas fa-chart-line text-adinkra-brown"></i></div>
          <h2 class="text-3xl font-bold text-adinkra-brown mb-4">Track Your Progress</h2>
          <p class="text-gray-700 mb-6">
            Create an account or login to track your learning journey, earn points, and see your achievements!
          </p>
          <div class="flex gap-4 justify-center">
            <button onclick="navigateTo('login')" class="bg-adinkra-brown text-white px-8 py-3 rounded-lg hover:bg-adinkra-dark transition font-semibold">
              <i class="fas fa-sign-in-alt mr-2"></i>Login
            </button>
            <button onclick="navigateTo('register')" class="bg-adinkra-gold text-adinkra-dark px-8 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold">
              <i class="fas fa-user-plus mr-2"></i>Register
            </button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // Show loading
  showLoading();

  try {
    console.log("Fetching progress stats...");
    const stats = await fetchAPI("/progress/stats/");
    console.log("Progress stats received:", stats);

    mainContent.innerHTML = `
      <div class="container mx-auto px-4 py-12 max-w-7xl">
        <h2 class="text-3xl font-bold text-adinkra-brown mb-6">Your Learning Progress</h2>
        
        <!-- Overall Statistics -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <i class="fas fa-chart-bar text-adinkra-brown"></i>
            Overall Statistics
          </h3>
          <div class="grid md:grid-cols-4 gap-4">
            <div class="text-center p-6 bg-gradient-to-br from-ghana-green to-green-600 bg-opacity-10 rounded-lg border-2 border-ghana-green border-opacity-20">
              <div class="text-4xl font-bold text-ghana-green">${stats.completed_lessons}</div>
              <div class="text-gray-700 font-medium mt-2">Lessons Completed</div>
            </div>
            <div class="text-center p-6 bg-gradient-to-br from-adinkra-gold to-yellow-500 bg-opacity-20 rounded-lg border-2 border-adinkra-gold border-opacity-30">
              <div class="text-4xl font-bold text-adinkra-dark">${stats.total_points}</div>
              <div class="text-gray-700 font-medium mt-2">Points Earned</div>
            </div>
            <div class="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 bg-opacity-10 rounded-lg border-2 border-blue-500 border-opacity-20">
              <div class="text-4xl font-bold text-blue-600">${stats.passed_quizzes}</div>
              <div class="text-gray-700 font-medium mt-2">Quizzes Passed</div>
            </div>
            <div class="text-center p-6 bg-gradient-to-br from-purple-500 to-purple-600 bg-opacity-10 rounded-lg border-2 border-purple-500 border-opacity-20">
              <div class="text-4xl font-bold text-purple-600">${stats.in_progress_lessons}</div>
              <div class="text-gray-700 font-medium mt-2">In Progress</div>
            </div>
          </div>
        </div>
        
        <!-- Module Progress -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <i class="fas fa-tasks text-adinkra-brown"></i>
            Module Progress
          </h3>
          <div class="space-y-4">
            ${stats.modules_progress
              .map(
                (module) => `
              <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex-1">
                    <h4 class="font-semibold text-lg text-adinkra-dark">${module.module_title}</h4>
                    <p class="text-sm text-gray-600">${module.completed_lessons} of ${module.total_lessons} lessons completed</p>
                  </div>
                  <div class="text-right">
                    <span class="text-2xl font-bold text-adinkra-brown">${module.progress_percentage}%</span>
                  </div>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div class="bg-gradient-to-r from-adinkra-brown to-adinkra-gold h-3 rounded-full transition-all duration-500" 
                       style="width: ${module.progress_percentage}%"></div>
                </div>
                <div class="mt-2 text-right">
                  <button onclick="viewModule('${module.module_slug}')" 
                          class="text-sm text-adinkra-brown hover:underline font-medium">
                    Continue Learning <i class="fas fa-arrow-right ml-1"></i>
                  </button>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
        
        <!-- Recent Activity -->
        ${
          stats.recent_activity && stats.recent_activity.length > 0
            ? `
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
              <i class="fas fa-history text-adinkra-brown"></i>
              Recent Activity
            </h3>
            <div class="space-y-3">
              ${stats.recent_activity
                .map(
                  (activity) => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-adinkra-brown bg-opacity-10 flex items-center justify-center">
                      <i class="fas fa-book text-adinkra-brown"></i>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">${activity.lesson_title}</p>
                      <p class="text-sm text-gray-600">${activity.module_title}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                      activity.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }">
                      ${activity.status === "completed" ? "✓ Completed" : "In Progress"}
                    </span>
                  </div>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }
      </div>
    `;
  } catch (error) {
    console.error("Failed to load progress:", error);
    mainContent.innerHTML = `
      <div class="max-w-2xl mx-auto py-16 px-4">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
          <div class="flex items-center">
            <i class="fas fa-exclamation-triangle text-2xl mr-3"></i>
            <div>
              <strong class="font-bold">Error!</strong>
              <span class="block sm:inline"> Failed to load your progress. ${error.message || "Please try again."}</span>
            </div>
          </div>
          <div class="mt-4">
            <button onclick="renderProgress()" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              <i class="fas fa-sync mr-2"></i>Retry
            </button>
          </div>
        </div>
      </div>
    `;
  } finally {
    hideLoading();
  }
}

async function renderAbout() {
  showLoading();
  const mainContent = document.getElementById("main-content");
  
  // Fetch modules and stats in parallel
  let modules = state.modules;
  let stats = null;
  
  try {
    const promises = [];
    
    // Fetch modules if not already loaded
    if (!modules || modules.length === 0) {
      promises.push(fetchAPI("/modules/"));
    }
    
    // Always fetch fresh stats
    promises.push(fetchAPI("/stats/"));
    
    const results = await Promise.all(promises);
    
    if (!modules || modules.length === 0) {
      modules = results[0];
      stats = results[1];
      state.modules = modules;
    } else {
      stats = results[0];
    }
  } catch (error) {
    console.error("Failed to load data:", error);
    modules = modules || [];
    // Use default stats if fetch fails
    stats = {
      active_learners: 500,
      total_modules: 5,
      total_lessons: 20,
      completed_lessons: 0
    };
  }
  
  // Generate cultural integration cards from actual modules
  const culturalIntegrationHTML = modules
    .filter(m => m.adinkra_symbol) // Only modules with symbols
    .slice(0, 4) // Show first 4
    .map(module => `
      <div class="bg-white bg-opacity-90 p-4 rounded-lg flex items-center hover:shadow-md transition">
        ${module.adinkra_symbol.image 
          ? `<img src="${module.adinkra_symbol.image}" alt="${module.adinkra_symbol.name}" class="w-16 h-16 object-contain mr-4">`
          : `<img src="/static/logo.jpg" alt="Adinkra Logo" class="w-16 h-16 object-cover rounded-lg mr-4">`
        }
        <div>
          <p class="font-bold text-adinkra-dark">${module.adinkra_symbol.name}</p>
          <p class="text-sm text-gray-700">${module.adinkra_symbol.meaning} → ${module.digital_literacy_topic}</p>
        </div>
      </div>
    `).join('');
  
  mainContent.innerHTML = `
        <!-- Hero Section -->
        <div class="hero-gradient text-white py-12 sm:py-16 md:py-20">
            <div class="container mx-auto px-4 sm:px-6 text-center">
                <img src="/static/logo.jpg" alt="Adinkra Logo" class="w-32 sm:w-40 md:w-48 h-auto mx-auto mb-4 float-animation rounded-2xl shadow-2xl" />
                <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 px-2">About Adinkra Digital Learning</h2>
                <p class="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto text-white text-opacity-90 px-4">
                    Bridging Ghana's Rich Cultural Heritage with Modern Digital Skills
                </p>
            </div>
        </div>

        <div class="container mx-auto px-4 py-12 max-w-7xl">
            <!-- Mission & Vision -->
            <div class="grid md:grid-cols-2 gap-6 mb-12">
                <div class="bg-gradient-to-br from-adinkra-brown to-adinkra-dark text-white rounded-xl shadow-lg p-8">
                    <div class="flex items-center mb-4">
                        <div class="bg-white bg-opacity-20 rounded-full p-3 mr-4">
                            <i class="fas fa-bullseye text-3xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold">Our Mission</h3>
                    </div>
                    <p class="leading-relaxed">
                        To empower every Ghanaian with essential digital skills by connecting our rich 
                        cultural heritage with modern technology education, making digital literacy 
                        accessible, relevant, and culturally resonant.
                    </p>
                </div>
                
                <div class="bg-gradient-to-br from-ghana-green to-green-700 text-white rounded-xl shadow-lg p-8">
                    <div class="flex items-center mb-4">
                        <div class="bg-white bg-opacity-20 rounded-full p-3 mr-4">
                            <i class="fas fa-eye text-3xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold">Our Vision</h3>
                    </div>
                    <p class="leading-relaxed">
                        A Ghana where every citizen confidently navigates the digital world, using 
                        technology to enhance their lives while staying rooted in our cultural values 
                        and traditions.
                    </p>
                </div>
            </div>

            <!-- What You'll Learn -->
            <div class="bg-white rounded-xl shadow-lg p-8 mb-12">
                <h3 class="text-3xl font-bold text-adinkra-brown mb-6 text-center">
                    <i class="fas fa-graduation-cap mr-2"></i>What You'll Learn
                </h3>
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="text-center p-6 bg-blue-50 rounded-lg hover:shadow-md transition">
                        <div class="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-shield-alt text-2xl"></i>
                        </div>
                        <h4 class="font-semibold text-lg mb-2 text-gray-800">Cybersecurity</h4>
                        <p class="text-sm text-gray-600">Protect your digital identity and personal information</p>
                    </div>
                    
                    <div class="text-center p-6 bg-green-50 rounded-lg hover:shadow-md transition">
                        <div class="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-comments text-2xl"></i>
                        </div>
                        <h4 class="font-semibold text-lg mb-2 text-gray-800">Digital Communication</h4>
                        <p class="text-sm text-gray-600">Master WhatsApp and messaging platforms safely</p>
                    </div>
                    
                    <div class="text-center p-6 bg-yellow-50 rounded-lg hover:shadow-md transition">
                        <div class="bg-yellow-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-mobile-alt text-2xl"></i>
                        </div>
                        <h4 class="font-semibold text-lg mb-2 text-gray-800">Mobile Money</h4>
                        <p class="text-sm text-gray-600">Secure mobile money and digital finance skills</p>
                    </div>
                    
                    <div class="text-center p-6 bg-purple-50 rounded-lg hover:shadow-md transition">
                        <div class="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-globe text-2xl"></i>
                        </div>
                        <h4 class="font-semibold text-lg mb-2 text-gray-800">Internet Navigation</h4>
                        <p class="text-sm text-gray-600">Find reliable information and online resources</p>
                    </div>
                    
                    <div class="text-center p-6 bg-pink-50 rounded-lg hover:shadow-md transition">
                        <div class="bg-pink-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-share-alt text-2xl"></i>
                        </div>
                        <h4 class="font-semibold text-lg mb-2 text-gray-800">Social Media</h4>
                        <p class="text-sm text-gray-600">Build positive digital presence responsibly</p>
                    </div>
                    
                    <div class="text-center p-6 bg-orange-50 rounded-lg hover:shadow-md transition">
                        <div class="bg-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-user-shield text-2xl"></i>
                        </div>
                        <h4 class="font-semibold text-lg mb-2 text-gray-800">Digital Citizenship</h4>
                        <p class="text-sm text-gray-600">Online safety and responsible digital behavior</p>
                    </div>
                </div>
            </div>

            <!-- Cultural Integration -->
            <div class="bg-gradient-to-r from-adinkra-gold to-yellow-500 rounded-xl shadow-lg p-8 mb-12">
                <h3 class="text-3xl font-bold text-adinkra-dark mb-6 text-center">
                    <i class="fas fa-heart mr-2"></i>Cultural Integration
                </h3>
                <div class="max-w-4xl mx-auto">
                    <p class="text-lg text-adinkra-dark mb-6 text-center leading-relaxed">
                        Each learning module is paired with an Adinkra symbol that reflects its core teaching, 
                        making digital concepts relatable and memorable through our cultural wisdom.
                    </p>
                    <div class="grid md:grid-cols-2 gap-4">
                        ${culturalIntegrationHTML || '<p class="text-center text-adinkra-dark">Loading modules...</p>'}
                    </div>
                </div>
            </div>

            <!-- Community Impact -->
            <div class="bg-white rounded-xl shadow-lg p-8 mb-12">
                <h3 class="text-3xl font-bold text-adinkra-brown mb-6 text-center">
                    <i class="fas fa-users mr-2"></i>Community Pilot Program
                </h3>
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="text-center">
                        <div class="bg-ghana-green text-white text-4xl font-bold rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg">
                            ${stats.active_learners}${stats.active_learners >= 100 ? '+' : ''}
                        </div>
                        <h4 class="font-semibold text-lg mb-2">Active Learners</h4>
                        <p class="text-sm text-gray-600">Learning across Ghana</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-adinkra-gold text-adinkra-dark text-4xl font-bold rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg">
                            ${stats.total_modules}
                        </div>
                        <h4 class="font-semibold text-lg mb-2">Learning Modules</h4>
                        <p class="text-sm text-gray-600">Culturally-rooted digital skills</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-ghana-red text-white text-4xl font-bold rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg">
                            ${stats.completed_lessons}${stats.completed_lessons >= 100 ? '+' : ''}
                        </div>
                        <h4 class="font-semibold text-lg mb-2">Lessons Completed</h4>
                        <p class="text-sm text-gray-600">Milestones achieved together</p>
                    </div>
                </div>
                <div class="mt-8 bg-gray-50 p-6 rounded-lg">
                    <p class="text-center text-gray-700 leading-relaxed">
                        We partner with local communities, market women's associations, and senior centers 
                        to deliver hands-on digital literacy training that respects and builds upon existing 
                        knowledge and cultural practices. Our approach is inclusive, accessible, and designed 
                        for real-world impact.
                    </p>
                </div>
            </div>

            <!-- Why Choose Us -->
            <div class="bg-gradient-to-br from-adinkra-dark to-gray-900 text-white rounded-xl shadow-lg p-8">
                <h3 class="text-3xl font-bold mb-6 text-center">
                    <i class="fas fa-star mr-2"></i>Why Choose Adinkra Learning?
                </h3>
                <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <div class="flex items-start">
                        <i class="fas fa-check-circle text-ghana-green text-2xl mr-3 mt-1"></i>
                        <div>
                            <h4 class="font-semibold text-lg mb-1">Culturally Relevant</h4>
                            <p class="text-gray-300 text-sm">Learn through familiar cultural concepts and symbols</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <i class="fas fa-check-circle text-ghana-green text-2xl mr-3 mt-1"></i>
                        <div>
                            <h4 class="font-semibold text-lg mb-1">Practical Skills</h4>
                            <p class="text-gray-300 text-sm">Real-world applications for everyday digital needs</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <i class="fas fa-check-circle text-ghana-green text-2xl mr-3 mt-1"></i>
                        <div>
                            <h4 class="font-semibold text-lg mb-1">Self-Paced Learning</h4>
                            <p class="text-gray-300 text-sm">Learn at your own speed, anytime, anywhere</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <i class="fas fa-check-circle text-ghana-green text-2xl mr-3 mt-1"></i>
                        <div>
                            <h4 class="font-semibold text-lg mb-1">Community Support</h4>
                            <p class="text-gray-300 text-sm">Join a supportive network of learners</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <i class="fas fa-check-circle text-ghana-green text-2xl mr-3 mt-1"></i>
                        <div>
                            <h4 class="font-semibold text-lg mb-1">Free & Accessible</h4>
                            <p class="text-gray-300 text-sm">No cost barriers to essential digital education</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <i class="fas fa-check-circle text-ghana-green text-2xl mr-3 mt-1"></i>
                        <div>
                            <h4 class="font-semibold text-lg mb-1">Track Progress</h4>
                            <p class="text-gray-300 text-sm">Earn points and celebrate your achievements</p>
                        </div>
                    </div>
                </div>
                <div class="text-center mt-8">
                    <button onclick="navigateTo('modules')" class="bg-adinkra-gold text-adinkra-dark px-8 py-4 rounded-lg text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition">
                        Start Learning Today <i class="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
  
  hideLoading();
}

function renderLogin() {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
    <div class="max-w-md mx-auto py-12 px-4">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="text-center mb-6">
          <img src="/static/logo.jpg" alt="Adinkra Logo" class="w-20 h-auto mx-auto mb-4 rounded-xl shadow-md" />
          <h2 class="text-3xl font-bold text-adinkra-brown mb-2">Welcome Back</h2>
          <p class="text-gray-600">Login to continue your learning journey</p>
        </div>
        
        <form onsubmit="handleLogin(event)" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-2 text-gray-700">
              <i class="fas fa-user mr-2"></i>Username
            </label>
            <input type="text" name="username" required
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adinkra-brown focus:border-transparent"
                   placeholder="Enter your username">
          </div>
          
          <div>
            <label class="block text-sm font-semibold mb-2 text-gray-700">
              <i class="fas fa-lock mr-2"></i>Password
            </label>
            <div class="relative">
              <input type="password" name="password" id="login-password" required
                     class="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adinkra-brown focus:border-transparent"
                     placeholder="Enter your password">
              <button type="button" onclick="togglePassword('login-password', this)" 
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
          
          <button type="submit" class="w-full bg-adinkra-brown text-white py-3 rounded-lg font-semibold hover:bg-adinkra-dark transition">
            <i class="fas fa-sign-in-alt mr-2"></i>Login
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-gray-600">Don't have an account? 
            <button onclick="navigateTo('register')" class="text-adinkra-brown hover:underline font-semibold">Register here</button>
          </p>
        </div>
      </div>
    </div>
  `;
}

function renderRegister() {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
    <div class="max-w-2xl mx-auto py-12 px-4">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="text-center mb-6">
          <img src="/static/logo.jpg" alt="Adinkra Logo" class="w-20 h-auto mx-auto mb-4 rounded-xl shadow-md" />
          <h2 class="text-3xl font-bold text-adinkra-brown mb-2">Join Us</h2>
          <p class="text-gray-600">Create your account to start learning</p>
        </div>
        
        <form onsubmit="handleRegister(event)" class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-2 text-gray-700">
                <i class="fas fa-user mr-2"></i>First Name
              </label>
              <input type="text" name="first_name" required
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adinkra-brown focus:border-transparent"
                     placeholder="First name">
            </div>
            
            <div>
              <label class="block text-sm font-semibold mb-2 text-gray-700">
                <i class="fas fa-user mr-2"></i>Last Name
              </label>
              <input type="text" name="last_name" required
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adinkra-brown focus:border-transparent"
                     placeholder="Last name">
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-semibold mb-2 text-gray-700">
              <i class="fas fa-user-circle mr-2"></i>Username <span class="text-red-500">*</span>
            </label>
            <input type="text" name="username" required
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adinkra-brown focus:border-transparent"
                   placeholder="Choose a username">
          </div>
          
          <div>
            <label class="block text-sm font-semibold mb-2 text-gray-700">
              <i class="fas fa-envelope mr-2"></i>Email <span class="text-red-500">*</span>
            </label>
            <input type="email" name="email" required
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adinkra-brown focus:border-transparent"
                   placeholder="your.email@example.com">
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-2 text-gray-700">
                <i class="fas fa-lock mr-2"></i>Password <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input type="password" name="password" id="register-password" required minlength="8"
                       class="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adinkra-brown focus:border-transparent"
                       placeholder="At least 8 characters">
                <button type="button" onclick="togglePassword('register-password', this)" 
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-semibold mb-2 text-gray-700">
                <i class="fas fa-lock mr-2"></i>Confirm Password <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input type="password" name="confirm_password" id="register-confirm-password" required minlength="8"
                       class="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adinkra-brown focus:border-transparent"
                       placeholder="Re-enter password">
                <button type="button" onclick="togglePassword('register-confirm-password', this)" 
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-2 text-gray-700">
                <i class="fas fa-phone mr-2"></i>Phone Number
              </label>
              <input type="tel" name="phone_number"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adinkra-brown focus:border-transparent"
                     placeholder="+233...">
            </div>
            
            <div>
              <label class="block text-sm font-semibold mb-2 text-gray-700">
                <i class="fas fa-map-marker-alt mr-2"></i>Community
              </label>
              <input type="text" name="community"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adinkra-brown focus:border-transparent"
                     placeholder="Your community">
            </div>
          </div>
          
          <button type="submit" class="w-full bg-adinkra-brown text-white py-3 rounded-lg font-semibold hover:bg-adinkra-dark transition mt-6">
            <i class="fas fa-user-plus mr-2"></i>Create Account
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-gray-600">Already have an account? 
            <button onclick="navigateTo('login')" class="text-adinkra-brown hover:underline font-semibold">Login here</button>
          </p>
        </div>
      </div>
    </div>
  `;
}

// Navigation
function navigateTo(page) {
  state.currentPage = page;
  
  // Update URL hash (but only if it's different to avoid triggering hashchange)
  if (window.location.hash !== `#${page}`) {
    window.location.hash = page;
  }

  // Update active nav button
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.page === page) {
      btn.classList.add("active");
    }
  });

  // Hide mobile menu
  const menu = document.getElementById("nav-menu");
  if (window.innerWidth < 768) { // md breakpoint
    menu.classList.add("hidden");
  }

  // Render page
  switch (page) {
    case "home":
      renderHome();
      break;
    case "modules":
      renderModules();
      break;
    case "progress":
      renderProgress();
      break;
    case "about":
      renderAbout();
      break;
    case "login":
      renderLogin();
      break;
    case "register":
      renderRegister();
      break;
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Quiz Functions
async function startQuiz(quizId) {
  showLoading();
  const mainContent = document.getElementById("main-content");

  try {
    const quiz = await fetchAPI(`/quizzes/${quizId}/`);

    mainContent.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-adinkra-brown mb-6 flex items-center gap-3">
          <i class="fas fa-clipboard-list"></i> ${quiz.title}
        </h2>
        
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p class="text-blue-800"><i class="fas fa-info-circle mr-2"></i>Answer all questions to complete the quiz</p>
        </div>
        
        <form id="quiz-form" class="space-y-6">
          ${quiz.questions
            .map(
              (question, index) => `
            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="font-semibold text-lg mb-4">
                <span class="bg-adinkra-brown text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-2">${index + 1}</span>
                ${question.question_text}
              </h3>
              <div class="space-y-2 ml-10">
                ${question.answers
                  .map(
                    (answer) => `
                  <label class="flex items-center p-3 bg-white rounded hover:bg-gray-100 cursor-pointer transition">
                    <input type="radio" name="question_${question.id}" value="${answer.id}" class="mr-3" required>
                    <span>${answer.answer_text}</span>
                  </label>
                `,
                  )
                  .join("")}
              </div>
            </div>
          `,
            )
            .join("")}
          
          <div class="flex gap-4">
            <button type="button" onclick="navigateTo('modules')" class="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition">
              <i class="fas fa-times mr-2"></i>Cancel
            </button>
            <button type="submit" class="flex-1 bg-adinkra-brown text-white px-6 py-3 rounded-lg hover:bg-adinkra-dark transition">
              <i class="fas fa-check mr-2"></i>Submit Quiz
            </button>
          </div>
        </form>
      </div>
    `;

    // Handle quiz submission
    document
      .getElementById("quiz-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const answers = {};

        for (let [key, value] of formData.entries()) {
          const questionId = key.split("_")[1];
          answers[questionId] = parseInt(value);
        }

        try {
          showLoading();
          const response = await fetch(
            `${API_BASE}/quizzes/${quizId}/submit/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
              },
              credentials: "include",
              body: JSON.stringify({ answers }),
            },
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          console.log("Quiz result:", result);

          mainContent.innerHTML = `
          <div class="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
            <div class="text-6xl mb-4">
              ${result.passed ? '<i class="fas fa-trophy text-yellow-500"></i>' : '<i class="fas fa-redo text-blue-500"></i>'}
            </div>
            <h2 class="text-3xl font-bold mb-4 ${result.passed ? "text-green-600" : "text-blue-600"}">
              ${result.passed ? "Congratulations!" : "Keep Learning!"}
            </h2>
            <p class="text-xl mb-6 text-gray-700">
              You scored ${result.score}/${result.total_questions} (${result.percentage}%)
            </p>
            ${
              result.passed
                ? '<p class="text-green-700 mb-6"><i class="fas fa-check-circle mr-2"></i>You passed the quiz!</p>'
                : '<p class="text-blue-700 mb-6"><i class="fas fa-info-circle mr-2"></i>You need 70% to pass. Review the material and try again.</p>'
            }
            <div class="flex gap-4 justify-center">
              <button onclick="navigateTo('modules')" class="bg-adinkra-brown text-white px-8 py-3 rounded-lg hover:bg-adinkra-dark transition">
                <i class="fas fa-arrow-left mr-2"></i>Back to Modules
              </button>
              ${
                !result.passed
                  ? `<button onclick="startQuiz(${quizId})" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
                    <i class="fas fa-redo mr-2"></i>Try Again
                  </button>`
                  : ""
              }
            </div>
          </div>
        `;
        } catch (error) {
          console.error("Quiz submission error:", error);
          showError("Failed to submit quiz. Please try again.");
        } finally {
          hideLoading();
        }
      });
  } catch (error) {
    showError("Failed to load quiz.");
  } finally {
    hideLoading();
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", async () => {
  // Check authentication status
  await checkAuth();

  // Navigation buttons
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => navigateTo(btn.dataset.page));
  });

  // Online/Offline detection
  window.addEventListener("online", () => {
    state.isOnline = true;
    document.getElementById("offline-indicator").classList.add("hidden");
  });

  window.addEventListener("offline", () => {
    state.isOnline = false;
    document.getElementById("offline-indicator").classList.remove("hidden");
  });

  // Initial page load - check URL hash or default to home
  const hash = window.location.hash.slice(1); // Remove the # symbol
  if (hash) {
    // Check if it's a module view (module/slug)
    const moduleMatch = hash.match(/^module\/([^\/]+)$/);
    // Check if it's a lesson view (module/moduleSlug/lesson/lessonSlug)
    const lessonMatch = hash.match(/^module\/([^\/]+)\/lesson\/([^\/]+)$/);
    
    if (lessonMatch) {
      // Navigate to specific lesson
      viewLesson(lessonMatch[1], lessonMatch[2]);
    } else if (moduleMatch) {
      // Navigate to specific module
      viewModule(moduleMatch[1]);
    } else {
      // Navigate to regular page (home, modules, progress, etc.)
      navigateTo(hash);
    }
  } else {
    // Otherwise, go to home
    navigateTo("home");
  }

  // Handle browser back/forward buttons
  window.addEventListener("hashchange", () => {
    const page = window.location.hash.slice(1) || "home";
    
    // Check for module/lesson routes
    const moduleMatch = page.match(/^module\/([^\/]+)$/);
    const lessonMatch = page.match(/^module\/([^\/]+)\/lesson\/([^\/]+)$/);
    
    if (lessonMatch) {
      viewLesson(lessonMatch[1], lessonMatch[2]);
    } else if (moduleMatch) {
      viewModule(moduleMatch[1]);
    } else if (state.currentPage !== page) {
      // Only navigate if we're not already on this page (prevents double-render)
      navigateTo(page);
    }
  });
});

// Authentication Functions
async function checkAuth() {
  try {
    const response = await fetch("/auth/check/");
    const data = await response.json();

    if (data.authenticated) {
      state.isAuthenticated = true;
      state.user = data.user;
      updateAuthUI();
    } else {
      state.isAuthenticated = false;
      state.user = null;
      updateAuthUI();
    }
  } catch (error) {
    console.error("Auth check failed:", error);
  }
}

function updateAuthUI() {
  const authContainer = document.getElementById("auth-container");
  const authContainerMobile = document.getElementById("auth-container-mobile");

  if (state.isAuthenticated && state.user) {
    // Desktop auth UI
    authContainer.innerHTML = `
      <div class="flex items-center gap-2 lg:gap-3">
        <div class="text-right hidden lg:block">
          <p class="text-sm font-semibold">${state.user.first_name || state.user.username}</p>
          <p class="text-xs text-adinkra-gold"><i class="fas fa-star mr-1"></i>${state.user.total_points} points</p>
        </div>
        <button onclick="handleLogout()" class="px-3 lg:px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg transition-all duration-200 font-medium text-sm lg:text-base whitespace-nowrap">
          <i class="fas fa-sign-out-alt mr-1 lg:mr-2"></i><span class="hidden lg:inline">Logout</span><span class="lg:hidden">Out</span>
        </button>
      </div>
    `;

    // Mobile auth UI
    authContainerMobile.innerHTML = `
      <div class="space-y-2">
        <div class="px-4 py-3 bg-white bg-opacity-10 rounded-lg">
          <p class="text-sm font-semibold">${state.user.first_name || state.user.username}</p>
          <p class="text-xs text-adinkra-gold"><i class="fas fa-star mr-1"></i>${state.user.total_points} points</p>
        </div>
        <button onclick="handleLogout()" class="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
          <i class="fas fa-sign-out-alt mr-2"></i>Logout
        </button>
      </div>
    `;
  } else {
    // Desktop auth UI
    authContainer.innerHTML = `
      <div class="flex items-center gap-1 lg:gap-2">
        <button onclick="navigateTo('login')" class="px-3 lg:px-4 py-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 font-medium text-sm lg:text-base whitespace-nowrap">
          <i class="fas fa-sign-in-alt mr-1"></i><span class="hidden lg:inline">Login</span>
        </button>
        <button onclick="navigateTo('register')" class="px-3 lg:px-4 py-2 bg-adinkra-gold text-adinkra-dark rounded-lg hover:shadow-lg transition-all duration-200 font-semibold text-sm lg:text-base whitespace-nowrap">
          <i class="fas fa-user-plus mr-1"></i><span class="hidden lg:inline">Register</span>
        </button>
      </div>
    `;

    // Mobile auth UI
    authContainerMobile.innerHTML = `
      <div class="space-y-2">
        <button onclick="navigateTo('login')" class="w-full px-4 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg transition font-semibold">
          <i class="fas fa-sign-in-alt mr-2"></i>Login
        </button>
        <button onclick="navigateTo('register')" class="w-full px-4 py-3 bg-adinkra-gold text-adinkra-dark rounded-lg hover:bg-opacity-90 transition font-semibold">
          <i class="fas fa-user-plus mr-2"></i>Register
        </button>
      </div>
    `;
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  try {
    showLoading();
    console.log('Attempting login...');
    const csrfToken = getCookie("csrftoken");
    console.log('CSRF Token:', csrfToken ? 'Found' : 'Not found');
    
    const response = await fetch("/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    });

    console.log('Login response status:', response.status);
    
    if (!response.ok) {
      console.error('Login request failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      alert(`Login failed: ${response.status} ${response.statusText}`);
      return;
    }

    const data = await response.json();
    console.log('Login response data:', data);

    if (data.success) {
      state.isAuthenticated = true;
      state.user = data.user;
      updateAuthUI();
      navigateTo("home");
    } else {
      alert(data.error || "Login failed");
    }
  } catch (error) {
    console.error('Login error:', error);
    alert("Login failed: " + error.message);
  } finally {
    hideLoading();
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const password = formData.get("password");
  const confirmPassword = formData.get("confirm_password");

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    showLoading();
    console.log('Attempting registration...');
    const csrfToken = getCookie("csrftoken");
    console.log('CSRF Token:', csrfToken ? 'Found' : 'Not found');
    
    const response = await fetch("/auth/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({
        username: formData.get("username"),
        email: formData.get("email"),
        password: password,
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        phone_number: formData.get("phone_number"),
        community: formData.get("community"),
      }),
    });

    console.log('Registration response status:', response.status);
    
    if (!response.ok) {
      console.error('Registration request failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      alert(`Registration failed: ${response.status} ${response.statusText}`);
      return;
    }

    const data = await response.json();
    console.log('Registration response data:', data);

    if (data.success) {
      state.isAuthenticated = true;
      state.user = data.user;
      updateAuthUI();
      navigateTo("home");
    } else {
      alert(data.error || "Registration failed");
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert("Registration failed: " + error.message);
  } finally {
    hideLoading();
  }
}

async function handleLogout() {
  try {
    showLoading();
    await fetch("/auth/logout/", {
      method: "POST",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
      credentials: "include",
    });

    state.isAuthenticated = false;
    state.user = null;
    updateAuthUI();
    navigateTo("home");
  } catch (error) {
    alert("Logout failed. Please try again.");
  } finally {
    hideLoading();
  }
}
