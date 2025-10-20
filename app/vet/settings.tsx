import React from 'react';
import { Screen, Card, CardContent, Btn } from '@/src/ui';
import { useAuth } from '@/src/auth';
import { Href, Link, useRouter } from 'expo-router';

export default function VetSettings() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <Screen title="Settings">
      {/* profile */}
      <Card>
        <CardContent>
          <Link href="/vet/profile?mode=edit" asChild>
            <Btn title="Edit Profile" />
          </Link>
        </CardContent>
      </Card>

      {/* slots management for vets */}
      <Card>
        <CardContent>
          <Btn
            title="Slot Settings"
            onPress={() => router.push('/slots/settings' as Href)}
          />
        </CardContent>
      </Card>

      {/* account */}
      <Card>
        <CardContent>
          <Btn title="Log out" onPress={logout} />
        </CardContent>
      </Card>
    </Screen>
  );
}
