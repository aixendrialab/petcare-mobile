// app/_layout.tsx
import React from "react";
import { Pressable, Text, View } from "react-native";
import { Stack, usePathname, Link, Redirect } from "expo-router";
import { AuthProvider, useAuth } from "@/src/auth";
import RoleSwitcherButton from "@/src/components/RoleSwitcherButton";

function Gate({ children }: { children: React.ReactNode }) {
  const { state } = useAuth();
  const pathname = usePathname() || "";
  const top = pathname.split("/")[1] || ""; // '', 'auth', 'who-am-i', '<role>'

  // Decide redirect target (if any) WITHOUT calling router.replace()
  let redirectTo: string | null = null;

  // 1) Guests can only be on /auth/*
  if (state.status === "guest") {
    if (top !== "auth") redirectTo = "/auth/login";
  }

  // 2) Authed but no active role → must pick one
  const activeRole = state.active?.role;
  if (!redirectTo && state.status === "authed" && !activeRole) {
    if (top !== "who-am-i") redirectTo = "/who-am-i";
  }

  // 3) Profile complete → if sitting on /auth, /who-am-i or root, send to home
  if (!redirectTo && state.status === "authed" && activeRole) {
    if (top === "auth" || top === "who-am-i" || top === "") {
      const target = `/${activeRole}/home`;
      if (pathname !== target) redirectTo = target;
    }
  }

  return (
    <>
      {children}
      {redirectTo ? <Redirect href={redirectTo as any} /> : null}
    </>
  );
}

function HeaderRight() {
  const { state, logout } = useAuth();

  if (state.status !== "authed") return null;

  const activeRole = state.active?.role;
  const inFunnel = !activeRole;

  if (inFunnel) {
    return (
      <Pressable
        onPress={logout}
        hitSlop={10}
        accessibilityLabel="Log out"
        style={{ paddingHorizontal: 12 }}
      >
        <Text style={{ fontSize: 16 }}>Logout</Text>
      </Pressable>
    );
  }

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <RoleSwitcherButton />
      <Link href="/settings" asChild>
        <Pressable
          hitSlop={10}
          accessibilityLabel="Open settings"
          style={{ paddingHorizontal: 12 }}
        >
          <Text style={{ fontSize: 18 }}>⚙️</Text>
        </Pressable>
      </Link>
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Gate>
        <Stack
          screenOptions={{
            headerTitle: "PetCare",
            headerRight: () => <HeaderRight />,
          }}
        />
      </Gate>
    </AuthProvider>
  );
}
