// Simple PDF generation without heavy dependencies
// In production, use @react-pdf/renderer

export interface QuoteData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  validUntil: string;
  leadTime: string;
}

export interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export const generateQuotePDF = async (data: QuoteData): Promise<void> => {
  // Create a printable HTML element
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Quote - SAVIMAN</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .logo { font-size: 24px; font-weight: bold; color: #B45309; }
        .title { font-size: 20px; font-weight: bold; color: #1F2937; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .label { font-weight: bold; color: #6B7280; font-size: 12px; }
        .value { color: #1F2937; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #F3F4F6; padding: 12px; text-align: left; border-bottom: 2px solid #E5E7EB; }
        td { padding: 12px; border-bottom: 1px solid #E5E7EB; }
        .totals { text-align: right; }
        .total-row { display: flex; justify-content: flex-end; gap: 40px; padding: 8px 0; }
        .grand-total { font-size: 18px; font-weight: bold; color: #B45309; border-top: 2px solid #B45309; padding-top: 10px; }
        .footer { margin-top: 50px; font-size: 12px; color: #6B7280; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">SAVIMAN</div>
        <div>
          <div class="title">QUOTE</div>
          <div>#QT-${Date.now().toString().slice(-6)}</div>
        </div>
      </div>

      <div class="info-grid">
        <div>
          <div class="label">QUOTE TO</div>
          <div class="value">${data.companyName}</div>
          <div class="value">${data.contactName}</div>
          <div class="value">${data.email}</div>
          <div class="value">${data.phone}</div>
        </div>
        <div style="text-align: right;">
          <div class="label">DATE</div>
          <div class="value">${new Date().toLocaleDateString()}</div>
          <div class="label">VALID UNTIL</div>
          <div class="value">${data.validUntil}</div>
          <div class="label">LEAD TIME</div>
          <div class="value">${data.leadTime}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>$${item.unitPrice.toFixed(2)}</td>
              <td>$${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>$${data.subtotal.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Tax (10%):</span>
          <span>$${data.tax.toFixed(2)}</span>
        </div>
        <div class="total-row grand-total">
          <span>Total:</span>
          <span>$${data.total.toFixed(2)}</span>
        </div>
      </div>

      <div class="footer">
        <p>SAVIMAN Industries | ISO 9001:2015 Certified</p>
        <p>This quote is valid until ${data.validUntil}. Prices subject to change based on raw material costs.</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }
};

export const generateICS = (event: { title: string; description: string; date: string; time: string }) => {
  const formatDate = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr);
    const [hours, minutes] = timeStr.replace(' AM', '').replace(' PM', ':00').split(':');
    date.setHours(parseInt(hours) + (timeStr.includes('PM') && parseInt(hours) !== 12 ? 12 : 0));
    date.setMinutes(parseInt(minutes));
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
DTSTART:${formatDate(event.date, event.time)}
DTEND:${formatDate(event.date, event.time)}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'saviman-call-invite.ics';
  link.click();
};
