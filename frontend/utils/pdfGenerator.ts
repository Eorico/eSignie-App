import { Platform } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';


// generated pdf converter
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
  const htmlContent = generateHTML(agreement);

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    
    if (Platform.OS !== 'web' && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(uri);
    } else if (Platform.OS === 'web') {
      generateWebPDF(agreement);
    } else {
      console.log('PDF saved at:', uri);
    }

    return uri;
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
      (party, index) => `
        <div style="margin-bottom: 40px; page-break-inside: avoid;">
          <h3 style="font-size: 16px; color: #111827; margin-bottom: 10px;">Party ${index + 1}: ${party.name}</h3>
          <p><strong>Role:</strong> ${party.role}</p>
          <p><strong>ID Number:</strong> ${party.id_number}</p>
          ${
            party.signature_url
              ? `
              <div style="margin-top: 15px; text-align: left;">
                <p style="margin-bottom: 5px; color: #6b7280;">Signature:</p>
                <img src="${party.signature_url}" 
                     style="max-width: 250px; height: auto; border: 1px solid #ccc; border-radius: 6px;" />
                <p style="margin-top: 5px; color: #6b7280; font-size: 12px;">Signed: ${formatDate(
                  party.signed_at!
                )}</p>
              </div>
            `
              : `<p style="color: #9ca3af;">Not yet signed</p>`
          }
        </div>
      `
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${agreement.title}</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          color: #111827;
          max-width: 850px;
          margin: 0 auto;
          padding: 70px 60px;
          background-color: #ffffff;
          line-height: 1.8;
        }
        header {
          text-align: center;
          margin-bottom: 50px;
          border-bottom: 2px solid #000;
          padding-bottom: 20px;
        }
        header h1 {
          font-size: 26px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 5px;
        }
        .meta {
          font-size: 13px;
          color: #4b5563;
        }
        h2 {
          font-size: 18px;
          color: #111827;
          margin-top: 45px;
          margin-bottom: 15px;
          border-bottom: 1px solid #d1d5db;
          padding-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .terms {
          background-color: #f9fafb;
          padding: 25px 30px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          white-space: pre-wrap;
          text-align: justify;
          font-size: 15px;
        }
        .status {
          font-weight: 600;
          font-size: 14px;
          margin-top: 10px;
          padding: 6px 14px;
          border-radius: 8px;
          display: inline-block;
          background-color: #e5e7eb;
        }
        .status.completed {
          background-color: #d1fae5;
          color: #065f46;
        }
        footer {
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          border-top: 1px solid #d1d5db;
          padding-top: 10px;
          margin-top: 60px;
        }
        @media print {
          body { padding: 30px; }
          footer { position: fixed; bottom: 20px; width: 100%; }
        }
      </style>
    </head>
    <body>
      <header>
        <h1>${agreement.title}</h1>
        <div class="status ${agreement.status}">
          ${agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
        </div>
        <div class="meta">
          <p>Created on ${formatDate(agreement.created_at)}</p>
        </div>
      </header>

      <section>
        <h2>Terms and Conditions</h2>
        <div class="terms">${agreement.terms}</div>
      </section>

      <section>
        <h2>Parties Involved</h2>
        ${partiesHTML}
      </section>

      <footer>
        <p>Generated by <strong>eAgree Lite</strong> on ${formatDate(new Date().toISOString())}</p>
      </footer>
    </body>
  </html>`;
};
