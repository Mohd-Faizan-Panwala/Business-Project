export interface BusinessTimings {
  monday?: { closed?: boolean };
  tuesday?: { closed?: boolean };
  wednesday?: { closed?: boolean };
  thursday?: { closed?: boolean };
  friday?: { closed?: boolean };
  saturday?: { closed?: boolean };
  sunday?: { closed?: boolean };
}

export interface Business {
  _id: string;
  businessName: string;
  userId: string;
  category: { _id: string; name: string }; // Populated object
  subcategories: { _id: string; name: string }[]; // Populated objects
  ownerName: string;
  mobile: string;
  address: string;
  city: string;
  pincode: string;
  locationUrl?: string | null;
  description?: string;
  services: string[];
  images: string[];
  timings?: BusinessTimings;
  isPaid: boolean;
  paidAmount: number;
  paidDays: number;
  paidExpiry: string | null;
  status: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  holidays: [];
  createdAt: string;
  updatedAt: string;
}
