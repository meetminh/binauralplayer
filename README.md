# 🎧 Binaural Beats Generator

A modern web application that generates binaural beats using the Web Audio API. Experience deep focus, relaxation, or meditation with customizable audio frequencies.

![Binaural Beats Demo](https://img.shields.io/badge/demo-available-success) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Features

- 🎵 Generate binaural beats in real-time
- 🎚️ Adjustable parameters:
  - Base frequency (180-500Hz)
  - Beat frequency (0.5-20Hz)
  - Volume control
  - Smooth fade in/out
- ⏱️ Built-in session timer
- 🎧 Headphone-optimized audio
- 🚀 Built with Next.js 14 and React 19
- 🌈 Modern, responsive UI with Tailwind CSS

## 🎯 The Science of Binaural Beats

Binaural beats are an auditory illusion that occurs when two slightly different frequencies are presented separately to each ear. Your brain perceives a third tone that pulses at the difference between these frequencies. This phenomenon, discovered in 1839 by Heinrich Wilhelm Dove, is now being studied for its potential effects on brainwave entrainment and cognitive states.

### How It Works

1. **Auditory Processing**: When you hear two tones with slightly different frequencies (e.g., 300 Hz in one ear and 310 Hz in the other), your brain processes them together.
2. **Beat Perception**: Your brain perceives a rhythmic "beat" at 10 Hz (310Hz - 300Hz).
3. **Neural Entrainment**: With consistent exposure, your brainwaves may begin to synchronize with this frequency, potentially influencing your mental state.

### Brainwave States and Their Applications

Research suggests different frequency ranges are associated with various mental states. Here's a detailed guide to help you optimize your experience:

#### 🛌 Delta Waves (0.5 - 4 Hz)
- **Associated With**: Deep, dreamless sleep, healing, pain relief
- **Best For**:
  - Improving sleep quality
  - Deep meditation
  - Physical healing and regeneration
  - Immune system support
- **Recommended Session**: 30-60 minutes before bedtime
- **Base Frequency**: 200-300 Hz
- **Beat Frequency**: 0.5-4 Hz

#### 🧘 Theta Waves (4 - 8 Hz)
- **Associated With**: Deep meditation, creativity, REM sleep, deep relaxation
- **Best For**:
  - Enhancing creativity
  - Deep meditation
  - Emotional healing
  - Intuition and insight
- **Recommended Session**: 20-40 minutes
- **Base Frequency**: 200-300 Hz
- **Beat Frequency**: 4-8 Hz

#### 😌 Alpha Waves (8 - 13 Hz)
- **Associated With**: Relaxed alertness, stress reduction, positive thinking
- **Best For**:
  - Stress and anxiety reduction
  - Light meditation
  - Positive thinking
  - Pre-sleep relaxation
- **Recommended Session**: 15-30 minutes
- **Base Frequency**: 200-400 Hz
- **Beat Frequency**: 8-13 Hz

#### 💡 Beta Waves (13 - 30 Hz)
- **Associated With**: Active thinking, problem-solving, focused attention
- **Best For**:
  - Focus and concentration
  - Problem-solving
  - Active thinking
  - Cognitive performance
- **Recommended Session**: 15-30 minutes
- **Base Frequency**: 300-500 Hz
- **Beat Frequency**: 13-30 Hz

#### ⚡ Gamma Waves (30 - 100 Hz)
- **Associated With**: Peak cognitive functioning, information processing, learning
- **Best For**:
  - Memory recall
  - Information processing
  - Cognitive enhancement
  - Peak performance states
- **Recommended Session**: 10-20 minutes
- **Base Frequency**: 300-500 Hz
- **Beat Frequency**: 30-100 Hz

### Scientific Evidence and Research

Recent studies (2020-2023) have shown promising results:

- A 2023 study found that binaural beats in the alpha range (8-13 Hz) can significantly reduce anxiety and improve mood.
- Research indicates that theta wave entrainment may enhance meditation depth and creativity.
- Some studies suggest that gamma wave stimulation could improve cognitive performance and memory.

### Tips for Best Results

1. **Use Headphones**: Essential for proper binaural beat perception
2. **Start Low**: Begin with lower volumes and shorter sessions
3. **Be Consistent**: Regular use may yield better results
4. **Combine with Activities**: Use appropriate frequencies for specific activities (e.g., beta for work, theta for meditation)
5. **Stay Hydrated**: Proper hydration may enhance the effects

### Safety Considerations

- If you experience discomfort, dizziness, or headaches, discontinue use
- Not recommended for people with epilepsy or who are prone to seizures
- Consult a healthcare professional if you have any medical conditions
- **Gamma (30-100 Hz)**: Peak cognitive functioning

## 🚀 Deployment

This application is configured to be deployed to GitHub Pages. Here's how to deploy it:

### Prerequisites for Deployment
- GitHub account
- Node.js 18+ and npm

### Deployment Steps

1. **Push your code to GitHub** (if you haven't already):
   ```bash
   git add .
   git commit -m "chore: prepare for GitHub Pages deployment"
   git push origin main
   ```

2. **Enable GitHub Pages** in your repository settings:
   - Go to your repository on GitHub
   - Click on "Settings" > "Pages"
   - Under "Source", select "GitHub Actions"

3. **Trigger the deployment**:
   - The deployment will automatically run when you push to the `main` branch
   - You can also manually trigger it in the "Actions" tab

4. **Access your deployed app**:
   - Once deployed, your app will be available at:
     `https://<your-username>.github.io/binauralplayer`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Modern web browser with Web Audio API support
- Headphones for the best experience

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/meetminh/binauralplayer.git
   cd binauralplayer
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎛️ How to Use

1. **Connect Headphones**: For the best experience, use stereo headphones.
2. **Adjust Settings**:
   - **Base Frequency**: Set the base frequency (180-500Hz)
   - **Beat Frequency**: Choose your desired brainwave state (0.5-20Hz)
   - **Volume**: Adjust the output volume
   - **Fade**: Set fade in/out duration for smooth transitions
3. **Set Timer**: Use the session timer to automatically stop playback
4. **Start/Stop**: Click the button to begin or pause the binaural beat

## 🛠️ Technical Details

### Tech Stack

- **Frontend**: Next.js 14 with App Router
- **UI Components**: Radix UI Primitives with custom styling
- **Styling**: Tailwind CSS
- **Audio Processing**: Web Audio API
- **State Management**: React Hooks
- **Type Safety**: TypeScript

### Key Components

- `BinauralPlayer`: Main component that handles audio generation and UI
- `useBinauralBeat`: Custom hook that manages the Web Audio API
- `SessionTimer`: Component for setting session duration

### Audio Processing

The application generates two sine waves with slightly different frequencies (one for each ear) using the Web Audio API. The difference between these frequencies creates the binaural beat effect.

```typescript
// Simplified audio graph setup
const ctx = new AudioContext();
const master = ctx.createGain();

// Left channel oscillator
const leftOsc = ctx.createOscillator();
leftOsc.frequency.value = baseHz;
leftOsc.connect(ctx.createGain()).connect(ctx.destination);

// Right channel oscillator
const rightOsc = ctx.createOscillator();
rightOsc.frequency.value = baseHz + beatHz;
rightOsc.connect(ctx.createGain()).connect(ctx.destination);

// Start oscillators
leftOsc.start();
rightOsc.start();
```

## 📱 Browser Support

This application uses the Web Audio API, which is supported in all modern browsers:

- Chrome 35+
- Firefox 25+
- Safari 14.1+
- Edge 12+
- Opera 22+

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Next.js](https://nextjs.org/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/meetminh/binauralplayer](https://github.com/meetminh/binauralplayer)
