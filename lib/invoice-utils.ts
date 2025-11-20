import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.DATABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface InvoiceData {
  invoiceNumber: string;
  name: string;
  email: string;
  phone: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  planIds: string;
  planTitles: string;
  totalAmount: number;
  paymentStatus: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

export async function generateInvoiceNumber(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  // Get the count of invoices for this month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const { count, error } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString())
    .lte('created_at', endOfMonth.toISOString());

  if (error) {
    console.error('Error counting invoices:', error);
    throw new Error('Failed to generate invoice number');
  }

  const sequenceNumber = String((count || 0) + 1).padStart(4, '0');
  return `INV-${year}${month}-${sequenceNumber}`;
}

export async function createInvoiceRecord(invoiceData: InvoiceData): Promise<void> {
  const { error } = await supabase
    .from('invoices')
    .insert({
      invoice_number: invoiceData.invoiceNumber,
      name: invoiceData.name,
      email: invoiceData.email,
      phone: invoiceData.phone,
      razorpay_order_id: invoiceData.razorpayOrderId,
      razorpay_payment_id: invoiceData.razorpayPaymentId,
      plan_ids: invoiceData.planIds,
      plan_titles: invoiceData.planTitles,
      total_amount: invoiceData.totalAmount,
      payment_status: invoiceData.paymentStatus,
      created_at: invoiceData.createdAt,
    });

  if (error) {
    console.error('Error creating invoice record:', error);
    throw new Error('Failed to create invoice record');
  }
}

export async function getInvoiceByNumber(invoiceNumber: string): Promise<InvoiceData | null> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('invoice_number', invoiceNumber)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Invoice not found
    }
    console.error('Error fetching invoice:', error);
    throw new Error('Failed to fetch invoice');
  }

  return {
    invoiceNumber: data.invoice_number,
    name: data.name,
    email: data.email,
    phone: data.phone,
    razorpayOrderId: data.razorpay_order_id,
    razorpayPaymentId: data.razorpay_payment_id,
    planIds: data.plan_ids,
    planTitles: data.plan_titles,
    totalAmount: data.total_amount,
    paymentStatus: data.payment_status,
    createdAt: data.created_at,
  };
}

export async function getInvoicesByEmail(email: string): Promise<InvoiceData[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invoices:', error);
    throw new Error('Failed to fetch invoices');
  }

  return data.map(invoice => ({
    invoiceNumber: invoice.invoice_number,
    name: invoice.name,
    email: invoice.email,
    phone: invoice.phone,
    razorpayOrderId: invoice.razorpay_order_id,
    razorpayPaymentId: invoice.razorpay_payment_id,
    planIds: invoice.plan_ids,
    planTitles: invoice.plan_titles,
    totalAmount: invoice.total_amount,
    paymentStatus: invoice.payment_status,
    createdAt: invoice.created_at,
  }));
}
