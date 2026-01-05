export type ProviderRole = "vet" | "pharmacy" | "vendor" | "hostel" | "nutritionist";

export type ProviderStatus = "DRAFT" | "ACTIVE" | "SUSPENDED" | "PENDING";

export interface ProviderProfile {
  id: number;
  role: ProviderRole;
  display_name: string;
  phone?: string;
  email?: string;

  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  pincode?: string;

  license_no?: string;        // for PHARMACY
  license_valid_till?: string; // ISO date
  status: ProviderStatus;
}
