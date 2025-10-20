// app/settings/index.tsx
import React from 'react';
import { Redirect } from '@/src/ui';
import { useAuth } from '@/src/auth';
import { Screen, Card, CardContent, Btn, Link } from '@/src/ui';
import { Href } from 'expo-router';

export default function SettingsIndex() {
  const { active, logout } = useAuth();
  const role = (active?.role ?? '').toLowerCase();

  // Delegate to /{role}/settings if we know the role
  if (role) return <Redirect href={`/${role}/settings` as Href} />;

  // Fallback if role is unknown: keep a minimal settings shell
  return (
    <Screen title="Settings">
      <Card>
        <CardContent>
          <Link href="/settings/profile" asChild>
            <Btn title="Edit Profile" />
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Btn title="Log out" onPress={logout} />
        </CardContent>
      </Card>
    </Screen>
  );
}
