import React from 'react';
import { Card, Link, Text } from '@/src/ui';
import { PastConsultSummary } from '../types';

interface Props {
    history: PastConsultSummary[];
}

export function HistoryTab({ history }: Props) {
    return (
        <>
            {history.map((item) => (
                <Link
                    href={`/vet/past-consult?consult_id=${item.id}`}
                    asChild
                >
                    <Card key={item.id} title={item.date}>
                        <Text>Reason: {item.reason}</Text>
                        {item.diagnosis && <Text>Diagnosis: {item.diagnosis}</Text>}
                        <Text>Medications: {item.medicationsCount}</Text>
                    </Card>
                </Link>
            ))}
        </>
    );
}
