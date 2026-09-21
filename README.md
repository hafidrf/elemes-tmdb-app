# CineCatalog

A TMDB browser built with React Native CLI for the App Developer test at Elemes Group.

Four tabs: Movies, TV Shows, People, Watchlist. All nine lists from the brief are in there,
plus search, a watchlist and a star rating that survive an app restart.

**Catatan singkat (ID):** app ini React Native CLI, bukan Expo. Semua 9 daftar dari soal
dipakai, bukan cuma 4. Ada splash screen native, skeleton loading di tiap layar, search dengan
debounce, watchlist dan rating yang disimpan di perangkat. Cara jalaninnya di bagian
"Running it" di bawah.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React Native CLI 0.85.2 (not Expo), New Architecture on |
| Language | TypeScript, strict |
| State | Redux Toolkit + RTK Query |
| Navigation | React Navigation 7 — native stack plus bottom tabs |
| Storage | AsyncStorage (watchlist and ratings) |
| Images | `@d11/react-native-fast-image` — the maintained, Fabric-ready fast-image fork |
| Icons | `@react-native-vector-icons/ionicons` |
| Styling | `StyleSheet` API, every value from the tokens in `src/shared/theme` |
| Testing | Jest + React Native Testing Library |
| Lint / format | ESLint (`@react-native/eslint-config`) + Prettier |
| Env | `react-native-dotenv` |

## Requirement coverage

Every item from the brief, and where it lives.

| # | Requirement | Where it is satisfied |
|---|---|---|
| 1 | Movies & TV Shows theme | the whole app, fed by TMDB through `src/shared/api/tmdbApi.ts` |
| 2 | At least 4 of the 9 lists (more is better) | **all 9**, declared once in `src/features/catalog/catalogConfig.ts`, breakdown below |
| 3 | Splash screen | `SplashTheme` in `android/app/src/main/res/values/styles.xml`, swapped for `AppTheme` in `MainActivity.onCreate` |
| 4 | Loading state while data is fetched | `Skeleton` placeholders on every screen, `ActivityIndicator` while paging, `StateView` for the error and empty cases |
| 5 | Attractive UI/UX | the token system in `src/shared/theme` — see Design |
| 6 | Search (bonus) | `SearchScreen` over `/search/multi`, 400 ms debounce |
| 7 | Rating or watchlist | **both** — `StarRating` and the watchlist, persisted in AsyncStorage |
| 8 | GitHub docs for installing and running | this README: Tech stack, Running it, Code layout, Known gaps |
| 9 | Repo link sent to tommy@elemes.id | lives outside the repo — this is the link to send: https://github.com/hafidrf/elemes-tmdb-app |
| 10 | Version control | conventional commits on `main`, not one "final code" commit |
| 11 | Framework is free (RN / Kotlin / Android Studio) | React Native CLI — see Tech stack |

## Screenshots

Live captures from the release build on a physical phone (Infinix X6855, Android 16), not an
emulator and not a mockup.

| Movies | TV Shows | People |
|---|---|---|
| ![Movies](docs/screenshots/01-movies.jpg) | ![TV Shows](docs/screenshots/02-tv-shows.jpg) | ![People](docs/screenshots/03-people.jpg) |

| Movie detail | Search | Watchlist |
|---|---|---|
| ![Movie detail](docs/screenshots/04-movie-detail.jpg) | ![Search](docs/screenshots/05-search.jpg) | ![Watchlist](docs/screenshots/06-watchlist.jpg) |

![See All grid](docs/screenshots/07-category-list.jpg)

The watchlist shot was taken after a force-stop and relaunch, so those two titles and the 4 star
rating came back from AsyncStorage rather than from memory.

## Running it

You'll need Node 22+, JDK 17, and the Android SDK with `ANDROID_HOME` pointing at it.

```bash
git clone https://github.com/hafidrf/elemes-tmdb-app.git
cd elemes-tmdb-app
npm install
cp .env.example .env      # Windows: Copy-Item .env.example .env
npm start                 # terminal 1
npm run android           # terminal 2
```

On iOS the native modules come from CocoaPods, so run `cd ios && pod install` once after
`npm install`. The iOS half is otherwise untested — see Known gaps.

### Setting up .env

Get a key at https://www.themoviedb.org/settings/api. Either kind works:

- **API Read Access Token (v4)** - the long string starting with `eyJ`
- **API Key (v3)** - the 32 character hex string

Fill in `.env`:

```ini
TMDB_READ_ACCESS_TOKEN=eyJ...
TMDB_API_KEY=
```

`.env` is git-ignored, so the key doesn't end up in the repo. The v4 token is sent as
`Authorization: Bearer ...`. If only the v3 key is set, the requests fall back to the `api_key`
query param instead, that check is in `src/shared/api/tmdbApi.ts`.

Values are inlined at build time, so if you change `.env` while Metro is running you need
`npm start -- --reset-cache`.

### Building it by hand

If `npm run android` doesn't pick up your device:

```bash
cd android
./gradlew assembleDebug        # Windows: gradlew.bat assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.elemestmdbapp/.MainActivity
```

A debug build still needs Metro running in a second terminal, since that is where the JS comes from.
If Metro won't start, build the release variant instead. The JS is bundled into it, so the app runs
on its own:

```bash
cd android
./gradlew assembleRelease      # Windows: gradlew.bat assembleRelease
adb install -r app/build/outputs/apk/release/app-release.apk
adb shell am start -n com.elemestmdbapp/.MainActivity
```

### Scripts

| Command | Does |
|---|---|
| `npm start` | Metro |
| `npm run android` | build, install, launch |
| `npm test` | Jest |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | type check |

## Where the nine lists ended up

The brief asks for at least four of these. All nine are in the app. Movies and TV show them as
horizontal shelves, each with a See all button that opens a full paginated grid. People is a grid.

| # | List | Endpoint | Screen |
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

All of it comes from the one array in `src/features/catalog/catalogConfig.ts`, so the tabs, the
See all grids and this table can't drift apart.

The other things the brief asks for:

- **Splash screen.** Native Android launch theme. `SplashTheme` in `values/styles.xml` is swapped
  for the real theme in `MainActivity.onCreate`. No splash library.
- **Loading state.** Skeleton placeholders shaped like the real cards on first load, plus a small
  spinner at the bottom of the list when paging.
- **Search (bonus).** `/search/multi` behind a 400 ms debounce, so one bar covers movies, TV and
  people.
- **Rating or watchlist.** Both. The watchlist lives in AsyncStorage and the star rating is stored
  alongside it.
- **Error and empty states.** One `StateView` component. The error state always has a Retry
  button, so a failed request never leaves a blank screen.
- Also: pull to refresh, infinite scroll, and an offline banner.

## Design

Dark, cinematic and content first: the posters supply the colour and the chrome stays quiet. The
tokens live in `src/shared/theme/` and every screen draws from them.

- **Colour.** A Material 3 dark scheme seeded on a warm amber, with six tonal surface steps instead
  of flat black, a cool secondary so the palette is not one hue, and container colours for the
  states that need a filled surface.
- **Type.** One scale in `typography.ts`, from `display` down to a `caps` run for meta rows. Large
  text carries negative tracking and small text positive, which is what keeps a bigger size from
  just looking bigger.
- **Shape and space.** A 4pt spacing scale and a Material 3 radius scale (8/12/16/20/28). Posters
  are 16, chips 8, buttons and pills fully round.
- **Icons.** One family (Ionicons, outline cut) behind `AppIcon`. The first build used text glyphs,
  which render as colour emoji on Android and made the tab bar look like a mock-up.
- **Depth.** `Scrim` is a stack of thin bands whose opacity follows a curve, which the eye reads as
  a gradient. It fades poster artwork into the page and darkens the backdrop behind the top bar.
- **Motion.** A tap answers with a small spring through `PressableScale`, and the stack animates
  sideways instead of using the platform default.
- **Chrome.** The tab bar follows the Material 3 navigation bar: a tonal pill behind the active
  icon, with the bottom inset counted in so it still clears a gesture bar.

## Code layout

```
src/
  app/          navigation and the redux store
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

`shared/` never imports from `features/`. That's why `PersonCard` and the category types live in
`shared/` even though a person looks like it belongs to a feature.

**Where this differs from the layout the brief suggested.** The example put `screens/`, `api/`,
`navigation/`, `hooks/`, `components/` and `types/` at the top of `src/`, with `features/` holding
only slices and feature-local components. Two things moved, one stayed:

- **Screens live inside their feature, not in a top-level `screens/`.** `MovieDetailScreen` sits in
  `detail/`, `SearchScreen` in `search/`. A top-level `screens/` becomes a second, parallel index of
  the app that has to be kept in step with `features/` by hand; keeping a screen beside the hooks
  and components it actually uses means a rename touches one folder.
- **`api/`, `navigation/`, `components/`, `theme/`, `types/`, `utils/` and `hooks/` sit under
  `shared/` instead of at the top of `src/`.** That gives the boundary above an address. Everything
  under `shared/` must stay free of `features/` imports, and making the two folders siblings is what
  turns that rule into something you can check by looking rather than by remembering.
- **`constants/` did stay at the top level**, as suggested. Nothing in it is UI, and both `shared/`
  and `features/` read it, so it belongs to neither.

## How the TMDB data is handled

- One RTK Query API in `src/shared/api/tmdbApi.ts`, 11 endpoints. No component calls fetch
  directly, so caching and refetching come from RTK Query.
- Responses are tagged `Movies`, `TV` and `People`. `/search/multi` provides all three, because one
  request does cover all three. There is deliberately no `Watchlist` tag: the watchlist is local
  slice state, so a save has no server cache entry to invalidate. Nothing here declares
  `invalidatesTags` either, for the same reason — this API ships no mutations.
- TMDB says `title` for movies and `name` for TV, `release_date` against `first_air_date`, and
  hands back null poster paths more often than you'd expect. All of that gets flattened into one
  `MediaSummary` in `src/shared/utils/formatters.ts`, which is why `MediaCard` is a dumb component.
- Paging sits in `useMediaList` and `usePeopleList`. They append pages, skip ids they already have,
  and drop a response that lands for a page you've already scrolled past.
- Credentials get read once, in `src/constants/config.ts`. Everything else imports the plain
  constants from `src/constants/tmdb.ts`, which keeps the tests independent of `.env`.

## Tests

```bash
npm test          # 49 tests in 5 suites
npm run lint      # eslint, no errors or warnings
npx tsc --noEmit  # no type errors
```

Covered: the formatters (including the null and empty cases TMDB really returns), image url
building, the watchlist slice (add, toggle, remove, de-dupe, rating clamping), and component tests
for the card and the star rating.

No test touches `@env`, so the suite passes on a clone with no `.env`. `jest.config.js` widens
`transformIgnorePatterns` because Redux Toolkit and the icon package both ship untranspiled source,
and maps `.ttf` to a stub in `__mocks__/fontMock.js` because Jest cannot parse a font file, and maps
FastImage to `__mocks__/fastImageMock.js` so a native view never has to resolve.

## Notes

- **Splash is native, not bootsplash.** The brief asks for a splash screen; an Android launch theme
  gives you one with no extra native dependency.
- **Ionicons for the icon set.** One family with an outline cut, autolinked on Android so there is no
  manual font-linking step. The earlier build used text glyphs, which fall back to colour emoji.
- **`@d11/react-native-fast-image`, not the original fast-image.** The stack list names
  react-native-fast-image, but upstream has not shipped since 2021 and carries no Fabric support, so
  it does not build against React Native 0.85 with the New Architecture on. The `@d11` fork is the
  maintained one and declares the codegen config Fabric and TurboModules need. Both places that load
  artwork sit behind one wrapper each — `PosterImage` for posters, `BackdropHeader` for the still —
  so swapping the library again is a two-file change.
- **AsyncStorage plus a small hook, not redux-persist.** The flush logic is 40 lines in
  `useWatchlistPersistence.ts`, and the `hydrated` flag in the slice stops the first render from
  writing an empty list over what was saved.
- **List performance is decided per list, not copied around.** The horizontal shelves pass
  `getItemLayout`: every card is `posterCardWidth` wide behind a fixed gap, so an index offset is
  arithmetic rather than a measurement. The two-column grids cannot. A poster title can wrap to two
  lines while a person's name does not, and the See All grid mixes both kinds in one column, so any
  computed row height would be wrong and the list would scroll to the wrong row. Those grids take
  `initialNumToRender`, `maxToRenderPerBatch`, `windowSize` and `removeClippedSubviews` instead,
  which is what actually shows up while paging. The shelves skip `removeClippedSubviews` on purpose:
  they already sit inside a `ScrollView`, and clipping a horizontal list nested in a vertical one is
  a known way to end up with blank posters.
- **react-native-dotenv, not react-native-config.** Build-time inlining, no native changes.
- **The navigator header is off in the tabs.** Each tab draws its own title, otherwise the same
  word shows up twice on screen.
- **Every screen pads for the status bar itself.** Android 15 and newer always draw edge to edge, so
  a tab screen with the navigator header off would otherwise slide under the clock. `ScreenHeader`
  reads `useSafeAreaInsets` for the top gap, the detail screens use the same hook under the floating
  back button, and the See All screen gets it from its native header.
- **`metro.config.js` keeps native build output out of Metro's crawl.** Gradle writes into
  `node_modules/*/android/build` and `android/.cxx`, and rewrites those trees while it runs. Metro
  crawls `node_modules` by default, so it would index all of that. Nothing under those paths is ever
  bundled as JS.

## Known gaps

1. **iOS is untested.** The code is platform agnostic and `ios/` is intact, but it was built and
   run on Android only. The brief allows Android Studio, and this was done on Windows.
2. **Metro's dev server would not start on the machine this was built on.** Metro 0.84.6 on Windows
   without watchman dies with `Failed to get the SHA-1 for: .../metro-runtime/src/polyfills/require.js`.
   `react-native bundle`, `gradlew assembleDebug` and `gradlew assembleRelease` all work, which is why
   the app was verified through the release build. Installing watchman should clear it, and the tests,
   lint and type check are unaffected either way.
3. **Search stops at TMDB's page limit.** The grid loads more as you scroll, but `/search/multi`
   caps out at page 500.
4. **No trailer playback.** `GET /movie/{id}/videos` is wired into the API layer but nothing plays
   it. The watchlist and rating requirement got the time instead.
5. **The pull-to-refresh spinner on the two shelf tabs runs on a ~800 ms timer.** Each shelf
   refetches on its own, so there's no single promise to await. The data does refresh, the timer
   only drives the spinner. The single-list screens use real fetch state.
6. **`.env` is required.** Without it the app still starts, every request fails, and you land on the
   error state with a Retry button instead of a crash.

### How it was verified live

Built and installed over wireless ADB onto a physical phone: Infinix X6855, Android 16 (API 36),
arm64-v8a. On the device:

- all four tabs, with the Movies and TV Shows shelves filled from real TMDB data
- a movie detail screen, including Add to Watchlist and the 5 star rating
- a search for "batman" returning mixed results from `/search/multi`
- the See All grid, opened from a shelf
- the watchlist still holding both titles and the 4 star rating after a force-stop and relaunch

`gradlew assembleDebug` and `gradlew assembleRelease` both completed, and the tests, lint and type
checks above are green.


