
export interface RevenueRecord {
    id: number;
    bill_no: string | null;
    amount_received: number | null;
    amount_paid: number | null;
    amount_pending: number | null;
    description: string | null;
    payment_mode: string | null;
    payment_date: string | null;
    payment_status: string | null;
    tracking_id: string | null;
    flat_id: number | null;
    vendor_id: number | null;
    event_id: number | null;
    
    /** Optional Fiels */
    flat?: FlatRecord;
    vendor?: VendorRecord;
    event?: EventRecord;
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

export interface EventRecord {
    id: number;
    name: string;
    date: string;
}

export interface BaseTableProps {
    data: RevenueRecord[];
    accentColor: string;
    isAdding?: boolean;
    newRow?: Partial<RevenueRecord>;
    onNewRowChange?: (field: keyof RevenueRecord, value: string | number | null) => void;
    onDelete?: (id: number) => void;
    editingId?: number | null;
    editRow?: Partial<RevenueRecord> | null;
    onEditStart?: (row: RevenueRecord) => void;
    onEditChange?: (field: keyof RevenueRecord, value: string | number | null) => void;
    onUpdateSave?: () => void;
    onUpdateCancel?: () => void;
    onOpenPicker?: (field: 'flat_id' | 'vendor_id' | 'event_id') => void;

}

export interface LookupItem { id: number; name: string; info?: string; }
export interface LookupModalProps {
    type: 'flat_id' | 'vendor_id' | 'event_id';
    onSelect: (id: number) => void;
    onClose: () => void;
}