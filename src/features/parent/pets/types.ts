import { Sex } from "../../consult/types";

export interface PetSummary {
  id: number;
  name: string;

  species?: string; // optional – your schema may or may not have it
  breed?: string;

  sex: Sex;
  ageYears?: number;

  avatarUrl?: string;

  // Ownership
  ownerName: string;
  ownerPhone?: string;

  // Medical profile
  microchip?: string;
  blood_group?: string;

  allergies: string[]; // always normalized to array in mapper
  chronicConditions: string[]; // same

  behaviourNotes?: string;
  color_markings?: string;

  weight_kg?: number;
}

export type ParentPet = {
  id?: number;

  name: string;
  breed?: string;
  species?: string;
  dob?: string;

  gender?: '' | 'male' | 'female' | 'unknown';

  vaccine_status?: string;
  rewards?: string;

  picture_uri?: string;
  _local_uri?: string; // for preview

  microchip?: string;
  blood_group?: string;
  allergies?: string;
  chronic_conditions?: string;
  behavior_notes?: string;
  color_markings?: string;

  weight_kg?: number;
};

export type ParentPetsResponse = { pets: ParentPet[]; };

