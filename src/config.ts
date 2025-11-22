import Constants from "expo-constants";

// Single source of truth.
// No localhost fallback — because it masks real config problems.
export const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE ||
  (Constants.expoConfig?.extra?.API_BASE as string | undefined);

if (!API_BASE) {
  console.error(
    "❌ API_BASE is undefined! Add EXPO_PUBLIC_API_BASE in .env or extra.API_BASE in app.config.ts"
  );
} else {
  console.log("🔧 Loaded API_BASE from config.ts:", API_BASE);
}
