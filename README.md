# 🎮 Memory Card Game - Full Stack Web3 Application

![Memory Game Banner](https://img.shields.io/badge/Memory%20Game-Full%20Stack-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Tech-React%20%7C%20Node.js%20%7C%20Solidity-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)

A comprehensive memory card game featuring modern web technologies, blockchain integration, and performance optimizations. This project demonstrates full-stack development capabilities with Web3 integration.

---

![Image](https://github.com/user-attachments/assets/88c83b11-5a91-4d2a-8502-142ea02b1bfb)

## 🌟 **Features**

### 🎯 **Game Features**
- **Multiple Difficulty Levels**: Easy (2x2), Normal (3x2), Hard (4x3)
- **Fully Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Space-themed UI**: Beautiful cosmic design with pixel-art aesthetics
- **Smooth Animations**: Hardware-accelerated 3D card flips with React Spring
- **Game Statistics**: Real-time timer, learning moments counter, and comprehensive scoring
- **Game History**: Persistent storage with detailed analytics and filtering

### 🔗 **Web3 Integration**
- **MetaMask Wallet Connection**: Secure wallet integration with connection status
- **Smart Contract Interaction**: On-chain game logic validation and move recording
- **Blockchain Game Records**: Immutable game history stored on blockchain
- **Multi-network Support**: localhost, testnet compatibility with network detection

### ⚡ **Performance Optimizations**
- **Optimized Card Animations**: Hardware-accelerated 3D flips with `shouldForwardProp`
- **Console Error-Free**: Clean development experience with proper error handling
- **Debounced Interactions**: Prevents rapid clicking and double-firing events
- **Memory Management**: Efficient audio loading with autoplay policy compliance
- **Animation Performance**: Smooth 60fps animations with proper cleanup

### 🧪 **Quality Assurance**
- **Error-Free Console**: All React warnings and prop issues resolved
- **Responsive Testing**: Tested across mobile, tablet, and desktop viewports
- **Audio Handling**: Modern browser autoplay policy compliance
- **Accessibility**: ARIA compliance and keyboard navigation support

---

## 🛠️ **Tech Stack**

### **Frontend**
- **React 18** - Modern UI library with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **TypeScript Configuration** - Type safety and better development experience
- **TailwindCSS** - Utility-first CSS framework with custom responsive breakpoints
- **Material-UI (MUI)** - React component library for consistent UI
- **Styled-Components** - CSS-in-JS with shouldForwardProp optimization
- **React Spring** - Physics-based animations for smooth card flips
- **Axios** - HTTP client for API communication
- **PropTypes** - Runtime type checking for component props

### **Backend**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Minimal web application framework
- **MongoDB** - NoSQL document database
- **Mongoose** - MongoDB object modeling and validation
- **CORS** - Cross-origin resource sharing middleware
- **RESTful API** - Clean API architecture with proper error handling

### **Blockchain**
- **Solidity ^0.8.19** - Smart contract programming language
- **Hardhat** - Ethereum development environment and testing framework
- **Ethers.js v6** - Ethereum library for blockchain interaction
- **MetaMask Integration** - Web3 wallet connection and transaction handling
- **Local Blockchain** - Development network with 20 pre-funded accounts

### **Testing & Development**
- **Vitest** - Fast unit testing framework for Vite projects
- **Testing Library** - React component testing utilities
- **Hardhat Testing** - Comprehensive smart contract test suite
- **ESLint** - Code linting and formatting with React rules
- **Git** - Version control with conventional commit messages

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 16+ 
- MongoDB (local or Atlas)
- MetaMask browser extension
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/memory-card-game.git
   cd memory-card-game
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies (Hardhat)
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Backend .env file
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

4. **Start the development environment**
   
   **Terminal 1 - Blockchain (Local Network)**
   ```bash
   npx hardhat node
   ```
   
   **Terminal 2 - Smart Contract Deployment**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
   
   **Terminal 3 - Backend Server**
   ```bash
   cd backend
   npm start
   ```
   
   **Terminal 4 - Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`
   - Blockchain: `http://localhost:8545`

---

## 🎮 **How to Play**

1. **Register/Login**: Create an account or login to track your progress
2. **Connect Wallet**: Click "Web3 Wallet" to connect your MetaMask
3. **Choose Difficulty**: Select Easy, Normal, or Hard mode
4. **Play**: Flip cards to find matching pairs
5. **Track Progress**: View your game history and statistics

---

## 📁 **Project Structure**

```
memory-card-game/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React contexts (Web3, Blockchain)
│   │   ├── utils/            # Utility functions
│   │   ├── test/             # Test files
│   │   └── MemoryCardGame/   # Game components
│   ├── public/               # Static assets
│   └── package.json
├── backend/                  # Node.js backend API
│   ├── controllers/          # Route controllers
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── config/               # Configuration files
│   └── package.json
├── contracts/                # Solidity smart contracts
│   └── MemoryGame.sol
├── scripts/                  # Deployment scripts
│   └── deploy.js
├── test/                     # Smart contract tests
│   └── MemoryGame.js
├── hardhat.config.js         # Hardhat configuration
└── README.md
```

---

## 🧪 **Testing**

### **Frontend Tests**
```bash
cd frontend
npm test                 # Run all tests
npm run test:coverage    # Run with coverage report
npm run test:ui          # Run with UI interface
```

### **Smart Contract Tests**
```bash
npx hardhat test         # Run Solidity tests
npx hardhat coverage    # Generate coverage report
```

### **Test Coverage**
- Component testing: OptimizedCard, WalletConnection
- Utility testing: PerformanceOptimizer functions
- Smart contract testing: Game logic validation

---

## 🔧 **Performance Features & Recent Improvements**

### **Card Animation Optimizations**
- Hardware acceleration with `transform3d` and `will-change` CSS properties
- React Spring physics-based animations for natural card flipping
- `shouldForwardProp` implementation to prevent DOM prop warnings
- Optimized spring configurations for 60fps smooth animations
- Proper component memoization with React.memo and useMemo

### **Console Error Resolution**
- **Fixed DOM Prop Warnings**: Resolved `mouseDisabled` prop issues in styled-components
- **Audio Autoplay Handling**: Improved error handling for modern browser autoplay policies
- **useEffect Dependency Fixes**: Corrected dependency arrays to prevent card reset bugs
- **PropTypes Validation**: Added comprehensive prop validation for all components

### **Responsive Design Enhancements**
- **Mobile-First Approach**: Optimized for 320px+ devices with Tailwind breakpoints
- **Responsive Button Layout**: Vertical stacking on mobile, horizontal on desktop
- **Adaptive Card Grids**: Dynamic grid layouts based on difficulty and screen size
- **Touch-Friendly Interactions**: Proper touch event handling for mobile devices

### **Memory Management & Audio**
- Efficient image preloading and caching for card assets
- Audio volume control with localStorage persistence
- Modern browser autoplay policy compliance
- Proper event listener cleanup to prevent memory leaks
- Background music management with user interaction requirements

### **User Experience Improvements**
- Modal confirmation dialogs for game navigation
- Real-time game statistics (timer, learning moments)
- Smooth page transitions and loading states
- Error boundaries for graceful error handling

---

## 🌐 **Web3 Integration Details**

### **Smart Contract Features**
- Game state management on-chain
- Move validation and scoring
- Immutable game history
- Gas-optimized operations

### **Wallet Integration**
- MetaMask connection management
- Account change detection
- Network switching support
- Balance and transaction monitoring

---

## 🎯 **Development Roadmap**

### **Completed Features** ✅
- [x] Fully responsive game interface (mobile-first design)
- [x] Multiple difficulty levels with proper grid layouts
- [x] Comprehensive game history with filtering and analytics
- [x] Web3 wallet integration with MetaMask
- [x] Smart contract deployment and interaction
- [x] Performance optimizations and smooth animations
- [x] Automated testing suite (frontend + blockchain)
- [x] Console error resolution and clean development experience
- [x] Audio system with modern browser compliance
- [x] TypeScript configuration for better development
- [x] Responsive design across all device sizes
- [x] Error handling and user experience improvements

### **Recent Technical Achievements** 🚀
- [x] **DOM Prop Warning Fixes**: Implemented `shouldForwardProp` for styled-components
- [x] **Card Flip Bug Resolution**: Fixed useEffect dependency issues preventing card resets
- [x] **Audio Autoplay Compliance**: Proper error handling for browser autoplay policies
- [x] **Mobile Responsiveness**: Complete mobile-first responsive design implementation
- [x] **Performance Optimization**: Hardware-accelerated animations with cleanup
- [x] **Code Quality**: PropTypes validation and ESLint compliance

### **Future Enhancements** 🚧
- [ ] Multiplayer game modes
- [ ] NFT card collections
- [ ] Leaderboards and achievements
- [ ] Mobile app version
- [ ] Advanced analytics dashboard

---

## 👨‍💻 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- React and Vite communities for excellent tooling
- Hardhat team for blockchain development framework
- Material-UI for beautiful components
- Testing Library for robust testing utilities

---

## 📞 **Contact**

For questions or suggestions, please open an issue or contact the development team.

**Happy Gaming! 🎮✨**
