import { Platform } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { Party, Witness } from '../interFace';
import * as ImageManipulator from 'expo-image-manipulator';

interface Agreement {
  id: string | number;
  title: string;
  terms: string;
  status: string;
  created_at: string;
  parties: Party[];
  witnesses: Witness[];
}

export const generatePDF = async (agreement: Agreement) => {
  const htmlContent = await generateHTML(agreement);

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

const generateWebPDF = async (agreement: Agreement) => {
  const htmlContent = await generateHTML(agreement);
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

const generateHTML = async (agreement: Agreement): Promise<string> => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBase64FromUri = async (uri: string): Promise<string> => {
    const original = await ImageManipulator.manipulateAsync(uri, [], { base64: true });
    const flattened = await ImageManipulator.manipulateAsync(
      `data:image/png;base64,${original.base64}`,
      [],
      { base64: true, format: ImageManipulator.SaveFormat.JPEG }
    );
    return `data:image/jpeg;base64,${flattened.base64}`;
  };

  // Wrap signature with SVG watermark
  const signatureHTMLWithWatermark = (base64Signature: string, date: string) => `
    <div style="position: relative; display: inline-block;">
      <img src="${base64Signature}" style="max-width:250px;height:auto; display: block;" />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 100"
           style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
              font-size="18" fill="rgba(0,0,0,0.2)" transform="rotate(-30 125 50)">
          ${date}
        </text>
      </svg>
    </div>
  `;

  const partiesHTML = await Promise.all(
    agreement.parties.map(async (party, index) => {
      let idPhotoBase64 = '';
      if (party.id_photo_uri) idPhotoBase64 = await getBase64FromUri(party.id_photo_uri);
      let signatureBase64 = '';
      if (party.signature_url) signatureBase64 = await getBase64FromUri(party.signature_url);

      return `
        <div style="margin-bottom: 40px; page-break-inside: avoid;">
          <h3>Party ${index + 1}: ${party.name}</h3>
          <p><strong>Role:</strong> ${party.role}</p>
          <p><strong>ID Number:</strong> ${party.id_number}</p>
          ${idPhotoBase64 ? `<div><p>ID Photo:</p><img src="${idPhotoBase64}" style="max-width:250px;height:auto;" /></div>` : ''}
          ${
            signatureBase64
              ? `<div>
                   <p>Signature:</p>
                   ${signatureHTMLWithWatermark(signatureBase64, formatDate(agreement.created_at))}
                   <p>Signed: ${formatDate(party.signed_at!)}</p>
                 </div>`
              : `<p>Not yet signed</p>`
          }
        </div>
      `;
    })
  );

  const witnessesHTML = await Promise.all(
    agreement.witnesses.map(async (witness, index) => {
      let idPhotoBase64 = witness.id_photo_uri ? await getBase64FromUri(witness.id_photo_uri) : '';
      let signatureBase64 = witness.signature_url ? await getBase64FromUri(witness.signature_url) : '';

      return `
        <div style="margin-bottom: 40px; page-break-inside: avoid;">
          <h3>Witness ${index + 1}: ${witness.name}</h3>
          <p><strong>ID Number:</strong> ${witness.id_number}</p>
          ${idPhotoBase64 ? `<div><p>ID Photo:</p><img src="${idPhotoBase64}" style="max-width:250px;height:auto;" /></div>` : ''}
          ${
            signatureBase64
              ? `<div>
                   <p>Signature:</p>
                   ${signatureHTMLWithWatermark(signatureBase64, formatDate(agreement.created_at))}
                   <p>Signed: ${formatDate(witness.signed_at!)}</p>
                 </div>`
              : `<p>Not yet signed</p>`
          }
        </div>
      `;
    })
  );

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
          header { text-align: center; margin-bottom: 50px; border-bottom: 2px solid #000; padding-bottom: 20px; }
          header h1 { font-size: 26px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 5px; }
          .meta { font-size: 13px; color: #4b5563; }
          h2 { font-size: 18px; color: #111827; margin-top: 45px; margin-bottom: 15px; border-bottom: 1px solid #d1d5db; padding-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
          .terms { background-color: #f9fafb; padding: 25px 30px; border-radius: 8px; border: 1px solid #d1d5db; white-space: pre-wrap; text-align: justify; font-size: 15px; }
          .status { font-weight: 600; font-size: 14px; margin-top: 10px; padding: 6px 14px; border-radius: 8px; display: inline-block; background-color: #e5e7eb; }
          .status.completed { background-color: #d1fae5; color: #065f46; }
          footer { text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #d1d5db; padding-top: 10px; margin-top: 60px; }
          @media print { body { padding: 30px; } footer { position: fixed; bottom: 20px; width: 100%; } }
        </style>
      </head>
      <body>
        <header>
          <h1>${agreement.title}</h1>
          <div class="status ${agreement.status}">${agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}</div>
          <div class="meta"><p>Created on ${formatDate(agreement.created_at)}</p></div>
        </header>

        <section><h2>Terms and Conditions</h2><div class="terms">${agreement.terms}</div></section>
        <section><h2>Parties Involved</h2>${partiesHTML}</section>
        <section><h2>Witnesses Involved</h2>${witnessesHTML}</section>

        <footer><p>Generated by <strong>eAgree Lite</strong> on ${formatDate(new Date().toISOString())}</p></footer>
      </body>
    </html>
  `;
};
