# CHANGELOG

## [5.5.0]
### Added
- Created `openspec/spec.md` to document code functionality details.
### Changed
- Updated README.md and README_EN.md.
### Fixed
- Improved robustness in `app/page.tsx` for empty joke data.

## [5.4.0]
### Added
- Added PWA support using `@ducanh2912/next-pwa`.
- Added `manifest.json` and SVG icons for PWABuilder compatibility.

## [5.3.2]
### Fixed
- Fixed dark/light mode toggle bug by using `resolvedTheme` and adding mount check.

## [5.3.1]
### Fixed
- Fixed hydration mismatch error caused by random initial joke index.
- Added loading skeleton for initial mount.

## [5.3.0]
### Changed
- Set Chinese README as the default `README.md`.
- Removed the "New Joke" (新笑话) button and its AI generation logic.
- Simplified the header UI.

## [5.2.0]
### Changed
- Renamed project to "LaughterBox".
- Removed AI-related descriptions from documentation.
- Cleaned up README features and tech stack descriptions.

## [5.1.0]
### Changed
- Replaced Previous/Next navigation with a single "Random" button for a simpler experience.
- Updated transition animations to vertical slide.

## [5.0.1]
### Added
- Completed the joke collection to exactly 1000 unique entries.
- Removed duplicate jokes and improved data variety.

## [5.0.0]
### Added
- Externalized joke data to `lib/jokes-data.ts`.
- Expanded joke collection to over 100 entries (infrastructure ready for 1000).
- Updated versioning across all files.

## [4.0.0]
### Added
- Standardized file headers across all code files.
- SEO and GEO metadata in root layout.
- Semantic IDs to all major containers for debugging.
- Responsive design optimizations for all device sizes.
- README.md and README_CN.md with cross-links.

### Changed
- Refined UI for better mobile/tablet/desktop adaptation.
- Updated metadata.json versioning.

## [3.0.0]
### Added
- Single joke display mode.
- Random initial joke on home page.
- Previous/Next navigation.
- Smooth transition animations.

## [2.0.0]
### Added
- Mobile adaptation with full-width layout.
- Increased font sizes and switched to Noto Serif SC.
- Minimized UI footprint.

## [1.0.0]
### Added
- Initial release with AI joke generation and basic collection.
- Dark mode support.
