import { Platform } from 'react-native';
import * as Sharing from 'expo-sharing';

// ✅ Define the types directly (no Supabase import)
interface Party {
  name: string;
  role: string;
  id_number: string;
  signature_url?: string;
  signed_at?: string;
}

interface Agreement {
  id: string | number;
  title: string;
  terms: string;
  status: string;
  created_at: string;
  parties: Party[];
}

export const generatePDF = async (agreement: Agreement) => {
  if (Platform.OS === 'web') {
    generateWebPDF(agreement);
    return;
  }

  const RNHTMLtoPDF = require('react-native-html-to-pdf');
  const htmlContent = generateHTML(agreement);

  try {
    const options = {
      html: htmlContent,
      fileName: `agreement_${agreement.id}`,
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options);

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(file.filePath);
    }

    return file.filePath;
  } catch (error) {
    throw error;
  }
};

const generateWebPDF = (agreement: Agreement) => {
  const htmlContent = generateHTML(agreement);

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};

const generateHTML = (agreement: Agreement): string => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const partiesHTML = agreement.parties
    .map(
      (party) => `
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="color: #111827; margin-bottom: 10px;">${party.name} - ${party.role}</h3>
        <p style="margin: 5px 0;"><strong>ID Number:</strong> ${party.id_number}</p>
        ${
          party.signature_url
            ? `
          <div style="margin-top: 15px;">
            <p style="margin-bottom: 5px; color: #6b7280;">Signature:</p>
            <img src="${party.signature_url}" style="max-width: 300px; height: auto; border: 1px solid #e5e7eb; border-radius: 4px;" />
            <p style="margin-top: 5px; color: #6b7280; font-size: 12px;">Signed: ${formatDate(party.signed_at!)}</p>
          </div>
        `
            : '<p style="color: #9ca3af;">Not yet signed</p>'
        }
      </div>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${agreement.title}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #111827;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
          }
          h1 {
            color: #111827;
            font-size: 28px;
            margin-bottom: 10px;
          }
          h2 {
            color: #111827;
            font-size: 20px;
            margin-top: 30px;
            margin-bottom: 15px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
          }
          h3 {
            color: #374151;
            font-size: 16px;
          }
          .header {
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2563eb;
          }
          .status {
            display: inline-block;
            padding: 6px 12px;
            background-color: #e5e7eb;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 10px;
          }
          .status.completed {
            background-color: #d1fae5;
            color: #065f46;
          }
          .date {
            color: #6b7280;
            font-size: 14px;
            margin-top: 8px;
          }
          .terms {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            margin-bottom: 30px;
            white-space: pre-wrap;
          }
          @media print {
            body {
              padding: 20px;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${agreement.title}</h1>
          <div class="status ${agreement.status}">
            ${agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
          </div>
          <p class="date">Created: ${formatDate(agreement.created_at)}</p>
        </div>

        <h2>Terms and Conditions</h2>
        <div class="terms">${agreement.terms}</div>

        <h2>Parties</h2>
        ${partiesHTML}

        <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
          <p>Generated by eAgree Lite on ${formatDate(new Date().toISOString())}</p>
        </div>
      </body>
    </html>
  `;
};
