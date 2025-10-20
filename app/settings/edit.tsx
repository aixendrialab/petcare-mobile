// app/settings/edit.tsx
import { useAuth } from '@/src/auth';
import ParentProfile from '@/app/parent/profile';
import VetProfile from '@/app/vet/profile';
import { Screen } from '@/src/ui';

export default function SettingsEdit() {
  const { active } = useAuth();
  const role = active?.role ?? 'parent';

  // walker uses parent profile UI for now
  const isVet = role === 'vet';

  return (
    <Screen title="Edit Profile" subtitle={role}>
      {isVet ? <VetProfile mode="edit" /> : <ParentProfile mode="edit" />}
    </Screen>
  );
}
