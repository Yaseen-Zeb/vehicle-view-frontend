import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { Vehicle } from '@/types/vehicle';
import QRCode from 'qrcode';

function spellDigits(number: string) {
  if (!number) {
    return '';
  }
  const digitWords = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"];
  return String(number)
    .split('')
    .map(char => digitWords[parseInt(char)])
    .join(' ');
}

export const generateQRCodeDataUrl = async (vehicleId: number): Promise<string> => {
  const url = `${window.location.origin}/public/vehicle/${vehicleId}`;
  return await QRCode.toDataURL(url, {
    margin: 1,
    color: {
      dark: '#000000',
      light: '#0000' // transparent background
    }
  });
};


const backgroundImageUrl = '/lovable-uploads/050a130d-e6dd-4406-ae2d-0e528890de70.png';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    position: 'relative',
    width: 750,
    height: 550,
  },
  background: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 750,
    height: 550,
    zIndex: 1,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 750,
    height: 550,
    zIndex: 1,
    padding: 0,
  },
  text: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'Helvetica',
    position: 'absolute',
  },
});

interface VehiclePDFProps {
  vehicle: Vehicle;
}

// Utility to format date as DD/MM/YYYY
const formatDateDMY = (dateStr: string) => {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const VehiclePDF: React.FC<VehiclePDFProps> = ({ vehicle }) => {
  const qrCodeUrl = generateQRCodeDataUrl(vehicle.id);
  return (
    <Document>
      <Page size={{ width: 550, height: 750 }} style={styles.page} orientation="landscape">
        {/* Background image */}
        <Image src={backgroundImageUrl} style={styles.background} />
        {/* Overlayed vehicle data */}
        <View style={styles.overlay}>
          {/* Card No. and Date */}
          <Text style={{ ...styles.text, left: 23, top: 94, width: 105, textAlign: 'right' }}>{vehicle.vccNo}</Text>
          <Text style={{ ...styles.text, right: 80, top: 94 }}>
            {formatDateDMY(vehicle.vccGenerationDate)}
          </Text>


          {/* Vehicle Type */}
          <Text style={{ ...styles.text, right: 147, top: 137, width: 194, textAlign: 'left' }}>{`${vehicle.vehicleBrandName} - ${vehicle.vehicleModel} (${vehicle.vehicleType})`}</Text>


          {/* Brand and Model */}
          <Text style={{ ...styles.text, right: 100, top: 212, width: 240 }}>{`${vehicle.yearOfBuilt} - ${spellDigits(vehicle.yearOfBuilt)}`}</Text>


          {/* Origin */}
          <Text style={{ ...styles.text, right: 100, top: 251, width: 240, textAlign: 'left' }}>{vehicle.countryOfOrigin}</Text>


          {/* Chassis No. */}
          <Text style={{ ...styles.text, right: 100, top: 299, width: 240, textAlign: 'left' }}>{vehicle.chassisNo}</Text>


          {/* Color */}
          <Text style={{ ...styles.text, right: 100, top: 338, width: 240, textAlign: 'left' }}>{vehicle.vehicleColor}</Text>


          {/* Engine No. */}
          <Text style={{ ...styles.text, right: 100, top: 379, width: 240, textAlign: 'left' }}>{vehicle.engineNumber}</Text>


          {/* Engine HP (if available) */}
          {vehicle.engineCapacity && (
            <Text style={{ ...styles.text, textAlign: 'right', right: 452, top: 210, width: 245}}>{vehicle.engineCapacity}</Text>
          )}


          {/* Weight (if available) */}
          {vehicle.carriageCapacity && (
            <Text style={{ ...styles.text, right: 502, top: 255, width: 215 }}>{vehicle.carriageCapacity}</Text>
          )}


          {/* Importer or Owner */}
          <Text style={{ ...styles.text, right: 502, top: 296, width: 215 }}>{vehicle.ownerName}</Text>
          <Text style={{ ...styles.text, right: 502, top: 311, width: 215 }}>{vehicle.ownerCode}</Text>


          {/* Declaration No. */}
          <Text style={{ ...styles.text, right: 502, top: 340, width: 215 }}>{`${vehicle.declarationNumber} - ${formatDateDMY(vehicle.declarationDate)}`}</Text>


          {/* comments */}
          <Text style={{ ...styles.text, right: 62, top: 448, width: 295 }}>{vehicle.printRemarks}</Text>


          {/* QR Code */}
          <Image src={qrCodeUrl} style={{ position: 'absolute', left: 53, bottom: 23, width: 70, height: 70,backgroundColor: 'transparent' }} />
        </View>
      </Page>
    </Document>
  );
};

export default VehiclePDF; 