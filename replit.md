# Anthaathi - AI Farming Companion

## Overview

Anthaathi is a mobile-first AI farming companion application built with Expo (React Native) and an Express backend. It targets farmers (primarily in Tamil Nadu, India) with features including weather information, pest/disease detection via image upload, AI chat assistant (UZHAVAN), market price tracking, expense management, and bilingual support (English/Tamil). The app uses a file-based routing system via expo-router and communicates with an Express API server.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo / React Native)

- **Framework**: Expo SDK 54 with React Native 0.81, using the new architecture
- **Routing**: `expo-router` v6 with file-based routing in the `app/` directory. Each screen is a separate file (`home.tsx`, `weather.tsx`, `chat.tsx`, `pest.tsx`, `market.tsx`, `expenses.tsx`, `profile.tsx`, `login.tsx`, `language.tsx`)
- **State Management**: React Context for auth (`lib/AuthContext.tsx`) and language (`lib/LanguageContext.tsx`), with `@tanstack/react-query` for server state management
- **Local Storage**: `@react-native-async-storage/async-storage` for persisting user profile, language preference, and expenses data
- **Internationalization**: Simple JSON-based i18n with language files in `assets/lang/en.json` and `assets/lang/ta.json` (English and Tamil)
- **UI**: Custom components with no external UI library. Uses `expo-linear-gradient`, `expo-image`, `expo-haptics`, and icon libraries (`@expo/vector-icons`). Font: Nunito (Google Fonts)
- **Authentication**: Currently client-side only using AsyncStorage (mock OTP flow). No real backend auth yet
- **Key Libraries**: `react-native-gesture-handler`, `react-native-reanimated`, `react-native-keyboard-controller`, `react-native-safe-area-context`, `react-native-screens`

### Backend (Express)

- **Framework**: Express v5 running on Node.js
- **Location**: `server/` directory with `index.ts` (server setup, CORS, static serving), `routes.ts` (API route registration), and `storage.ts` (data storage interface)
- **Storage**: Currently uses in-memory storage (`MemStorage` class) with an `IStorage` interface that can be swapped for database-backed implementation
- **CORS**: Dynamic CORS setup supporting Replit dev/deployment domains and localhost for Expo web development
- **Build**: Uses `esbuild` for server production builds, outputs to `server_dist/`
- **Development**: Uses `tsx` for TypeScript execution in development mode

### Database Schema

- **ORM**: Drizzle ORM configured for PostgreSQL (`drizzle.config.ts`)
- **Schema**: Defined in `shared/schema.ts` with Zod validation via `drizzle-zod`
- **Current Tables**: `users` table with `id` (UUID, auto-generated), `username` (unique), and `password` fields
- **Migrations**: Output to `./migrations` directory, managed via `drizzle-kit push`
- **Note**: The database schema is minimal and currently not fully integrated with the app's auth flow (which uses AsyncStorage client-side)

### Shared Code

- `shared/schema.ts` contains Drizzle table definitions and Zod schemas, shared between server and client via path alias `@shared/*`
- Path aliases configured in `tsconfig.json`: `@/*` maps to root, `@shared/*` maps to `./shared/*`

### Build & Deployment

- Development: Expo dev server (`expo:dev`) + Express server (`server:dev`) run separately
- Production: Static web build via custom `scripts/build.js`, server build via esbuild, served by Express (`server:prod`)
- The Express server serves the static Expo web build in production and proxies to Metro bundler in development

### Screen Flow

1. `index.tsx` - Splash screen, checks auth state, redirects to `/home` or `/login`
2. `login.tsx` - Phone + OTP login (currently mocked)
3. `language.tsx` - Language selection (English/Tamil)
4. `home.tsx` - Dashboard with feature cards
5. `weather.tsx` - Weather display (currently mock data)
6. `pest.tsx` - Image-based pest/disease detection using camera/gallery
7. `chat.tsx` - AI farming assistant chat (currently uses canned responses)
8. `market.tsx` - Crop market prices (currently static sample data)
9. `expenses.tsx` - Farm expense tracker (persisted to AsyncStorage)
10. `profile.tsx` - User profile management

## External Dependencies

- **PostgreSQL**: Database configured via `DATABASE_URL` environment variable, managed through Drizzle ORM. Used for persistent server-side data storage
- **Expo Services**: Expo build/update infrastructure, font loading (`@expo-google-fonts/nunito`)
- **AsyncStorage**: Client-side persistence for user sessions, language preferences, and expense data
- **Image Picker**: `expo-image-picker` for camera and gallery access (pest detection feature)
- **Location**: `expo-location` included as dependency (for potential weather/location features)
- **No external AI/ML services currently integrated** - Chat responses and pest analysis are mocked. These would need real API integrations (e.g., OpenAI, custom ML model) to be functional
- **No real weather API integrated** - Weather data is currently hardcoded mock data
- **No real market price API integrated** - Market prices are static sample data