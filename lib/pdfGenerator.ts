import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function generatePDF(formData: any): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page
  const page = pdfDoc.addPage([595, 842]); // A4 size
  
  // Get fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Define text size and colors
  const titleSize = 20;
  const headingSize = 14;
  const textSize = 11;
  const lineHeight = 20;
  
  let yPosition = 770;
  
  // Title
  page.drawText('Erklärung zum Beschäftigungsverhältnis', {
    x: 50,
    y: yPosition,
    size: titleSize,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });
  
  yPosition -= 40;
  
  // Employer Section
  page.drawText('1. Angaben zum Arbeitgeber', {
    x: 50,
    y: yPosition,
    size: headingSize,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });
  
  yPosition -= 25;
  
  const employerFields = [
    { label: 'Firmenname:', value: formData.employerName },
    { label: 'Betriebsnummer:', value: formData.employerNumber },
    { label: 'Adresse:', value: formData.employerAddress },
  ];
  
  for (const field of employerFields) {
    page.drawText(field.label, {
      x: 50,
      y: yPosition,
      size: textSize,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(field.value || '', {
      x: 200,
      y: yPosition,
      size: textSize,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= lineHeight;
  }
  
  yPosition -= 20;
  
  // Employee Section
  page.drawText('2. Angaben zum Arbeitnehmer', {
    x: 50,
    y: yPosition,
    size: headingSize,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });
  
  yPosition -= 25;
  
  const employeeFields = [
    { label: 'Vorname:', value: formData.employeeFirstName },
    { label: 'Nachname:', value: formData.employeeLastName },
    { label: 'Geburtsdatum:', value: formData.employeeBirthDate },
    { label: 'Staatsangehörigkeit:', value: formData.employeeNationality },
    { label: 'Passnummer:', value: formData.employeePassport },
  ];
  
  for (const field of employeeFields) {
    page.drawText(field.label, {
      x: 50,
      y: yPosition,
      size: textSize,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(field.value || '', {
      x: 200,
      y: yPosition,
      size: textSize,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= lineHeight;
  }
  
  yPosition -= 20;
  
  // Employment Section
  page.drawText('3. Angaben zum Beschäftigungsverhältnis', {
    x: 50,
    y: yPosition,
    size: headingSize,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });
  
  yPosition -= 25;
  
  const employmentFields = [
    { label: 'Arbeitsbeginn:', value: formData.employmentStartDate },
    { label: 'Arbeitsende:', value: formData.employmentEndDate },
    { label: 'Berufsbezeichnung:', value: formData.jobTitle },
    { label: 'Wöchentliche Arbeitszeit:', value: formData.weeklyHours ? `${formData.weeklyHours} Stunden` : '' },
    { label: 'Bruttogehalt (monatlich):', value: formData.monthlySalary ? `€ ${formData.monthlySalary}` : '' },
  ];
  
  for (const field of employmentFields) {
    page.drawText(field.label, {
      x: 50,
      y: yPosition,
      size: textSize,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    
    page.drawText(field.value || '', {
      x: 200,
      y: yPosition,
      size: textSize,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= lineHeight;
  }
  
  if (formData.jobDescription) {
    yPosition -= 10;
    page.drawText('Tätigkeitsbeschreibung:', {
      x: 50,
      y: yPosition,
      size: textSize,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    
    yPosition -= lineHeight;
    
    // Wrap long text
    const maxWidth = 490;
    const words = formData.jobDescription.split(' ');
    let line = '';
    
    for (const word of words) {
      const testLine = line + word + ' ';
      const textWidth = helveticaFont.widthOfTextAtSize(testLine, textSize);
      
      if (textWidth > maxWidth && line !== '') {
        page.drawText(line.trim(), {
          x: 50,
          y: yPosition,
          size: textSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        line = word + ' ';
        yPosition -= lineHeight;
      } else {
        line = testLine;
      }
    }
    
    if (line !== '') {
      page.drawText(line.trim(), {
        x: 50,
        y: yPosition,
        size: textSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    }
  }
  
  // Signature Section
  yPosition = 150;
  
  page.drawText('4. Unterschriften', {
    x: 50,
    y: yPosition,
    size: headingSize,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });
  
  yPosition -= 40;
  
  // Date and place
  const today = new Date().toLocaleDateString('de-DE');
  page.drawText(`Ort, Datum: _________________, ${today}`, {
    x: 50,
    y: yPosition,
    size: textSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  yPosition -= 40;
  
  // Signature lines
  page.drawText('_______________________________', {
    x: 50,
    y: yPosition,
    size: textSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText('_______________________________', {
    x: 320,
    y: yPosition,
    size: textSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  yPosition -= 15;
  
  page.drawText('Unterschrift Arbeitgeber', {
    x: 50,
    y: yPosition,
    size: 10,
    font: helveticaFont,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  page.drawText('Unterschrift Arbeitnehmer', {
    x: 320,
    y: yPosition,
    size: 10,
    font: helveticaFont,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}