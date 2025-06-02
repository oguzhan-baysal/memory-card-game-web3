# 🎮 Memory Card Game - Full Stack Web3 Application

![Memory Game Banner](https://img.shields.io/badge/Memory%20Game-Full%20Stack-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Tech-React%20%7C%20Node.js%20%7C%20Solidity-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)

A comprehensive memory card game featuring modern web technologies, blockchain integration, and performance optimizations. This project demonstrates full-stack development capabilities with Web3 integration.

---

## 🌟 **Features**

### 🎯 **Game Features**
- **Multiple Difficulty Levels**: Easy (2x2), Normal (2x3), Hard (3x4)
- **Responsive Design**: Works seamlessly on all devices
- **Space-themed UI**: Beautiful cosmic design with animations
- **Game Statistics**: Time tracking, attempts counter, and score system
- **Game History**: Persistent storage of all game sessions

### 🔗 **Web3 Integration**
- **MetaMask Wallet Connection**: Secure wallet integration
- **Smart Contract Interaction**: On-chain game logic validation
- **Blockchain Game Records**: Immutable game history on blockchain
- **Multi-network Support**: localhost, testnet compatibility

### ⚡ **Performance Optimizations**
- **Optimized Card Animations**: Hardware-accelerated 3D flips
- **Debounced Interactions**: Prevents rapid clicking issues
- **Memory Management**: Efficient image preloading and caching
- **Animation Performance Monitoring**: Real-time FPS tracking

### 🧪 **Testing & Quality**
- **Automated Testing**: Comprehensive test suite with Vitest
- **Component Testing**: React component unit tests
- **Performance Testing**: Animation and interaction testing
- **Accessibility**: ARIA compliance and keyboard navigation

---

## 🛠️ **Tech Stack**

### **Frontend**
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Material-UI** - React component library
- **React Spring** - Physics-based animations
- **Framer Motion** - Advanced animation library

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### **Blockchain**
- **Solidity** - Smart contract programming language
- **Hardhat** - Ethereum development environment
- **Ethers.js** - Ethereum library for frontend
- **MetaMask** - Web3 wallet integration

### **Testing & Development**
- **Vitest** - Fast unit testing framework
- **Testing Library** - React component testing
- **ESLint** - Code linting and formatting
- **Git** - Version control

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

## 🔧 **Performance Features**

### **Card Animation Optimizations**
- Hardware acceleration with `transform3d` and `will-change`
- Debounced click handlers to prevent rapid firing
- Memoized components with React.memo and useMemo
- Optimized spring configurations for smooth animations

### **Memory Management**
- Image preloading and caching
- Efficient state management with cleanup
- Animation performance monitoring
- Lazy loading for non-critical resources

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
- [x] Responsive game interface
- [x] Multiple difficulty levels
- [x] Game history and statistics
- [x] Web3 wallet integration
- [x] Smart contract deployment
- [x] Performance optimizations
- [x] Automated testing suite

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
