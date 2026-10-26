# NestMate NL

A free home manual for first-time renters, students and expats in the Netherlands. No ads, no subscriptions, no account.

Built with Expo (SDK 58), Expo Router and TypeScript for iOS, Android and web.

## What's in Phase 1

| Area | Status |
| --- | --- |
| Onboarding: postcode lookup (PDOK), heating type, energy contract | Working |
| Home: "Something broke?", energy tip, today's cleaning | Working |
| Cleaning calendar: regular and deep cleaning routines with reminders | Working (reminders on iOS/Android only) |
| Fix-It guides: 3 starter guides with steps and shopping list | Working, illustrations to do |
| Something Broke flow: safety check → DIY guide or landlord | Working, landlord letter draft to do |
| Energy: cheap hours by contract and province | Working, public holidays to do |
| My Area: contacts and official links | Partly, waste rules per city to do |
| Where to Buy: Dutch names and shop types | Partly, OpenStreetMap shop map to do |

Search the code for `TODO` to find the next tasks.

## Run it

```bash
npm install
npx expo start
```

Then press `i` (iOS simulator), `a` (Android emulator) or `w` (web), or scan the QR code with Expo Go.

Before committing:

```bash
npx tsc --noEmit
npx expo lint
```

## Project layout

```
src/
  app/                 Routes (Expo Router). Every file is a screen.
    (tabs)/            Home, Guides, Cleaning, Energy, My Area
    onboarding.tsx     Postcode → heating → contract
    broke.tsx          Something Broke flow (modal)
    cleaning-new.tsx   Add a cleaning routine (modal)
    guide/[id].tsx     Step-by-step guide viewer
    buy.tsx            Where to Buy
  components/          Themed text, shared UI (Screen, Card, Button, OptionCard), tab bars
  constants/theme.ts   Colours, fonts, spacing (matches the Figma board)
  content/guides.ts    Guide content: original text, English + Dutch names
  lib/
    profile.tsx        Home profile, stored on the device (AsyncStorage)
    cleaning.tsx       Cleaning routines, stored on the device
    schedule.ts        Repeat rules (weekly, every 2 weeks, monthly, every 3 months…)
    reminders.ts       Local notifications for cleaning routines
    energy.ts          Dual-rate off-peak rules
    pdok.ts            PDOK Locatieserver postcode lookup
```

## How reminders work

Each upcoming cleaning date in the next 45 days is scheduled as a one-off local notification (max 60, under the iOS limit of 64). Reminders are re-synced when a routine is added, ticked off or deleted, and when the app starts. Nothing is sent to a server.

Local notifications work in Expo Go. Web has no reminders.

## Data and privacy

- Postcode lookup: [PDOK Locatieserver](https://api.pdok.nl/bzk/locatieserver/search/v3_1/ui/) (Kadaster open data). This is the only network request.
- Everything else (profile, routines) stays on the phone.
- Map data, when added: © OpenStreetMap contributors (ODbL).

## Disclaimer

NestMate NL gives general information about renting in the Netherlands. It is not legal, technical or financial advice. Your rental contract comes first. Never work on gas or mains electricity yourself. In an emergency, call 112.
