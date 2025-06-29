import { useParams } from 'react-router-dom';
import { useVehicle } from '@/hooks/useVehicles';

// Utility to format date as DD/MM/YYYY
const formatDateDMY = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const PublicVehicleView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: vehicle, isLoading, error } = useVehicle(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border rounded shadow p-8 text-center text-muted-foreground">Loading vehicle details...</div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border rounded shadow p-8 text-center">
          <div className="text-2xl font-bold mb-2">Vehicle Not Found</div>
          <div className="text-muted-foreground">The requested vehicle record could not be found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-2">
      <div className="max-w-5xl mx-auto">
        {/* Header Bar */}
        <div className="bg-[#626262] text-white px-6 py-3 text-lg font-semibold border border-b-0 border-gray-300">View VCC Details</div>
        {/* Section Bar */}
        <div className="bg-white border-x border-t border-gray-300 px-4 py-2 text-[16px] font-semibold text-red-700 border-b-0">VCC/Vehicle Details</div>
        {/* Details Card */}
        <div className="bg-white border border-gray-300 rounded-b-md p-1">
          <div className="bg-gray-200 grid grid-cols-1 md:grid-cols-2 gap-x-8  py-3 px-4">
            {/* Left Column */}
            <div className="space-y-3">
              <Detail label="VCC No" value={vehicle.vccNo} />
              <Detail label="VCC Generation Date" value={formatDateDMY(vehicle.vccGenerationDate)} />
              <Detail label="Engine Number" value={vehicle.engineNumber || ''} />
              <Detail label="Vehicle Drive" value={vehicle.vehicleDrive} />
              <Detail label="Engine Capacity" value={vehicle.engineCapacity || ''} />
              <Detail label="Passenger Capacity" value={vehicle.passengerCapacity || ''} />
              <Detail label="Vehicle Brand Name" value={vehicle.vehicleBrandName} />
              <Detail label="Vehicle Color" value={vehicle.vehicleColor} />
              <Detail label="Declaration Number" value={vehicle.declarationNumber} />
              <Detail label="Owner Code" value={vehicle.ownerCode} />
              <div className="flex items-start text-[14px]">
                <span className="font-semibold min-w-[140px]">Print Remarks :</span>
                <span className="ml-2 whitespace-pre-line">
                  {vehicle.printRemarks}
                </span>
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-2">
              <div className="flex text-[14px] ">
                <span className="min-w-[140px]">VCC Status :</span>
                <span className="ml-2 font-bold text-red-600">Printed/Downloaded</span>
              </div>
              <Detail label="Chassis No" value={vehicle.chassisNo} />
              <Detail label="Year of Built" value={vehicle.yearOfBuilt} />
              <Detail label="Country of Origin" value={vehicle.countryOfOrigin} />
              <Detail label="Carriage Capacity" value={vehicle.carriageCapacity || ''} />
              <Detail label="Vehicle Model" value={vehicle.vehicleModel} />
              <Detail label="Vehicle Type" value={vehicle.vehicleType} />
              <Detail label="Specification Standard Name" value={vehicle.specificationStandardName} />
              <Detail label="Declaration Date" value={formatDateDMY(vehicle.declarationDate)} />
              <Detail label="Owner Name" value={vehicle.ownerName} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Detail({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div className="flex text-[14px]">
      <span className="min-w-[140px]">{label} :</span>
      <span className="ml-2 font-medium text-gray-900">{value || ''}</span>
    </div>
  );
}
