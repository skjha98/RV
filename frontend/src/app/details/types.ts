
export interface RevenueRecord {
    id: number;
    bill_no: string | null;
    received_amount: number | null;
    pending_amount: number | null;
    description: string | null;
    payment_mode: string | null;
    payment_date: string | null;
    payment_status: string | null;
    tracking_id: string | null;
    flat_id: number | null;
    vendor_id: number | null;
    occasion_id: number | null;
    
    /** Optional Fiels */
    flat?: FlatRecord;
    vendor?: VendorRecord;
    occasion?: OccasionRecord;
}

export interface FlatRecord {
    id: number;
    flat_number: string;
    owner_name: string | null;
    type: string;
    occupancy: string | null;
    mobile: number | null;
    email: string | null; 
}

export interface VendorRecord {
    id: number;
    name: string;
    mobile: number | null;
}

export interface OccasionRecord {
    id: number;
    name: string;
    date: string;
}