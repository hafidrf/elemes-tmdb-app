# CineCatalog

**Ready to run.** A TMDB browser built with React Native CLI (not Expo) for the App Developer test at
Elemes Group — plus an Android demo anyone can install in under a minute.

[![Download CineCatalog-demo.apk](https://img.shields.io/badge/Download_CineCatalog--demo.apk-73.8_MB-2ea043?style=for-the-badge&logo=android&logoColor=white)](https://github.com/hafidrf/elemes-tmdb-app/releases/download/demo-v1.0/CineCatalog-demo.apk)
[![Release](https://img.shields.io/badge/Release-demo--v1.0-0969da?style=for-the-badge&logo=github&logoColor=white)](https://github.com/hafidrf/elemes-tmdb-app/releases/tag/demo-v1.0)
[![Tests](https://img.shields.io/badge/tests-53_passing-2ea043?style=for-the-badge&logo=jest&logoColor=white)](#tests)
[![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://github.com/hafidrf/elemes-tmdb-app/blob/main/tsconfig.json)

**Jump to:** [Install the APK](#install-the-apk-no-build) · [Screenshots](#screenshots) ·
[The nine lists](#the-nine-lists) · [Running it from source](#running-it) · [Code layout](#code-layout) ·
[Tests](#tests)

Four tabs (Movies, TV Shows, People, Watchlist) with all nine lists from the brief, plus search, a
watchlist and a star rating that survive an app restart.

## Install the APK (no build)

Three steps, no toolchain:

1. **[Download `CineCatalog-demo.apk`](https://github.com/hafidrf/elemes-tmdb-app/releases/download/demo-v1.0/CineCatalog-demo.apk)**
   — 73.8 MB, universal, runs on phones and emulators. The same file is on the repository page under
   **Releases → `demo-v1.0` → Assets**.
2. Open the downloaded file on the phone and tap **Install**. Android may ask you to allow installs
   from this source. The APK is signed with the standard Android Studio debug keystore, so Play
   Protect can show an "unknown app" notice — expected, it is not a Play Store build.
3. Open **CineCatalog**. No Node, JDK or Android SDK, and no TMDB sign-up: this branch ships a
   filled-in `.env`, which is the only difference from the clean branch.

<details>
<summary>Verify the download (SHA-256)</summary>

```text
B32E43F83135A0247156C0CA268B217F96E18CF96B2C496A8E17DD7C3C4ABB7B
```

`certutil -hashfile CineCatalog-demo.apk SHA256` on Windows; `shasum -a 256 CineCatalog-demo.apk`
on macOS and Linux.
</details>

> **Which branch to assess.** **`main` is the clean branch** and the one to assess: same app, without
> the credential. `demo-with-api-key`, the branch you are reading, is `main` plus the filled-in
> `.env` that makes the APK above run out of the box. That credential is rotated once the
> recruitment process is over.

## Screenshots

Live captures from the release build on a physical phone (Infinix X6855, Android 16).

| Movies | TV Shows | People |
|---|---|---|
| ![Movies](docs/screenshots/01-movies.jpg) | ![TV Shows](docs/screenshots/02-tv-shows.jpg) | ![People](docs/screenshots/03-people.jpg) |

| Movie detail | Search | Watchlist |
|---|---|---|
| ![Movie detail](docs/screenshots/04-movie-detail.jpg) | ![Search](docs/screenshots/05-search.jpg) | ![Watchlist](docs/screenshots/06-watchlist.jpg) |

![See All grid](docs/screenshots/07-category-list.jpg)

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React Native CLI 0.85.2 (not Expo), New Architecture on |
| Language | TypeScript, strict |
| State | Redux Toolkit + RTK Query |
| Navigation | React Navigation 7, native stack plus bottom tabs |
| Storage | AsyncStorage, for the watchlist and the ratings |
| Images | `@d11/react-native-fast-image`, the Fabric-ready fast-image fork |
| Icons | `@react-native-vector-icons/ionicons` |
| Styling | `StyleSheet` API, every value from the tokens in `src/shared/theme` |
| Testing | Jest + React Native Testing Library |
| Lint / format | ESLint (`@react-native/eslint-config`) + Prettier |
| Env | `react-native-dotenv` |

## Running it

You need Node 22+, JDK 17, and the Android SDK with `ANDROID_HOME` pointing at it.

```bash
git clone https://github.com/hafidrf/elemes-tmdb-app.git
cd elemes-tmdb-app
npm install
cp .env.example .env      # Windows: Copy-Item .env.example .env
```

### Setting up .env

Get a key at https://www.themoviedb.org/settings/api. Either kind works: the v4 read access token
(the long `eyJ...` string) or the v3 32-character key.

```ini
TMDB_READ_ACCESS_TOKEN=eyJ...
TMDB_API_KEY=
```

`.env` is git-ignored, so the key never reaches the repo. The v4 token goes out as
`Authorization: Bearer ...`; if only the v3 key is set, requests fall back to the `api_key` query
param instead.

### Starting it

```bash
npm start                 # terminal 1: Metro
npm run android           # terminal 2: build, install, launch
```

Or skip the build entirely: [Install the APK (no build)](#install-the-apk-no-build) above covers the
prebuilt universal APK, credential already inlined.

Or build a standalone release APK, which does not need Metro at all:

```bash
cd android
./gradlew assembleRelease          # Windows: gradlew.bat assembleRelease
adb install -r app/build/outputs/apk/release/app-release.apk
adb shell am start -n com.elemestmdbapp/.MainActivity
```

On iOS the native modules come from CocoaPods, so run `cd ios && pod install` once after
`npm install`.

### Scripts

| Command | Does |
|---|---|
| `npm start` | Metro |
| `npm run android` | build, install, launch |
| `npm test` | Jest, 53 tests |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | type check |

## The nine lists

The brief asks for at least four of these. All nine are in the app. Movies and TV show them as
horizontal shelves, each with a See all button that opens a full paginated grid; People is a grid.

| # | List | Endpoint | Where |
|---|---|---|---|
| 1 | Top rated movies | `movie/top_rated` | Movies tab, shelf 2 |
| 2 | Upcoming movies | `movie/upcoming` | Movies tab, shelf 3 |
| 3 | Now playing movies | `movie/now_playing` | Movies tab, shelf 4 |
| 4 | Popular movies | `movie/popular` | Movies tab, shelf 1 |
| 5 | Popular TV shows | `tv/popular` | TV Shows tab, shelf 1 |
| 6 | Top rated TV shows | `tv/top_rated` | TV Shows tab, shelf 2 |
| 7 | On the air TV shows | `tv/on_the_air` | TV Shows tab, shelf 3 |
| 8 | Airing today TV shows | `tv/airing_today` | TV Shows tab, shelf 4 |
| 9 | Popular people | `person/popular` | People tab |

The rest of what the brief asks for:

- **Splash screen**: the launcher icon, the Android 12 system splash and the launch theme all draw the
  same mark on the same background, so nothing flashes between them, and they hand over to a branded
  three second splash in React that fades out once the first shelves have landed.
- **Loading state**: skeleton placeholders shaped like the real cards, plus a spinner while paging.
- **Search**: `/search/multi` behind a 400 ms debounce, so one bar covers movies, TV and people.
- **Rating and watchlist**: both, stored in AsyncStorage, reachable from every detail screen and
  from the Watchlist tab.
- **Error and empty states**: one `StateView`, always with a Retry button, never a blank screen.
- **Pull to refresh, infinite scroll**, and an offline banner.

## Code layout

```
src/
  app/          navigation and the redux store
  assets/       the splash mark, generated
  constants/    TMDB urls/sizes, plus the one file that reads @env
  features/
    catalog/    the nine lists, the shelves, the See all grids
    people/     popular people grid
    detail/     movie, TV and person detail screens
    search/     search screen
    watchlist/  slice, storage, watchlist screen
  shared/
    api/        RTK Query client
    components/ cards, skeletons, states, icons
    theme/      colours, type scale, layout numbers
    types/      TMDB response types and the shared view models
    utils/      formatters, image urls
```

`shared/` never imports from `features/`.

`tools/generate-splash-logo.ps1` draws the mark from exact geometry and writes every copy of it: the
Android splash vector, the PNG the React splash uses, the adaptive launcher icon, the legacy launcher
PNGs at five densities and the Android 12 system splash icon, so none of them can drift apart.

## Tests

```bash
npm test          # 53 tests in 6 suites
npm run lint      # eslint, no errors or warnings
npx tsc --noEmit  # no type errors
```

