# Study Timeline Planner

A smart study planning application that helps students organize their test preparation by generating personalized study schedules based on uploaded materials and learning preferences.

## Features

### ✅ Completed Features

- **📚 Material Management**
  - Drag-and-drop file upload
  - Support for PDF, DOCX, TXT files
  - Material organization and deletion

- **📅 Test Creation & Schedule Generation**
  - Create test preparations with name and date
  - Automatic schedule generation based on:
    - Available time until test
    - Study preferences (intensity level, buffer days)
    - Material complexity
  - Smart task distribution across days

- **⏱️ Study Timer**
  - Start/Pause/Resume functionality
  - Real-time elapsed time tracking
  - Task completion tracking
  - Session state management

- **🎯 Dashboard**
  - Test countdown with color-coded urgency
  - Progress tracking with visual indicators
  - Today's task list
  - Study statistics (days remaining, tasks, materials)

- **⚙️ Study Profile Configuration**
  - Study Type: Visual/Reading/Practice/Balanced
  - Intensity Level: Light (1-2h)/Moderate (2-4h)/Intensive (4-6h)
  - Preferred Study Time: Morning/Afternoon/Evening/Flexible
  - Spaced Repetition toggle
  - Buffer days before test (0-3 days)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Date Handling**: dayjs
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd nextjs-14-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Upload Materials**: Navigate to Materials page and upload your study files
2. **Create Test**: Click "Create New Test" button, enter test details
3. **Auto-generate Schedule**: System creates daily study tasks automatically
4. **Start Studying**: Use the timer on dashboard to track your study sessions
5. **Configure Preferences**: Adjust your study profile in Settings

## Project Structure

```
nextjs-14-app/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Main dashboard page
│   ├── materials/         # Material upload/management
│   ├── calendar/          # Schedule calendar view
│   └── settings/          # User preferences
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── shared/           # Shared components (dialogs, task list)
│   └── layout/           # Layout components (sidebar, header)
├── lib/
│   ├── store.ts          # Zustand state management
│   ├── schedule-generator.ts  # Schedule generation logic
│   ├── mock-data.ts      # Development mock data
│   └── utils.ts          # Utility functions
└── types/
    └── index.ts          # TypeScript type definitions
```

## Building for Production

```bash
npm run build
npm start
```

## Future Enhancements

- [ ] AI-powered material analysis
- [ ] Progress analytics and insights
- [ ] Mobile app version
- [ ] Collaborative study groups
- [ ] Integration with calendar apps
- [ ] Spaced repetition algorithm implementation
- [ ] Material highlighting and annotations

## License

MIT

## Author

Built with ❤️ using Next.js and modern web technologies
