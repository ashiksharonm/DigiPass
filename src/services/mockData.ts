// Mock data for demo mode (works without Firebase)
export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    role: 'passenger' | 'conductor';
    photoUrl?: string;
    createdAt: string;
}

export interface BusPass {
    id: string;
    userId: string;
    passengerName: string;
    journeyFrom: string;
    journeyTo: string;
    busNo: string;
    passType: 'weekly' | 'monthly' | 'annual';
    amountPaid: number;
    balance: number;
    status: 'active' | 'expired' | 'pending';
    createdAt: string;
    expiresAt: string;
    qrData: string;
}

export interface TravelRecord {
    id: string;
    passId: string;
    userId: string;
    date: string;
    from: string;
    to: string;
    busNo: string;
    fare: number;
    verifiedBy?: string;
}

export interface BusRoute {
    id: string;
    routeNo: string;
    from: string;
    to: string;
    stops: string[];
    fare: number;
}

// Chennai bus routes for realistic data
export const ROUTES: BusRoute[] = [
    { id: '1', routeNo: '1C', from: 'T. Nagar', to: 'Parry\'s Corner', stops: ['T. Nagar', 'Nandanam', 'Guindy', 'Saidapet', 'Anna Salai', 'Parry\'s Corner'], fare: 12 },
    { id: '2', routeNo: '5C', from: 'Koyambedu', to: 'Broadway', stops: ['Koyambedu', 'Vadapalani', 'Ashok Nagar', 'T. Nagar', 'Teynampet', 'Broadway'], fare: 15 },
    { id: '3', routeNo: '17D', from: 'MGR Nagar', to: 'Nungambakkam', stops: ['MGR Nagar', 'Ashok Nagar', 'Kodambakkam', 'T. Nagar', 'Nungambakkam'], fare: 10 },
    { id: '4', routeNo: '21G', from: 'Tambaram', to: 'T. Nagar', stops: ['Tambaram', 'Chromepet', 'Pallavaram', 'Meenambakkam', 'Guindy', 'T. Nagar'], fare: 20 },
    { id: '5', routeNo: '27C', from: 'Adyar', to: 'Central', stops: ['Adyar', 'Besant Nagar', 'Mylapore', 'Triplicane', 'Central'], fare: 12 },
    { id: '6', routeNo: '29C', from: 'Sholinganallur', to: 'Broadway', stops: ['Sholinganallur', 'Thoraipakkam', 'Adyar', 'Mylapore', 'Broadway'], fare: 18 },
    { id: '7', routeNo: '47A', from: 'Thirumangalam', to: 'Mylapore', stops: ['Thirumangalam', 'Anna Nagar', 'Koyambedu', 'T. Nagar', 'Mylapore'], fare: 15 },
    { id: '8', routeNo: 'M70', from: 'Tambaram', to: 'Sholinganallur', stops: ['Tambaram', 'Velachery', 'Taramani', 'Perungudi', 'Sholinganallur'], fare: 22 },
];

export const PASS_PRICES = {
    weekly: { price: 150, label: 'Weekly Pass', days: 7 },
    monthly: { price: 500, label: 'Monthly Pass', days: 30 },
    annual: { price: 5000, label: 'Annual Pass', days: 365 },
};

// Demo users
export const DEMO_USERS: User[] = [
    {
        id: 'demo-passenger-1',
        name: 'Ashik Sharon',
        email: 'ashik@digipass.com',
        phone: '+91 98765 43210',
        address: 'T. Nagar, Chennai',
        gender: 'Male',
        role: 'passenger',
        createdAt: '2024-01-15',
    },
    {
        id: 'demo-conductor-1',
        name: 'Rajesh Kumar',
        email: 'conductor@digipass.com',
        phone: '+91 98765 43211',
        address: 'Anna Nagar, Chennai',
        gender: 'Male',
        role: 'conductor',
        createdAt: '2024-01-10',
    },
];

// Demo bus passes
export const DEMO_PASSES: BusPass[] = [
    {
        id: 'pass-1',
        userId: 'demo-passenger-1',
        passengerName: 'Ashik Sharon',
        journeyFrom: 'MGR Nagar',
        journeyTo: 'Nungambakkam',
        busNo: '17D',
        passType: 'monthly',
        amountPaid: 500,
        balance: 150.50,
        status: 'active',
        createdAt: '2024-02-01',
        expiresAt: '2024-03-01',
        qrData: 'DIGIPASS-PASS1-ASHIK-17D-MONTHLY-2024',
    },
];

// Demo travel records
export const DEMO_TRAVEL_RECORDS: TravelRecord[] = [
    { id: 'tr-1', passId: 'pass-1', userId: 'demo-passenger-1', date: '2024-02-14', from: 'MGR Nagar', to: 'Nungambakkam', busNo: '17D', fare: 9.50 },
    { id: 'tr-2', passId: 'pass-1', userId: 'demo-passenger-1', date: '2024-02-13', from: 'MGR Nagar', to: 'Nungambakkam', busNo: '17D', fare: 9.50 },
    { id: 'tr-3', passId: 'pass-1', userId: 'demo-passenger-1', date: '2024-02-12', from: 'T. Nagar', to: 'Koyambedu', busNo: '5C', fare: 12.00 },
    { id: 'tr-4', passId: 'pass-1', userId: 'demo-passenger-1', date: '2024-02-11', from: 'Adyar', to: 'Central', busNo: '27C', fare: 10.00 },
    { id: 'tr-5', passId: 'pass-1', userId: 'demo-passenger-1', date: '2024-02-10', from: 'MGR Nagar', to: 'Nungambakkam', busNo: '17D', fare: 9.50 },
    { id: 'tr-6', passId: 'pass-1', userId: 'demo-passenger-1', date: '2024-02-09', from: 'MGR Nagar', to: 'Nungambakkam', busNo: '17D', fare: 9.50 },
    { id: 'tr-7', passId: 'pass-1', userId: 'demo-passenger-1', date: '2024-02-08', from: 'Tambaram', to: 'T. Nagar', busNo: '21G', fare: 15.00 },
    { id: 'tr-8', passId: 'pass-1', userId: 'demo-passenger-1', date: '2024-02-07', from: 'MGR Nagar', to: 'Nungambakkam', busNo: '17D', fare: 9.50 },
];

// Generate mock travel analytics
export function getMonthlySpending(): { month: string; amount: number }[] {
    return [
        { month: 'Sep', amount: 320 },
        { month: 'Oct', amount: 450 },
        { month: 'Nov', amount: 380 },
        { month: 'Dec', amount: 290 },
        { month: 'Jan', amount: 510 },
        { month: 'Feb', amount: 185 },
    ];
}

export function getTopRoutes(): { route: string; trips: number }[] {
    return [
        { route: 'MGR Nagar → Nungambakkam', trips: 42 },
        { route: 'T. Nagar → Koyambedu', trips: 12 },
        { route: 'Adyar → Central', trips: 8 },
        { route: 'Tambaram → T. Nagar', trips: 5 },
    ];
}
