import React from 'react';
import { Screen, Card, Btn } from '@/src/ui';
import { api } from '@/src/api';
import { router } from 'expo-router';

export default function UploadCatalog(){
  const upload=async()=>{
    await api.post('/catalog/upload', 'name,price\nOmega Chews,499\nJoint Support,699', { headers:{'Content-Type':'text/csv'} });
    alert('Catalog uploaded');
  };
  return (
    <Screen title="Vendor – Catalog Upload" onBack={()=>router.back()}>
      <Card title="Upload CSV">
        <Btn title="Upload sample CSV" onPress={upload} />
      </Card>
    </Screen>
  );
}
