export interface NetworkProvider {
  id: string;
  name: string;
  code: string;
  logo?: string;
}

export interface DataBundle {
  id: string;
  name: string;
  amount: string;
  validity: string;
  networkCode: string;
}

export interface NetworkProvidersResponse {
  status: string;
  message: string;
  data: NetworkProvider[];
}

export interface DataBundlesResponse {
  status: string;
  message: string;
  data: DataBundle[];
}

export interface PurchaseAirtimeRequest {
  amount: string;
  phoneNumber: string;
  networkCode: string;
  pin: string;
  categoryId: string;
}

export interface PurchaseDataRequest {
  bundleId: string;
  phoneNumber: string;
  networkCode: string;
  pin: string;
  categoryId: string;
}

export interface PurchaseResponse {
  status: string;
  message: string;
  data: {
    transactionId: string;
    amount: string;
    phoneNumber: string;
    networkProvider: string;
    timestamp: string;
  };
}

interface ErrorResponse {
  status: string;
  message: string;
  data: {
    error: string;
  };
}

// Hardcoded network providers
const HARDCODED_PROVIDERS: NetworkProvider[] = [
  { id: "1", name: "MTN Nigeria", code: "MTN" },
  { id: "2", name: "Airtel Nigeria", code: "AIRTEL" },
  { id: "3", name: "Glo Mobile", code: "GLO" },
  { id: "4", name: "9mobile", code: "9MOBILE" },
];

// Hardcoded data bundles
const HARDCODED_BUNDLES: Record<string, DataBundle[]> = {
  MTN: [
    {
      id: "mtn_1",
      name: "1GB Daily",
      amount: "300",
      validity: "1 Day",
      networkCode: "MTN",
    },
    {
      id: "mtn_2",
      name: "2GB Weekly",
      amount: "500",
      validity: "7 Days",
      networkCode: "MTN",
    },
    {
      id: "mtn_3",
      name: "5GB Monthly",
      amount: "1500",
      validity: "30 Days",
      networkCode: "MTN",
    },
    {
      id: "mtn_4",
      name: "10GB Monthly",
      amount: "2500",
      validity: "30 Days",
      networkCode: "MTN",
    },
    {
      id: "mtn_5",
      name: "20GB Monthly",
      amount: "4000",
      validity: "30 Days",
      networkCode: "MTN",
    },
  ],
  AIRTEL: [
    {
      id: "airtel_1",
      name: "1.5GB Daily",
      amount: "300",
      validity: "1 Day",
      networkCode: "AIRTEL",
    },
    {
      id: "airtel_2",
      name: "3GB Weekly",
      amount: "500",
      validity: "7 Days",
      networkCode: "AIRTEL",
    },
    {
      id: "airtel_3",
      name: "6GB Monthly",
      amount: "1500",
      validity: "30 Days",
      networkCode: "AIRTEL",
    },
    {
      id: "airtel_4",
      name: "11GB Monthly",
      amount: "2500",
      validity: "30 Days",
      networkCode: "AIRTEL",
    },
    {
      id: "airtel_5",
      name: "25GB Monthly",
      amount: "5000",
      validity: "30 Days",
      networkCode: "AIRTEL",
    },
  ],
  GLO: [
    {
      id: "glo_1",
      name: "1GB Daily",
      amount: "250",
      validity: "1 Day",
      networkCode: "GLO",
    },
    {
      id: "glo_2",
      name: "2.5GB Weekly",
      amount: "500",
      validity: "7 Days",
      networkCode: "GLO",
    },
    {
      id: "glo_3",
      name: "5.8GB Monthly",
      amount: "1500",
      validity: "30 Days",
      networkCode: "GLO",
    },
    {
      id: "glo_4",
      name: "10GB Monthly",
      amount: "2500",
      validity: "30 Days",
      networkCode: "GLO",
    },
    {
      id: "glo_5",
      name: "22GB Monthly",
      amount: "4500",
      validity: "30 Days",
      networkCode: "GLO",
    },
  ],
  "9MOBILE": [
    {
      id: "9mobile_1",
      name: "1GB Daily",
      amount: "300",
      validity: "1 Day",
      networkCode: "9MOBILE",
    },
    {
      id: "9mobile_2",
      name: "2GB Weekly",
      amount: "500",
      validity: "7 Days",
      networkCode: "9MOBILE",
    },
    {
      id: "9mobile_3",
      name: "4.5GB Monthly",
      amount: "1500",
      validity: "30 Days",
      networkCode: "9MOBILE",
    },
    {
      id: "9mobile_4",
      name: "11GB Monthly",
      amount: "2500",
      validity: "30 Days",
      networkCode: "9MOBILE",
    },
    {
      id: "9mobile_5",
      name: "15GB Monthly",
      amount: "4000",
      validity: "30 Days",
      networkCode: "9MOBILE",
    },
  ],
};

export async function getNetworkProviders(): Promise<NetworkProvider[]> {
  // Return hardcoded data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(HARDCODED_PROVIDERS);
    }, 500); // Simulate network delay
  });
}

export async function getDataBundles(
  networkCode: string
): Promise<DataBundle[]> {
  // Return hardcoded data
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bundles = HARDCODED_BUNDLES[networkCode];
      if (bundles) {
        resolve(bundles);
      } else {
        reject(new Error("No bundles found for this network"));
      }
    }, 500); // Simulate network delay
  });
}

export async function purchaseAirtime(
  request: PurchaseAirtimeRequest
): Promise<PurchaseResponse> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        message: "Airtime purchased successfully",
        data: {
          transactionId: `TXN${Date.now()}`,
          amount: request.amount,
          phoneNumber: request.phoneNumber,
          networkProvider: request.networkCode,
          timestamp: new Date().toISOString(),
        },
      });
    }, 1500);
  });
}

export async function purchaseData(
  request: PurchaseDataRequest
): Promise<PurchaseResponse> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        message: "Data purchased successfully",
        data: {
          transactionId: `TXN${Date.now()}`,
          amount: "0", // Will be determined by bundle
          phoneNumber: request.phoneNumber,
          networkProvider: request.networkCode,
          timestamp: new Date().toISOString(),
        },
      });
    }, 1500);
  });
}
