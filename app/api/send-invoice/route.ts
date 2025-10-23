import { NextResponse } from 'next/server';
import { createInvoiceRecord } from '@/lib/invoice-utils';

interface InvoiceData {
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

export async function POST(request: Request) {
  try {
    const invoiceData: InvoiceData = await request.json();

    // Validate required fields
    const requiredFields = [
      'invoiceNumber', 'name', 'email', 'phone',
      'razorpayOrderId', 'planIds', 'planTitles', 'totalAmount', 'paymentStatus', 'createdAt'
    ];

    for (const field of requiredFields) {
      if (!invoiceData[field as keyof InvoiceData]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // First: Save invoice to database
    try {
      await createInvoiceRecord(invoiceData);
      console.log('Invoice saved to database:', invoiceData.invoiceNumber);
    } catch (dbError) {
      console.error('Failed to save invoice to database:', dbError);
      return NextResponse.json(
        { error: 'Failed to save invoice to database', details: dbError },
        { status: 500 }
      );
    }

    // Second: Generate invoice HTML template
    const invoiceHtml = generateInvoiceTemplate(invoiceData);

    // Third: Send email via SendGrid
    const sendGridResponse = await sendInvoiceEmail(invoiceData.email, invoiceHtml, invoiceData);

    if (!sendGridResponse.success) {
      return NextResponse.json(
        { error: 'Failed to send invoice email', details: sendGridResponse.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Invoice saved to database and sent successfully',
      invoiceNumber: invoiceData.invoiceNumber,
      sendGridMessageId: sendGridResponse.messageId
    });

  } catch (error) {
    console.error('Error sending invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateInvoiceTemplate(data: InvoiceData): string {
  const invoiceDate = new Date(data.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Parse plan IDs and titles
  const planIds = data.planIds.split(',');
  const planTitles = data.planTitles.split(',');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${data.invoiceNumber}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #dc2626;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .company-name {
          font-size: 28px;
          font-weight: bold;
          color: #dc2626;
          margin-bottom: 5px;
        }
        .company-tagline {
          font-size: 14px;
          color: #666;
        }
        .invoice-title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin: 30px 0 20px 0;
        }
        .invoice-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }
        .detail-section h4 {
          margin: 0 0 10px 0;
          color: #dc2626;
          font-size: 16px;
        }
        .detail-item {
          margin: 5px 0;
          font-size: 14px;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .invoice-table th,
        .invoice-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        .invoice-table th {
          background: #f8f9fa;
          font-weight: bold;
          color: #333;
        }
        .total-section {
          background: #dc2626;
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: right;
          margin-top: 20px;
        }
        .total-amount {
          font-size: 24px;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .payment-info {
          background: #e8f5e8;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #4caf50;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">DownDating</div>
        <div class="company-tagline">Find Your Perfect Match</div>
      </div>

      <h1 class="invoice-title">Invoice #${data.invoiceNumber}</h1>

      <div class="invoice-details">
        <div class="detail-section">
          <h4>Bill To:</h4>
          <div class="detail-item"><strong>${data.name}</strong></div>
          <div class="detail-item">${data.email}</div>
          <div class="detail-item">${data.phone}</div>
        </div>
        <div class="detail-section">
          <h4>Invoice Details:</h4>
          <div class="detail-item"><strong>Invoice #:</strong> ${data.invoiceNumber}</div>
          <div class="detail-item"><strong>Date:</strong> ${invoiceDate}</div>
          <div class="detail-item"><strong>Order ID:</strong> ${data.razorpayOrderId}</div>
          ${data.razorpayPaymentId ? `<div class="detail-item"><strong>Payment ID:</strong> ${data.razorpayPaymentId}</div>` : ''}
        </div>
      </div>

      <table class="invoice-table">
        <thead>
          <tr>
            <th>Plan</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          ${planTitles.map((title, index) => `
            <tr>
              <td>${title.trim()}</td>
              <td>Plan ID: ${planIds[index]?.trim() || 'N/A'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="total-section">
        <div class="total-amount">Total: ₹${data.totalAmount.toLocaleString('en-IN')}</div>
      </div>

      <div class="payment-info">
        <strong>Payment Status: ${data.paymentStatus.charAt(0).toUpperCase() + data.paymentStatus.slice(1)}</strong><br>
        ${data.paymentStatus === 'completed' ? 'Thank you for your purchase! Your payment has been processed successfully.' : 'Your payment is being processed.'}
      </div>

      <div class="footer">
        <p><strong>DownDating</strong></p>
        <p>Find Your Perfect Match | The most exciting dating experience in your city</p>
        <p>Email: support@downdating.in | Website: https://downdating.in</p>
        <p>This is a computer-generated invoice and does not require a signature.</p>
      </div>
    </body>
    </html>
  `;
}

async function sendInvoiceEmail(to: string, htmlContent: string, invoiceData: InvoiceData) {
  const sendGridApiKey = process.env.SENDGRID_API_KEY;

  if (!sendGridApiKey) {
    console.error('SendGrid API key not configured');
    return { success: false, error: 'SendGrid API key not configured' };
  }

  const emailData = {
    personalizations: [
      {
        to: [{ email: to }],
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
        value: htmlContent,
      },
    ],
  };

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendGridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (response.ok) {
      const messageId = response.headers.get('x-message-id');
      return { success: true, messageId };
    } else {
      const errorData = await response.text();
      console.error('SendGrid API error:', response.status, errorData);
      return { success: false, error: `SendGrid API error: ${response.status} - ${errorData}` };
    }
  } catch (error) {
    console.error('Error sending email via SendGrid:', error);
    return { success: false, error: 'Network error while sending email' };
  }
}