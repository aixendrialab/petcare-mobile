import React, { useEffect, useState } from 'react';
import { Btn, Screen, Tabs } from '@/src/ui';
import { useLocalSearchParams, router } from 'expo-router';

import { completeConsult, loadConsultData, saveConsult, saveConsultDraft } from '../api';
import { PetSummaryCard } from '../components/PetSummaryCard';
import { PrescriptionCard } from '../components/PrescriptionCard';
import { CurrentVisitCard } from '../components/CurrentVisitCard';
import { HistoryCard } from '../components/HistoryCard';
import { VaccinationCard } from '../components/VaccinationCard';
import { AttachmentsCard } from '../components/AttachmentsCard';
import { PetSummary, VaccineStatus, VisitHistory } from '../types';
import { View } from 'react-native';


export function ConsultScreen() {
  const { appointment_id, pet_id } = useLocalSearchParams();

const [pet, setPet] = useState<PetSummary | null>(null);
const [history, setHistory] = useState<VisitHistory[]>([]);
const [vaccines, setVaccines] = useState<VaccineStatus[]>([]);


  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [meds, setMeds] = useState([{ name: '', dose: '', freq: '', days: '' }]);

useEffect(() => {
  (async () => {
    const data = await loadConsultData(Number(appointment_id), Number(pet_id));

    setPet(data.pet);
    setHistory(data.history);
    setVaccines(data.vaccines);

    // 🔥 Load draft if exists
    if (data.draft) {
      setSymptoms(data.draft.symptoms || "");
      setDiagnosis(data.draft.diagnosis || "");
      setNotes(data.draft.notes || "");
      setMeds(data.draft.medicines || [{ name: "", dose: "", freq: "", days: "" }]);
    }
  })();
}, [appointment_id, pet_id]);

/*
  async function onSave() {
    await saveConsult({
      appointment_id: Number(appointment_id),
      pet_id: Number(pet_id),
      symptoms,
      diagnosis,
      notes,
      medicines: meds,
      attachments: [],
    });
    alert('Consult saved');
    router.back();
  }*/

  async function onSave() {
  await saveConsultDraft({
    appointment_id: Number(appointment_id),
    pet_id: Number(pet_id),
    symptoms,
    diagnosis,
    notes,
    medicines: meds,
    attachments: [],
  });
  alert("Draft saved");
}

async function onComplete() {
  await completeConsult({
    appointment_id: Number(appointment_id),
    pet_id: Number(pet_id),
    symptoms,
    diagnosis,
    notes,
    medicines: meds,
    attachments: []
  });
  alert("Consultation completed");
  router.replace("/vet/schedule");
}


  return (
    <Screen
      title="Consultation"
      subtitle="Vet medical notes, prescription & visit completion"
      onBack={() => router.back()}
      footer={
  <>
    <Btn title="Save Draft" onPress={onSave} />
    <View style={{ height: 10 }} />
    <Btn title="Complete Visit" variant="primary" onPress={onComplete} />
  </>
}

    >
      {pet && <PetSummaryCard pet={pet} />}

      <Tabs tabs={['History', 'Vaccines', 'Attachments']}>
        {{
          History: <HistoryCard items={history} />,
          Vaccines: <VaccinationCard items={vaccines} />,
          Attachments: <AttachmentsCard />,
        }}
      </Tabs>

      <CurrentVisitCard
        symptoms={symptoms}
        diagnosis={diagnosis}
        notes={notes}
        setSymptoms={setSymptoms}
        setDiagnosis={setDiagnosis}
        setNotes={setNotes}
      />

      <PrescriptionCard meds={meds} setMeds={setMeds} />
    </Screen>
  );
}
