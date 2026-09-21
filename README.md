# CineCatalog — Movies & TV Shows (TMDB)

A React Native CLI app that browses **all nine** TMDB lists from the brief, with search, an
offline-persisted watchlist and a local star rating.

Built as the technical test for the **App Developer** position at **Elemes Group**.

---

## Ringkasan singkat (Bahasa Indonesia)

Aplikasi katalog film & acara TV berbasis **React Native CLI** (bukan Expo) yang menampilkan
**9 dari 9** daftar TMDB (target brief: minimal 4), plus **search**, **watchlist** dan **rating**
yang tersimpan lokal di perangkat, **splash screen native**, dan **loading state** (skeleton)
di setiap pengambilan data.

Cara menjalankan (ringkas):

```bash
npm install
cp .env.example .env      # Windows: Copy-Item .env.example .env
# isi TMDB_READ_ACCESS_TOKEN di dalam .env
npm start                 # terminal 1 — Metro
npm run android           # terminal 2 — build & install ke emulator/device
```

Detail lengkap ada di bagian [Installation & running](#installation--running).

---

## Table of contents

- [Feature coverage vs. the brief](#feature-coverage-vs-the-brief)
- [Screenshots](#screenshots)
- [Tech stack](#tech-stack)
- [Installation & running](#installation--running)
- [Project structure](#project-structure)
- [How the data layer works](#how-the-data-layer-works)
- [Testing & code quality](#testing--code-quality)
- [Design decisions and trade-offs](#design-decisions-and-trade-offs)
- [Known issues / limitations](#known-issues--limitations)

---

## Feature coverage vs. the brief

### The nine lists — all implemented and displayed (`9/9`)

Every list from the brief is reachable in the UI: four per media tab as horizontal shelves, and
each has a **See All** screen with its own paginated grid. The registry that drives this lives in
`src/features/catalog/catalogConfig.ts`, so a category can never be "called by the API but never
shown".

| # | Brief requirement | Endpoint | Where it is shown |
|---|---|---|---|
| 1 | Top rated movies | `GET /movie/top_rated` | Movies tab → shelf + See All |
| 2 | Upcoming movies | `GET /movie/upcoming` | Movies tab → shelf + See All |
| 3 | Now playing movies | `GET /movie/now_playing` | Movies tab → shelf + See All |
| 4 | Popular movies | `GET /movie/popular` | Movies tab → shelf + See All |
| 5 | Popular TV shows | `GET /tv/popular` | TV Shows tab → shelf + See All |
| 6 | Top rated TV shows | `GET /tv/top_rated` | TV Shows tab → shelf + See All |
| 7 | On the air TV shows | `GET /tv/on_the_air` | TV Shows tab → shelf + See All |
| 8 | Airing today TV shows | `GET /tv/airing_today` | TV Shows tab → shelf + See All |
| 9 | Popular people | `GET /person/popular` | People tab → paginated grid |

### Other requirements

| Requirement | Status | Where |
|---|---|---|
| Splash screen | ✅ native | `SplashTheme` + `splash_background.xml` + `MainActivity.onCreate` |
| Loading state while fetching | ✅ | Skeleton loaders (`Skeleton.tsx`) on every screen; footer spinner for page 2+ |
| Attractive UI/UX | ✅ | Dark "cinema" theme, poster carousels, See All grids, pull-to-refresh |
| Search (bonus) | ✅ | `/search/multi` with 400 ms debounce — covers movies, TV and people |
| Rating **or** watchlist | ✅ both | Watchlist in AsyncStorage **and** a 5-star user rating |
| GitHub docs: install & run | ✅ | This file |
| Git version control | ✅ | Conventional commits, logical history |
| Tech: React Native / Kotlin / Android Studio | ✅ | React Native CLI 0.85, TypeScript strict |
| Detail screens (bonus) | ✅ | Movie / TV / person detail with cast and filmography |
| Error & empty states | ✅ | `StateView` with a Retry action on every screen |
| Offline awareness | ✅ | `OfflineBanner` via `@react-native-community/netinfo` |
| Pagination / infinite scroll | ✅ | See All grids, People grid and search results |

---

## Screenshots

> This repo deliberately contains **no committed screenshots** — captures should come from a device
> running the current code rather than from an earlier build. Capture them with:

```bash
adb shell screencap -p /sdcard/shot.png
adb pull /sdcard/shot.png docs/screenshots/movies.png
```

Suggested capture set: **splash**, **Movies tab** (four shelves), **TV Shows tab**, **People grid**,
a **movie detail** (showing *Add to Watchlist* and the star rating), **search results**, and the
**Watchlist tab**.

---

## Tech stack

| Layer | Choice | Version |
|---|---|---|
| Framework | React Native **CLI** (not Expo) | 0.85.2 |
| Language | TypeScript (strict) | 5.8 |
| UI runtime | React | 19.2 |
| State management | Redux Toolkit | 2.12 |
| Data fetching / caching | **RTK Query** (`createApi`) — no manual axios/fetch in components | 2.12 |
| Navigation | React Navigation (native-stack + bottom-tabs) | 7.x |
| Local storage | `@react-native-async-storage/async-storage` | 3.1 |
| Connectivity | `@react-native-community/netinfo` | 12.x |
| Env config | `react-native-dotenv` (build-time inlining, `.env` never committed) | 4.1 |
| Testing | Jest + React Native Testing Library | 29 / 14 |
| Linting / formatting | ESLint (`@react-native` config) + Prettier | 8 / 2.8 |
| Splash screen | Native Android launch theme (zero extra dependencies) | — |

---

## Installation & running

### 1. Prerequisites

| Tool | Version used here | Notes |
|---|---|---|
| Node.js | 22.23.1 | `>= 22.11` enforced by `package.json` |
| JDK | 17 | Required by the Android Gradle Plugin |
| Android Studio + SDK | platform + build-tools 36 | `ANDROID_HOME` must be set |
| Emulator or physical device | API 24+ | Enable USB debugging for a device |

Verify your setup:

```bash
node -v
java -version
echo %ANDROID_HOME%        # Windows
echo $ANDROID_HOME         # macOS / Linux
adb devices
```

### 2. Install dependencies

```bash
git clone <this-repository-url>
cd elemes-tmdb-app
npm install
```

### 3. Configure your TMDB credentials

Create an API key at <https://www.themoviedb.org/settings/api>. You can use either:

- **API Read Access Token** (v4, recommended) — the long JWT starting with `eyJ…`
- **API Key (v3)** — the 32-character hex string (supported as a fallback)

Create the local env file:

```bash
# macOS / Linux
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

Then fill it in:

```ini
TMDB_READ_ACCESS_TOKEN=eyJhbGciOi...your-token...
TMDB_API_KEY=                       # optional fallback
```

> `.env` is **git-ignored**, so real credentials are never committed.
> The v4 token is sent as `Authorization: Bearer …`. If only the v3 key is present the app falls
> back to the `api_key` query parameter — see `src/shared/api/tmdbApi.ts`.
> After editing `.env`, restart Metro with a cleared cache: `npm start -- --reset-cache`.

### 4. Start Metro

```bash
npm start
```

### 5. Build, install and launch on Android

In a second terminal:

```bash
npm run android
```

Equivalent manual flow (useful when a device is not auto-detected):

```bash
cd android
./gradlew assembleDebug             # Windows: gradlew.bat assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.elemestmdbapp/.MainActivity
```

The launcher shows **CineCatalog**; a native splash screen is displayed until React takes over.

### Useful scripts

| Command | Purpose |
|---|---|
| `npm start` | Start the Metro bundler |
| `npm run android` | Build, install and launch on Android |
| `npm test` | Run the Jest suite |
| `npm run lint` | ESLint across the project |
| `npx tsc --noEmit` | Type-check without emitting files |
| `npx react-native run-android --deviceId <id>` | Target a specific device |

### iOS (not included in this submission)

The brief targets Android (`Android Studio` is listed under allowed tooling) and this project was
developed and verified on Android. The iOS project is present in `ios/` and the shared JavaScript
is platform-agnostic, so running it on a Mac is:

```bash
cd ios && pod install && cd ..
npm run ios
```

---

## Project structure

Feature-first layout: each feature owns its slice, components and screens, while anything shared
lives under `src/shared`.

```
src/
├── app/                        # app shell
│   ├── navigation/
│   │   ├── RootNavigator.tsx    # stack + bottom tabs, dark theme
│   │   └── types.ts             # typed route params
│   └── store/
│       └── store.ts             # Redux store + typed hooks (useAppDispatch/Selector)
├── constants/
│   ├── config.ts                # ONLY module that reads `@env` credentials
│   └── tmdb.ts                  # pure base URLs + image sizes (unit-testable)
├── features/
│   ├── catalog/
│   │   ├── catalogConfig.ts      # registry of the nine lists (+ requirement numbers)
│   │   ├── useMediaList.ts       # paginated movie/TV list hook
│   │   ├── components/CatalogSection.tsx
│   │   └── screens/             # MoviesScreen, TvShowsScreen, CatalogGroupScreen,
│   │                            # CategoryListScreen (See All)
│   ├── people/
│   │   ├── usePeopleList.ts
│   │   └── screens/PeopleScreen.tsx
│   ├── detail/
│   │   ├── detailStyles.ts       # shared detail typography
│   │   └── screens/             # MovieDetail, TvDetail, PersonDetail
│   ├── search/screens/SearchScreen.tsx
│   └── watchlist/
│       ├── watchlistSlice.ts     # Redux slice (entries + user rating)
│       ├── watchlistStorage.ts   # AsyncStorage read/write, defensive parsing
│       ├── useWatchlistPersistence.ts
│       └── screens/WatchlistScreen.tsx
└── shared/
    ├── api/tmdbApi.ts            # RTK Query: 11 endpoints, one base API
    ├── components/               # MediaCard, PosterImage, RatingBadge, Skeleton,
    │                             # StateView, SectionCarousel, StarRating, ScreenHeader, …
    ├── hooks/useDebouncedValue.ts
    ├── theme/                    # colors.ts, layout.ts
    ├── types/                    # tmdb.ts, catalogRow.ts
    └── utils/                    # imageUrl.ts, formatters.ts
```

Rule of thumb applied throughout: **`shared/` never imports from `features/`**. That is why
`PersonCard` and the category type definitions live in `src/shared` even though a "person" feels
like a feature.

---

## How the data layer works

- **One RTK Query API** (`src/shared/api/tmdbApi.ts`) defines all 11 endpoints. Components never
  call `fetch`/`axios` directly; they consume generated hooks, so caching, de-duplication,
  refetching and invalidation come for free.
- **Auth**: `prepareHeaders` attaches `Authorization: Bearer <token>` when a v4 token exists, and
  the request helpers append `api_key` only when it does not.
- **Types**: every payload is modelled in `src/shared/types/tmdb.ts`. The UI never receives `any`;
  `search/multi` results are a discriminated union narrowed by `media_type`.
- **Normalisation**: TMDB returns `title` for movies and `name` for TV, `release_date` vs
  `first_air_date`, and often `null` poster paths. `src/shared/utils/formatters.ts` converts all of
  that into one `MediaSummary` view model, which is why `MediaCard` is a dumb component.
- **Pagination**: `useMediaList` / `usePeopleList` accumulate pages, de-duplicate by id and ignore
  responses that do not belong to the page currently on screen.

---

## Testing & code quality

```bash
npm test          # 49 tests / 5 suites
npm run lint      # ESLint, 0 errors and 0 warnings
npx tsc --noEmit  # 0 type errors
```

### What was verified on this build

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 type errors |
| `npx eslint . --max-warnings 0` | 0 errors, 0 warnings |
| `npx jest --ci` | 49 tests / 5 suites, all passing |
| `gradlew assembleDebug` | **BUILD SUCCESSFUL** — 199 tasks, including `MainActivity.kt`, the splash resources and CMake builds for all four ABIs |
| `react-native bundle --dev false` | Production JS bundle built (≈1.5 MB, 19 assets) with the `.env` token inlined |
| Interactive device run | **Not done here** — see limitation 7 below |

What is covered:

| Suite | Focus |
|---|---|
| `src/shared/utils/__tests__/formatters.test.ts` | Date/rating/runtime/count formatting and the movie-vs-TV normalisers, including the empty and `null` cases TMDB actually returns |
| `src/shared/utils/__tests__/imageUrl.test.ts` | Image URL building, size selection, missing-path handling |
| `src/features/watchlist/__tests__/watchlistSlice.test.ts` | Add/toggle/remove, de-duplication, `movie` vs `tv` with the same id, rating clamping |
| `src/shared/components/__tests__/MediaCard.test.tsx` | Rendering, accessibility label, press callback, `NR` + placeholder fallback |
| `src/shared/components/__tests__/StarRating.test.tsx` | Score read-out, tapping a star, clearing a rating, read-only mode |

Deliberate choices in the test setup:

- **No test touches `@env`.** `src/constants/tmdb.ts` holds the pure constants, so the suite passes
  on a fresh clone that has no `.env` file.
- **`transformIgnorePatterns` is widened** in `jest.config.js` because Redux Toolkit's ESM-only
  dependencies (immer, reselect) are not transformed by the React Native Jest preset by default.
- **No unused dependencies.** `react-native-vector-icons`, `react-native-gesture-handler` and
  `@react-native/new-app-screen` from the template were removed after confirming nothing imports
  them (verified with `npm ls`), so `package.json` reflects exactly what ships.

---

## Design decisions and trade-offs

| Decision | Why | Trade-off accepted |
|---|---|---|
| **Grouped navigation** — 4 tabs (Movies / TV / People / Watchlist), a shelf per list, plus a See All grid per category | 9 lists in one scrolling screen would be unusable; grouping keeps every list a real destination | Slightly more navigation depth |
| **Native splash instead of `react-native-bootsplash`** | The brief only requires a splash screen; an Android launch theme achieves it with zero extra native dependencies and no risk of a New-Architecture incompatibility | Android-only splash (no iOS storyboard asset) |
| **Text-glyph icons instead of `react-native-vector-icons`** | That package needs an extra Gradle font-linking step and is deprecated in favour of per-family packages — an avoidable native failure point for a 2-day build | Icons are emoji/glyphs, not a bespoke icon font |
| **RN `Image` instead of `react-native-fast-image`** | Android's Fresco decoder already caches remote images; `fast-image` adds a native module that has historically lagged behind New Architecture releases | No disk-cache tuning knobs |
| **AsyncStorage + a small custom persistence hook instead of `redux-persist`** | One less library, and the flush/guard logic is ~40 readable lines in `useWatchlistPersistence.ts` | No versioned migrations |
| **`react-native-dotenv` instead of `react-native-config`** | Build-time inlining needs no native changes; fewer moving parts for a reviewer to reproduce | Env values are baked in at bundle time, so `.env` changes require a cache reset |
| **`immer`/ESM fix in Jest config rather than downgrading Redux Toolkit** | Root-cause fix, keeps modern dependencies | One extra config line to explain (it is commented) |
| **Dark "cinema" palette (near-black + amber)** | Posters are the content; a dark canvas makes them pop and avoids the generic purple SaaS look | Not optimised for light mode |

---

## Known issues / limitations

1. **iOS is unverified.** The codebase is platform-agnostic and `ios/` is intact, but it was only
   built and run on Android (the brief allows `Android Studio`, and this was developed on Windows).
2. **`.env` is required.** A fresh clone without `.env` will start, but every request fails — by
   design the app then shows an explicit error state with a Retry action rather than crashing.
3. **Search only reaches the first few result pages.** `/search/multi` paginates, and the grid
   loads further pages on scroll; TMDB caps deep pagination at page 500.
4. **No trailer playback.** `GET /movie/{id}/videos` is wired into the API layer but the detail
   screen does not render a player (out of the brief's scope; the watchlist/rating requirement was
   prioritised instead).
5. **Rating is 1–5 stars, local only.** Star ratings are device-local; nothing is posted back to
   TMDB, which has no write API for user ratings on this plan.
6. **The pull-to-refresh spinner on the two shelf tabs is time-based** (~800 ms). Each shelf
   refetches independently, so there is no single promise to await; the data always refreshes, the
   timer only governs the spinner. On single-list screens the spinner is tied to real fetch state.
7. **No interactive run was performed on this machine.** The build box has no Android Emulator
   hypervisor driver (`emulator -accel-check` reports it as missing), so the AVD never finishes
   booting — it stalls at `offline` indefinitely. Verification was therefore done through a full
   Gradle build plus a production JS bundle instead. To review the app interactively, run
   `npm run android` on a physical device (USB debugging) or on a machine with virtualization
   enabled.




