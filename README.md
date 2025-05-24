# Flappy Future

A futuristic take on the classic Flappy Bird game with beautiful neon visuals, particle effects, and smooth gameplay.

![Flappy Future Game](https://via.placeholder.com/800x400?text=Flappy+Future+Game)

## 🎮 Play Online

Play the game online at: [flappy-future.vercel.app](https://flappy-future.vercel.app)

## ✨ Features

- Beautiful futuristic neon design
- Smooth gameplay with adjustable difficulty
- Particle effects and visual feedback
- Mobile and desktop compatible
- Progressive difficulty that caps at a reasonable level
- High score tracking
- Background music and sound effects

## 🚀 Deployment

### Web Deployment on Vercel

1. **Fork or clone this repository**

2. **Deploy to Vercel**
   - Sign in to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Other
     - Root Directory: `/`
     - Build Command: None (or `npm run build` if you add a build process later)
     - Output Directory: `/www`
   - Click "Deploy"

3. **Environment Variables (if needed)**
   - Add any environment variables in the Vercel project settings

4. **Custom Domain (optional)**
   - Configure a custom domain in the Vercel project settings

### Android APK Build

1. **Prerequisites**
   - Node.js and npm
   - Apache Cordova: `npm install -g cordova`
   - Android Studio and Android SDK
   - JDK (Java Development Kit)

2. **Setup Environment Variables**
   - Set ANDROID_HOME to your Android SDK location
   - Set JAVA_HOME to your JDK installation
   - Add platform-tools and tools directories to PATH

3. **Build Commands**
   ```bash
   # Navigate to project directory
   cd flappy-bird
   
   # Add Android platform
   cordova platform add android
   
   # Install required plugins
   cordova plugin add cordova-plugin-insomnia cordova-plugin-statusbar
   
   # Build debug APK
   cordova build android
   
   # The APK will be at:
   # platforms/android/app/build/outputs/apk/debug/app-debug.apk
   ```

4. **Release Build**
   ```bash
   # Create keystore (only once)
   keytool -genkey -v -keystore flappy-future.keystore -alias flappy-future -keyalg RSA -keysize 2048 -validity 10000
   
   # Create build.json file with:
   {
     "android": {
       "release": {
         "keystore": "path/to/flappy-future.keystore",
         "storePassword": "your-store-password",
         "alias": "flappy-future",
         "password": "your-key-password"
       }
     }
   }
   
   # Build release APK
   cordova build android --release
   ```

## 🛠️ Development

### Project Structure

```
flappy-bird/
├── www/                  # Web assets (HTML, CSS, JS)
│   ├── index.html        # Main HTML file
│   ├── style.css         # Styles
│   ├── game.js           # Game logic
│   └── sounds/           # Sound effects
├── res/                  # Resources for mobile apps
│   ├── icon/             # App icons
│   └── screen/           # Splash screens
├── config.xml            # Cordova configuration
└── package.json          # Project dependencies
```

### Local Development

1. **Web Version**
   - Simply open `www/index.html` in a browser
   - For a local server: `npx http-server www`

2. **Mobile Testing**
   ```bash
   # Run on connected Android device
   cordova run android
   
   # Run in emulator
   cordova emulate android
   ```

### Game Customization

- **Adjust Difficulty**: Modify the gravity, game speed, and pipe spacing in `game.js`
- **Visual Changes**: Update colors and styles in `style.css`
- **Sound Effects**: Replace files in the `sounds` directory

## 📱 Controls

- **Web**: Click, tap, or press SPACE to make the bird flap
- **Mobile**: Tap anywhere on the screen

## 🔧 Troubleshooting

### Web Version
- If sounds don't play, check browser autoplay policies
- For performance issues, try a different browser

### Android Build
- Ensure all environment variables are correctly set
- Run `cordova requirements` to check for missing dependencies
- For signing issues, verify your keystore information

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Original Flappy Bird concept by Dong Nguyen
- Fonts from Google Fonts
- Sound effects from [placeholder]

---

Made with ❤️ by VARDHAN

