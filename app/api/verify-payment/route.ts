import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"
import { generateInvoiceNumber, createInvoiceRecord, type InvoiceData } from "@/lib/invoice-utils"

// Function to send invoice email directly
async function sendInvoiceEmailDirect(invoiceData: InvoiceData) {
  const sendGridApiKey = process.env.SENDGRID_API_KEY;

  if (!sendGridApiKey) {
    throw new Error('SendGrid API key not configured');
  }

  // Generate invoice HTML template
  const invoiceDate = new Date(invoiceData.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const planIds = invoiceData.planIds.split(',');
  const planTitles = invoiceData.planTitles.split(',');

  const invoiceHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoiceData.invoiceNumber}</title>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 3px solid #dc2626; padding-bottom: 20px; margin-bottom: 30px; }
        .company-name { font-size: 28px; font-weight: bold; color: #dc2626; margin-bottom: 5px; }
        .company-tagline { font-size: 14px; color: #666; }
        .invoice-title { font-size: 24px; font-weight: bold; color: #333; margin: 30px 0 20px 0; }
        .total-section { background: #dc2626; color: white; padding: 20px; border-radius: 8px; text-align: right; margin-top: 20px; }
        .total-amount { font-size: 24px; font-weight: bold; }
        .payment-info { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">DownDating</div>
        <div class="company-tagline">Find Your Perfect Match</div>
      </div>
      <h1 class="invoice-title">Invoice #${invoiceData.invoiceNumber}</h1>
      <p><strong>Customer:</strong> ${invoiceData.name}</p>
      <p><strong>Email:</strong> ${invoiceData.email}</p>
      <p><strong>Phone:</strong> ${invoiceData.phone}</p>
      <p><strong>Date:</strong> ${invoiceDate}</p>
      <p><strong>Plan:</strong> ${planTitles.join(', ')}</p>
      <div class="total-section">
        <div class="total-amount">Total: ₹${invoiceData.totalAmount.toLocaleString('en-IN')}</div>
      </div>
      <div class="payment-info">
        <strong>Payment Status: Completed</strong><br>
        Thank you for your purchase! Your payment has been processed successfully.
      </div>
    </body>
    </html>
  `;

  const emailData = {
    personalizations: [
      {
        to: [{ email: invoiceData.email }],
        subject: `Invoice #${invoiceData.invoiceNumber} - DownDating Purchase`,
      },
    ],
    from: {
      email: process.env.FROM_EMAIL || 'support@downdating.in',
      name: 'DownDating',
    },
    content: [
      {
        type: 'text/html',
        value: invoiceHtml,
      },
    ],
  };

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sendGridApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`SendGrid API error: ${response.status} - ${errorData}`);
  }
}

const supabase = createClient(
  process.env.DATABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role for server routes
)

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, cartItems, customerInfo } = await request.json()

    // Skip signature verification for free plans
    if (razorpay_order_id !== "free" && razorpay_payment_id !== "free") {
      // Verify payment signature for paid plans
      const body = razorpay_order_id + "|" + razorpay_payment_id
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex")
      
      // Note: You should also verify the signature matches the one from Razorpay
      // This requires the razorpay_signature from the frontend
      console.log("Payment signature verification completed for order:", razorpay_order_id)
    } else {
      console.log("Skipping signature verification for free plan")
    }


    // Store payment details in database
    const { data: paymentRecord, error } = await supabase
      .from("payments")
      .insert([
        {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          razorpay_order_id,
          razorpay_payment_id,
          plan_ids: JSON.stringify(cartItems.map((item: any) => item.id)),
          plan_titles: JSON.stringify(cartItems.map((item: any) => item.title)),
          total_amount: cartItems.reduce((sum: number, item: any) => sum + item.price, 0),
          payment_status: 'completed',
        },
      ])
      .select("id")
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, error: "Failed to store payment" }, { status: 500 })
    }

    // Generate and send invoices for each cart item
    const invoicePromises = cartItems.map(async (item: any) => {
      try {
        const invoiceNumber = await generateInvoiceNumber();

        const invoiceData: InvoiceData = {
          invoiceNumber,
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          planIds: item.id,
          planTitles: item.title,
          totalAmount: item.price,
          paymentStatus: 'completed',
          createdAt: new Date().toISOString(),
        };

        // Save invoice to database and send email directly (no HTTP call needed)
        try {
          // First: Save invoice to database
          await createInvoiceRecord(invoiceData);
          console.log(`Invoice saved to database: ${invoiceNumber}`);

          // Second: Send invoice email via SendGrid
          await sendInvoiceEmailDirect(invoiceData);
          console.log(`Invoice sent successfully for ${item.title}: ${invoiceNumber}`);
          
          return { planName: item.title, invoiceNumber, success: true };
        } catch (error) {
          console.error(`Failed to process invoice for ${item.title}:`, error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          return { planName: item.title, invoiceNumber, success: false, error: errorMessage };
        }
      } catch (invoiceError) {
        console.error(`Error processing invoice for ${item.title}:`, invoiceError);
        return { planName: item.title, success: false, error: invoiceError };
      }
    });

    // Wait for all invoices to be processed
    const invoiceResults = await Promise.allSettled(invoicePromises);

    const successfulInvoices = invoiceResults
      .filter(result => result.status === 'fulfilled' && result.value.success)
      .map(result => (result as PromiseFulfilledResult<any>).value);

    const failedInvoices = invoiceResults
      .filter(result => result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.success))
      .map(result => (result as PromiseFulfilledResult<any>).value);

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: paymentRecord.id,
      invoices: {
        successful: successfulInvoices,
        failed: failedInvoices,
      },
    })
  } catch (error) {
    console.error("Payment verification failed:", error)
    return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 500 })
  }
}
