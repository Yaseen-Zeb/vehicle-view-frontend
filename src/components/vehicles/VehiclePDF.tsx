import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { Vehicle } from '@/types/vehicle';

function spellDigits(number: string) {
  if (!number) return '';
  const digitWords = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"];
  return String(number)
    .split('')
    .map(char => digitWords[parseInt(char)])
    .join(' ');
}

const formatDateDMY = (dateStr: string) => {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export async function generateVehiclePDFBlob(vehicle: Vehicle): Promise<Blob | null> {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: [750, 550],
    });

    // 1. Fetch background image from public folder
    let backgroundImageBase64 = '';
    try {
      const response = await fetch('/background-image.json');
      const data = await response.json();
      backgroundImageBase64 = data.backgroundImage;
    } catch (error) {
      console.warn('Could not load background image:', error);
    }

    // Add background image if available
    if (backgroundImageBase64 && backgroundImageBase64 !== 'data:image/jpeg;base64,PUT_YOUR_BASE64_STRING_HERE') {
      doc.addImage(backgroundImageBase64, 'JPEG', 0, 0, 750, 550);
    }

    // 2. Generate QR code as data URL with transparent background
    const qrCodeUrl = await QRCode.toDataURL(`${window.location.origin}/public/vehicle/${vehicle.id}`, {
      margin: 1,
      color: {
        dark: '#000000',
        light: '#0000' // transparent background
      }
    });
    doc.addImage(qrCodeUrl, 'PNG', 53, 457, 70, 70);

    // 3. Set font
    doc.setFont('helvetica');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // 4. Draw each field at the desired position (adjust x, y as needed)
    // Card No. (right-aligned in a 105pt wide box at left: 23, top: 94)
    doc.text(`${vehicle.vccNo}`, 23 + 105, 106, { align: 'right', maxWidth: 105 });
    // Date (right: 80, top: 94)
    doc.text(formatDateDMY(vehicle.vccGenerationDate), 750 - 81, 106, { align: 'right' });

    // Vehicle Type (right: 147, top: 137, width: 194)
    doc.text(
      `${vehicle.vehicleBrandName} - ${vehicle.vehicleModel} (${vehicle.vehicleType})`,
      750 - 147 - 194, 137 + 10, { maxWidth: 194 }
    );

    // Brand and Model (right: 100, top: 212, width: 240)
    doc.text(`${vehicle.yearOfBuilt} - ${spellDigits(vehicle.yearOfBuilt)}`, 750 - 100 - 240, 212 + 10, { maxWidth: 240 });

    // Origin (right: 100, top: 251, width: 240)
    doc.text(vehicle.countryOfOrigin, 750 - 100 - 240, 251 + 10, { maxWidth: 240 });

    // Chassis No. (right: 100, top: 299, width: 240)
    doc.text(vehicle.chassisNo, 750 - 100 - 240, 299 + 10, { maxWidth: 240 });

    // Color (right: 100, top: 338, width: 240)
    doc.text(vehicle.vehicleColor, 750 - 100 - 240, 338 + 10, { maxWidth: 240 });

    // Engine No. (right: 100, top: 379, width: 240)
    doc.text(vehicle.engineNumber, 750 - 100 - 240, 379 + 10, { maxWidth: 240 });

    // Engine HP (if available) (right: 452, top: 210, width: 245)
    if (vehicle.engineCapacity) {
      doc.text(vehicle.engineCapacity, 750 - 433 - 245, 210 + 10, { align: 'right', maxWidth: 245 });
    }

    // Weight (if available) (right: 502, top: 255, width: 215)
    if (vehicle.carriageCapacity) {
      doc.text(vehicle.carriageCapacity, 750 - 502 - 215, 255 + 10, { maxWidth: 215 });
    }

    // Importer or Owner (right: 502, top: 296, width: 215)
    doc.text(vehicle.ownerCode + "\n" + vehicle.ownerName, 750 - 502 - 215, 289.5 + 10, { maxWidth: 215 });

    // Declaration No. (right: 502, top: 340, width: 215)
    doc.text(
      `${vehicle.declarationNumber} - ${formatDateDMY(vehicle.declarationDate)}`,
      750 - 502 - 215, 340 + 12.5, { maxWidth: 215 }
    );

    // Comments (right: 62, top: 448, width: 295) - Handle mixed Arabic/English text
    if (vehicle.printRemarks) {
      // Count Arabic characters
      const arabicChars = (vehicle.printRemarks.match(/[\u0600-\u06FF\u0750-\u077F]/g) || []).length;
      const totalChars = vehicle.printRemarks.replace(/\s/g, '').length; // Exclude spaces
      const arabicRatio = totalChars > 0 ? arabicChars / totalChars : 0;

      if (arabicRatio > 0.5) {
        // Mostly Arabic text - use RTL alignment
        // TODO: Load Arabic font like Amiri or Cairo for better rendering
        // doc.addFont('path/to/arabic-font.ttf', 'ArabicFont', 'normal');
        // doc.setFont('ArabicFont');

        doc.text(vehicle.printRemarks, 750 - 62 - 5, 448 + 10, {
          maxWidth: 294,
          align: 'right' // RTL alignment for mostly Arabic
        });
      } else {
        // Mixed or mostly English text - use LTR alignment
        doc.text(vehicle.printRemarks, 750 - 62 - 295, 448 + 10, {
          maxWidth: 294,
          align: 'left' // LTR alignment for mixed/English text
        });
      }
    }

    // Return as blob instead of saving
    return doc.output('blob');
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    return null;
  }
}

export async function generateVehiclePDF(vehicle: Vehicle) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [750, 550],
  });

  // 1. Fetch background image from public folder
  let backgroundImageBase64 = '';
  try {
    const response = await fetch('/background-image.json');
    const data = await response.json();
    backgroundImageBase64 = data.backgroundImage;
  } catch (error) {
    console.warn('Could not load background image:', error);
  }

  // Add background image if available
  if (backgroundImageBase64 && backgroundImageBase64 !== 'data:image/jpeg;base64,PUT_YOUR_BASE64_STRING_HERE') {
    doc.addImage(backgroundImageBase64, 'JPEG', 0, 0, 750, 550);
  }

  // 2. Generate QR code as data URL with transparent background
  const qrCodeUrl = await QRCode.toDataURL(`${window.location.origin}/public/vehicle/${vehicle.id}`, {
    margin: 1,
    color: {
      dark: '#000000',
      light: '#0000' // transparent background
    }
  });
  doc.addImage(qrCodeUrl, 'PNG', 53, 457, 70, 70);

  // 3. Set font
  doc.setFont('helvetica');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  // 4. Draw each field at the desired position (adjust x, y as needed)
  // Card No. (right-aligned in a 105pt wide box at left: 23, top: 94)
  doc.text(`${vehicle.vccNo}`, 23 + 105, 106, { align: 'right', maxWidth: 105 });
  // Date (right: 80, top: 94)
  doc.text(formatDateDMY(vehicle.vccGenerationDate), 750 - 80, 106, { align: 'right' });

  // Vehicle Type (right: 147, top: 137, width: 194)
  doc.text(
    `${vehicle.vehicleBrandName} - ${vehicle.vehicleModel} (${vehicle.vehicleType})`,
    750 - 147 - 194, 137 + 10, { maxWidth: 194 }
  );

  // Brand and Model (right: 100, top: 212, width: 240)
  doc.text(`${vehicle.yearOfBuilt} - ${spellDigits(vehicle.yearOfBuilt)}`, 750 - 100 - 240, 212 + 10, { maxWidth: 240 });

  // Origin (right: 100, top: 251, width: 240)
  doc.text(vehicle.countryOfOrigin, 750 - 100 - 240, 251 + 10, { maxWidth: 240 });

  // Chassis No. (right: 100, top: 299, width: 240)
  doc.text(vehicle.chassisNo, 750 - 100 - 240, 299 + 10, { maxWidth: 240 });

  // Color (right: 100, top: 338, width: 240)
  doc.text(vehicle.vehicleColor, 750 - 100 - 240, 338 + 10, { maxWidth: 240 });

  // Engine No. (right: 100, top: 379, width: 240)
  doc.text(vehicle.engineNumber, 750 - 100 - 240, 379 + 10, { maxWidth: 240 });

  // Engine HP (if available) (right: 452, top: 210, width: 245)
  if (vehicle.engineCapacity) {
    doc.text(vehicle.engineCapacity, 750 - 433 - 245, 210 + 10, { align: 'right', maxWidth: 245 });
  }

  // Weight (if available) (right: 502, top: 255, width: 215)
  if (vehicle.carriageCapacity) {
    doc.text(vehicle.carriageCapacity, 750 - 502 - 215, 255 + 10, { maxWidth: 215 });
  }

  // Importer or Owner (right: 502, top: 296, width: 215)
  doc.text(vehicle.ownerCode + "\n" + vehicle.ownerName, 750 - 502 - 215, 289.5 + 10, { maxWidth: 215 });

  // Declaration No. (right: 502, top: 340, width: 215)
  doc.text(
    `${vehicle.declarationNumber} - ${formatDateDMY(vehicle.declarationDate)}`,
    750 - 502 - 215, 340 + 12.5, { maxWidth: 215 }
  );

  // Comments (right: 62, top: 448, width: 295) - Handle mixed Arabic/English text
  if (vehicle.printRemarks) {
    // Count Arabic characters
    const arabicChars = (vehicle.printRemarks.match(/[\u0600-\u06FF\u0750-\u077F]/g) || []).length;
    const totalChars = vehicle.printRemarks.replace(/\s/g, '').length; // Exclude spaces
    const arabicRatio = totalChars > 0 ? arabicChars / totalChars : 0;

    if (arabicRatio > 0.5) {
      // Mostly Arabic text - use RTL alignment
      // TODO: Load Arabic font like Amiri or Cairo for better rendering
      // doc.addFont('path/to/arabic-font.ttf', 'ArabicFont', 'normal');
      // doc.setFont('ArabicFont');

      doc.text(vehicle.printRemarks, 750 - 62 - 5, 448 + 10, {
        maxWidth: 300,
        align: 'right' // RTL alignment for mostly Arabic
      });
    } else {
      // Mixed or mostly English text - use LTR alignment
      doc.text(vehicle.printRemarks, 750 - 62 - 295, 448 + 10, {
        maxWidth: 300,
        align: 'left' // LTR alignment for mixed/English text
      });
    }
  }

  // 5. Save
  doc.save(`VCC_${vehicle.vccNo}.pdf`);
}

// Usage example:
// import { generateVehiclePDF } from './VehiclePDF';
// <Button onClick={() => generateVehiclePDF(vehicle)}>Download PDF</Button> 