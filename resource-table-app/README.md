# EHR Resource Table Application

A Next.js application for displaying Electronic Health Record (EHR) resources from Firestore in an elegant table interface.

## Features

- **Modern Stack**: Next.js 15 + TypeScript + Tailwind CSS
- **Elegant UI**: shadcn/ui components with clean design
- **Interactive Table**: TanStack Table with row selection
- **Detailed View**: Side panel with comprehensive resource information
- **Real-time Data**: Firebase Firestore integration
- **Responsive Design**: Mobile-friendly interface
- **Loading States**: Skeleton components for smooth UX

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript
- **UI Components**: shadcn/ui, TanStack Table
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Date Handling**: date-fns

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project with Firestore enabled

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Get your Firebase configuration from Project Settings > General > Your apps
4. Copy `.env.local` and fill in your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Seed Sample Data

The application includes sample EHR resources. To seed your Firestore database:

1. Start the development server: `npm run dev`
2. Open the browser console at `http://localhost:3000`
3. Import and run the seeding function:

```javascript
// In browser console
const { seedResources } = await import('/src/scripts/seed-resources.ts');
await seedResources();
```

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/
│   ├── resources/          # Main resources page
│   └── page.tsx           # Home page (redirects to /resources)
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── ResourceTable.tsx  # Main table component
│   └── ResourceDetail.tsx # Detail sheet component
├── hooks/
│   └── useResources.ts    # Firestore data fetching hook
├── lib/
│   ├── firebase.ts        # Firebase configuration
│   ├── date-utils.ts      # Date formatting utilities
│   └── utils.ts           # General utilities
├── types/
│   └── resource.ts        # TypeScript type definitions
└── scripts/
    └── seed-resources.ts  # Sample data seeding script
```

## Data Model

The application uses the provided `ResourceWrapper` schema:

```typescript
interface ResourceWrapper {
  resource: {
    metadata: {
      state: ProcessingState;
      createdTime: string;
      fetchTime: string;
      processedTime?: string;
      identifier: {
        key: string;
        uid: string;
        patientId: string;
      };
      resourceType: string;
      version: FHIRVersion;
    };
    humanReadableStr: string;
    aiSummary?: string;
  };
}
```

## Features Overview

### Main Table View
- Displays `resourceType`, `createdTime`, and `fetchTime` columns
- Relative time formatting (e.g., "2 days ago")
- Clickable rows to view details
- Loading skeleton states
- Empty state handling

### Detail View
- Slides in from the right when a row is clicked
- Shows complete resource information
- Processing state badges with color coding
- Formatted metadata display
- Technical details section

### Error Handling
- Network error states
- Firestore connection issues  
- Graceful fallbacks

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Design Principles

- **Clean & Elegant**: Minimal, professional interface
- **Type Safety**: Full TypeScript coverage
- **Performance**: Optimized loading and rendering
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Responsive**: Works on all device sizes
- **Maintainable**: Well-organized, documented code

## Future Enhancements

- Search and filtering capabilities
- Sorting by multiple columns
- Real-time updates with Firestore listeners
- Export functionality
- Authentication integration
- Pagination for large datasets

---

Built with Next.js and Firebase