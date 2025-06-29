import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Vehicle } from '@/types/vehicle';

interface VehicleDetailsProps {
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

export const VehicleDetails = ({ vehicle }: VehicleDetailsProps) => {
  const details = [
    { label: 'VCC Number', value: vehicle.vccNo },
    // { label: 'VCC Status', value: vehicle.vccStatus },
    { label: 'VCC Generation Date', value: formatDateDMY(vehicle.vccGenerationDate) },
    { label: 'Chassis Number', value: vehicle.chassisNo },
    { label: 'Engine Number', value: vehicle.engineNumber },
    { label: 'Year of Built', value: vehicle.yearOfBuilt },
    { label: 'Vehicle Drive', value: vehicle.vehicleDrive },
    { label: 'Country of Origin', value: vehicle.countryOfOrigin },
    { label: 'Engine Capacity', value: vehicle.engineCapacity || 'N/A' },
    { label: 'Carriage Capacity', value: vehicle.carriageCapacity || 'N/A' },
    { label: 'Passenger Capacity', value: vehicle.passengerCapacity || 'N/A' },
    { label: 'Vehicle Model', value: vehicle.vehicleModel },
    { label: 'Vehicle Brand Name', value: vehicle.vehicleBrandName },
    { label: 'Vehicle Type', value: vehicle.vehicleType },
    { label: 'Vehicle Color', value: vehicle.vehicleColor },
    { label: 'Specification Standard Name', value: vehicle.specificationStandardName },
    { label: 'Declaration Number', value: vehicle.declarationNumber },
    { label: 'Declaration Date', value: formatDateDMY(vehicle.declarationDate) },
    { label: 'Owner Code', value: vehicle.ownerCode },
    { label: 'Owner Name', value: vehicle.ownerName },
    { label: 'Print Remarks', value: vehicle.printRemarks || 'N/A' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Certificate Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((detail, index) => (
            <div key={index} className="border-b pb-2">
              <dt className="font-medium text-muted-foreground text-sm">{detail.label}</dt>
              <dd className="mt-1 text-sm">{detail.value}</dd>
            </div>
          ))}
        </div>
        <div className="mt-6 text-xs text-muted-foreground">
          <p>Created: {formatDateDMY(vehicle.createdAt)}</p>
          <p>Updated: {formatDateDMY(vehicle.updatedAt)}</p>
        </div>
      </CardContent>
    </Card>
  );
};
