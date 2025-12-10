<div align="center">
  <img src="./assets/logo-wordmark.svg" alt="Recon - Bug Tracking Intelligence" width="400" style="margin: auto;">

  <h3>Tactical Intelligence for Software Quality</h3>
  <p><em>Your Personal Shield Against "He Said, She Said."</em></p>
</div>

---

Ever reported a critical bug, only to be told weeks later that it "slipped through the cracks"? Are you tired of the blame game during crunch time, where verbal agreements and scattered notes aren't enough to prove what was said?

**Recon** is a tactical bug tracking intelligence system built for professionals on the front lines of software quality. It's your single source of truth—a private, undeniable log of every bug, every conversation, and every decision. Stop relying on memory. Start relying on precision data.

## 🎯 The Mission

In fast-paced teams without centralized project management tools, vital intelligence gets lost:

- Verbal commitments from developers vanish into thin air
- Critical decisions made in passing are never documented
- The burden of proof falls unfairly on the tester
- Bugs "slip through the cracks" and accountability disappears

**Recon provides tactical reconnaissance for your defects—turning chaos into documented, undeniable evidence.**

## ⚡ Core Intelligence Features

### 🎯 The Sacred Timeline (Killer Feature)

The crown jewel of Recon. Every bug gets a stunning, interactive visual timeline rendered with advanced Skia graphics. Each conversation, decision, and update becomes a timestamped event in the bug's life story—creating an undeniable record of accountability.

- **Nexus Events**: Flag critical decisions (like "Won't Fix") as special branching events with visual glow effects
- **Tap-to-Reveal**: Clean, tactical interface with details revealed on interaction
- **Smooth Animations**: Professional pulse effects and transitions using React Native Reanimated

### 📊 Real-Time Intelligence Dashboard

Get instant situational awareness of your bug landscape:

- **Status Tracking**: Live counts of reported, in-progress, and resolved bugs
- **Urgency Matrix**: Critical bugs, overdue items, due soon alerts, and unassigned gaps
- **Priority Color Coding**: Tactical visual indicators across the entire UI
- **Quick Navigation**: Tap any metric to filter and dive deep

### 🔔 Deadline Intelligence

Never miss a critical deadline with smart notification system:

- **Flexible Reminders**: Set alerts 1-7 days before due dates
- **Advance Warnings**: Get notified before deadlines become overdue
- **Smart Tracking**: Dashboard highlights overdue and due-soon items automatically

### 📋 Comprehensive Bug Tracking

Military-grade detail capture for every defect:

- **Complete Metadata**: Severity, Priority, Status, Assignee, Environment, Resolution
- **Reproduction Steps**: Document exactly how to trigger the issue
- **Expected vs Actual**: Clear comparison of intended behavior
- **Test Case Linking**: Connect bugs to requirement numbers and test cases

### 📤 Export & Sharing

Transform your data into actionable reports:

- **CSV Export**: Generate detailed bug reports for analysis and stakeholder communication
- **Timeline Included**: Export complete conversation history with timestamps
- **One-Tap Sharing**: Instantly share reports via any installed app

### 🔒 Offline-First Architecture

Your data, your device, your control:

- **Local SQLite Database**: Lightning-fast performance with WAL mode optimization
- **Zero Internet Dependency**: Works perfectly offline, always
- **Secure by Design**: All data stays encrypted on your device
- **No Cloud Lock-in**: You own your intelligence

## 🎯 Tactical Design Philosophy

Recon embodies **military precision** in software quality assurance:

- **Crosshairs Branding**: Logo features tactical crosshairs symbolizing precision targeting
- **Dark Intelligence Theme**: Professional dark UI (#1a1d29) with electric blue accents (#00d4ff)
- **Radar Aesthetics**: Splash screen and iconography inspired by reconnaissance systems
- **60-30-10 Color Rule**: True black backgrounds, dark gray surfaces, vibrant accent highlights
- **8pt Grid System**: Military-grade systematic spacing and alignment

### 🎖️ Built For

**QA Testers & Engineers** who approach bug hunting with tactical precision and need undeniable accountability records.

**Software Engineers** who want a personal command center for assigned defects with deadline intelligence.

**Project Managers** in fast-moving teams who need lightweight but comprehensive visual issue tracking.

**Independent Developers** who demand systematic quality assurance with professional polish.

## 🚀 Future Intelligence Operations

**Phase 2 Reconnaissance:**

- [ ] **Visual Evidence Capture**: Attach images and video recordings to timeline events
- [ ] **Advanced Analytics**: Trend analysis, bug heatmaps, and predictive insights
- [ ] **Team Collaboration**: Secure bug sharing and synchronized timeline discussions
- [ ] **Cloud Backup**: Optional encrypted backup with cross-device synchronization
- [ ] **Integration Hub**: Connect with Jira, GitHub Issues, and other tracking systems

---

## ⚙️ Deployment Operations

### Prerequisites

- Node.js 18+ installed
- Expo CLI configured
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. **Clone Repository**

   ```bash
   git clone https://github.com/atharvdange618/Recon.git
   cd Recon
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Launch Development Build**
   ```bash
   npm start
   # Scan QR code with Expo Go, or use:
   npm run android  # For Android
   npm run ios      # For iOS
   ```

### Building Production APK

```bash
# Generate Android APK
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
# APK located at: android/app/build/outputs/apk/release/
```

## 🏗️ Technical Arsenal

### Core Technology Stack

| Component         | Technology                               | Purpose                          |
| ----------------- | ---------------------------------------- | -------------------------------- |
| **Framework**     | React Native 0.79                        | Cross-platform mobile foundation |
| **SDK**           | Expo 53                                  | Rapid development & deployment   |
| **Language**      | TypeScript                               | Type-safe, maintainable codebase |
| **Database**      | SQLite + WAL Mode                        | Lightning-fast local storage     |
| **Graphics**      | Skia Canvas (@shopify/react-native-skia) | Advanced timeline rendering      |
| **Animation**     | React Native Reanimated 3.17             | 60fps smooth interactions        |
| **State**         | Zustand 5.0                              | Lightweight state management     |
| **Notifications** | Expo Notifications                       | Deadline reminder system         |
| **File Ops**      | Expo FileSystem + Sharing                | CSV export & sharing             |

### Architecture Highlights

- **Offline-First**: SQLite database ensures zero latency and complete offline functionality
- **Type Safety**: Full TypeScript coverage prevents runtime errors
- **Performance**: WAL mode + optimized queries for instant data access
- **Visual Excellence**: Skia-powered graphics for console-quality animations
- **Cross-Platform**: Single codebase for Android & iOS with platform-specific optimizations

### Project Structure

```
/app                    # Expo Router pages (file-based routing)
  ├── _layout.tsx      # Root layout with DB initialization
  ├── index.tsx        # Intelligence dashboard
  ├── add.tsx          # Multi-step bug creation form
  ├── bug/[id].tsx     # Bug detail with Sacred Timeline
  └── edit/[id].tsx    # Bug editor

/components            # Tactical UI components
  ├── SacredTimeline.tsx    # Skia-based timeline renderer
  ├── BugCard.tsx          # Priority-coded bug display
  ├── AddEventModal.tsx    # Timeline event creator
  ├── ReminderToggle.tsx   # Deadline notification UI
  └── [...]

/lib                   # Core intelligence systems
  ├── database.ts      # SQLite operations & queries
  ├── notifications.ts # Deadline reminder scheduling
  ├── csvExport.ts     # Report generation & sharing
  ├── theme.ts         # Tactical design system
  └── options.ts       # Form configurations
```

---

<div align="center">

### 🎖️ Mission Status: **OPERATIONAL**

<img src="./assets/logo-icon-source.svg" alt="Recon Icon" width="100">

**Recon v1.0** - _Tactical Bug Tracking Intelligence_

Built with **React Native** • **Expo SDK 53** • **SQLite** • **Skia Graphics** • **TypeScript**

**Local-First** • **Cross-Platform** • **Production-Ready**

---

_"Because every bug tells a story, and every story needs proof."_

</div>
