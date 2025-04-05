
import { toast } from "sonner";

export type AccountRole = "admin" | "customer" | "vendor";

export interface Account {
  id: string;
  name: string;
  email: string;
  role: AccountRole;
  status: "active" | "suspended" | "pending";
  dateCreated: Date;
  lastLogin?: Date;
  avatar?: string;
}

// Mock data for accounts
const MOCK_ACCOUNTS: Account[] = [
  {
    id: "admin-123",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    dateCreated: new Date(2023, 1, 15),
    lastLogin: new Date(),
    avatar: "/avatars/ai-assistant.png",
  },
  {
    id: "vendor-123",
    name: "Food Truck Vendor",
    email: "vendor@example.com",
    role: "vendor",
    status: "active",
    dateCreated: new Date(2023, 2, 10),
    lastLogin: new Date(2023, 5, 20),
  },
  {
    id: "customer-123",
    name: "John Customer",
    email: "customer@example.com",
    role: "customer",
    status: "active",
    dateCreated: new Date(2023, 3, 5),
    lastLogin: new Date(2023, 5, 25),
  },
  {
    id: "vendor-124",
    name: "Sarah's Tacos",
    email: "sarah@tacos.com",
    role: "vendor",
    status: "active",
    dateCreated: new Date(2023, 1, 20),
    lastLogin: new Date(2023, 5, 15),
  },
  {
    id: "customer-124",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "customer",
    status: "suspended",
    dateCreated: new Date(2023, 2, 25),
    lastLogin: new Date(2023, 4, 10),
  },
  {
    id: "customer-125",
    name: "Robert Johnson",
    email: "robert@example.com",
    role: "customer",
    status: "pending",
    dateCreated: new Date(2023, 4, 15),
  },
  {
    id: "vendor-125",
    name: "Pizza On Wheels",
    email: "info@pizzaonwheels.com",
    role: "vendor",
    status: "active",
    dateCreated: new Date(2023, 0, 10),
    lastLogin: new Date(2023, 5, 22),
  },
  {
    id: "vendor-126",
    name: "Burger Express",
    email: "contact@burgerexpress.com",
    role: "vendor",
    status: "pending",
    dateCreated: new Date(2023, 3, 30),
  }
];

// In-memory storage for our accounts (simulating a database)
let accounts = [...MOCK_ACCOUNTS];

export const getAccounts = async (): Promise<Account[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...accounts];
};

export const getAccountById = async (id: string): Promise<Account | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return accounts.find(account => account.id === id);
};

export const createAccount = async (accountData: Omit<Account, 'id' | 'dateCreated'>): Promise<Account> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newAccount: Account = {
    ...accountData,
    id: `${accountData.role}-${Date.now()}`,
    dateCreated: new Date(),
  };
  
  accounts.push(newAccount);
  toast.success(`Account for ${newAccount.name} created successfully`);
  return newAccount;
};

export const updateAccount = async (id: string, accountData: Partial<Omit<Account, 'id' | 'dateCreated'>>): Promise<Account> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const index = accounts.findIndex(account => account.id === id);
  if (index === -1) {
    throw new Error("Account not found");
  }
  
  accounts[index] = {
    ...accounts[index],
    ...accountData,
  };
  
  toast.success(`Account for ${accounts[index].name} updated successfully`);
  return accounts[index];
};

export const deleteAccount = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const index = accounts.findIndex(account => account.id === id);
  if (index === -1) {
    throw new Error("Account not found");
  }
  
  const deletedAccount = accounts[index];
  accounts = accounts.filter(account => account.id !== id);
  
  toast.success(`Account for ${deletedAccount.name} deleted successfully`);
};

export const suspendAccount = async (id: string): Promise<Account> => {
  return updateAccount(id, { status: "suspended" });
};

export const activateAccount = async (id: string): Promise<Account> => {
  return updateAccount(id, { status: "active" });
};

// Payment Methods Types
export interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex" | "discover";
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  userId?: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: "completed" | "pending" | "refunded";
  orderRef: string;
  userId?: string;
}

// Invoice Types
export interface Invoice {
  id: string;
  orderRef: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  vendor: string;
  userId?: string;
}

// Store payment data (simulating a database)
let paymentMethods: PaymentMethod[] = [];
let transactions: Transaction[] = [];
let invoices: Invoice[] = [];

// Payment Methods Functions
export const getPaymentMethods = async (userId?: string): Promise<PaymentMethod[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  if (userId) {
    return paymentMethods.filter(method => method.userId === userId);
  }
  return paymentMethods;
};

export const addPaymentMethod = async (method: Omit<PaymentMethod, 'id'>, userId?: string): Promise<PaymentMethod> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const newMethod: PaymentMethod = {
    ...method,
    id: `pm_${Date.now()}`,
    userId
  };
  
  // If this is the first payment method for this user, make it default
  if (!paymentMethods.some(m => m.userId === userId)) {
    newMethod.isDefault = true;
  }
  
  paymentMethods.push(newMethod);
  toast.success("Payment method added successfully");
  return newMethod;
};

export const updatePaymentMethod = async (id: string, data: Partial<PaymentMethod>): Promise<PaymentMethod> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = paymentMethods.findIndex(method => method.id === id);
  if (index === -1) {
    throw new Error("Payment method not found");
  }
  
  paymentMethods[index] = {
    ...paymentMethods[index],
    ...data
  };
  
  return paymentMethods[index];
};

export const setDefaultPaymentMethod = async (id: string, userId?: string): Promise<PaymentMethod[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const userMethods = userId 
    ? paymentMethods.filter(m => m.userId === userId) 
    : paymentMethods;
  
  const updatedMethods = paymentMethods.map(method => ({
    ...method,
    isDefault: method.id === id && (!userId || method.userId === userId)
  }));
  
  paymentMethods = updatedMethods;
  toast.success("Default payment method updated");
  
  return userMethods;
};

export const deletePaymentMethod = async (id: string, userId?: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const methodToRemove = paymentMethods.find(method => method.id === id);
  if (!methodToRemove) {
    throw new Error("Payment method not found");
  }
  
  // If removing the default method, set another as default
  if (methodToRemove.isDefault) {
    const userMethods = userId 
      ? paymentMethods.filter(m => m.userId === userId && m.id !== id)
      : paymentMethods.filter(m => m.id !== id);
      
    if (userMethods.length > 0) {
      userMethods[0].isDefault = true;
    }
  }
  
  paymentMethods = paymentMethods.filter(method => method.id !== id);
  toast.success("Payment method removed successfully");
};

// Transaction Functions
export const getTransactions = async (userId?: string): Promise<Transaction[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  if (userId) {
    return transactions.filter(transaction => transaction.userId === userId);
  }
  return transactions;
};

export const addTransaction = async (transaction: Omit<Transaction, 'id'>, userId?: string): Promise<Transaction> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const newTransaction: Transaction = {
    ...transaction,
    id: `txn_${Date.now()}`,
    userId
  };
  
  transactions.push(newTransaction);
  return newTransaction;
};

// Invoice Functions
export const getInvoices = async (userId?: string): Promise<Invoice[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  if (userId) {
    return invoices.filter(invoice => invoice.userId === userId);
  }
  return invoices;
};

export const addInvoice = async (invoice: Omit<Invoice, 'id'>, userId?: string): Promise<Invoice> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const newInvoice: Invoice = {
    ...invoice,
    id: `inv_${Date.now()}`,
    userId
  };
  
  invoices.push(newInvoice);
  return newInvoice;
};
