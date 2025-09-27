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
  const { data: vehicle, isLoading, error } = useVehicle(Number(id!));

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
    <div className="min-h-screen bg-gray-100 py-4 px-2">
      <div className="max-w-5xl mx-auto">
        {/* Header Bar */}
        <div className="bg-[#626262] text-white px-4 py-[29px] text-lg font-semibold border border-b-0 border-gray-300 text-[30px]">View VCC Details</div>
        {/* Section Bar */}
        <div className="bg-white border-x border-t border-gray-300 px-4 py-2 font-bold text-red-700 border-b-0 text-[25px]">VCC/Vehicle Details</div>
        {/* Details Card */}
        <div className="bg-white border border-gray-300 rounded-b-md p-1">
          <div className="bg-gray-100 py-3 px-6">
            {/* Responsive paired two-column layout on md+, single column on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Row 1 */}
              <Detail label="VCC No" value={vehicle.vccNo} />
              <div className="flex text-[21px]">
                <span className="min-w-[140px] text-gray-600 font-medium">VCC Status :</span>
                <span className="ml-2 font-bold text-red-600">Printed/Downloaded</span>
              </div>
              {/* Row 2 */}
              <Detail label="VCC Generation Date" value={formatDateDMY(vehicle.vccGenerationDate)} />
              <Detail label="Chassis No" value={vehicle.chassisNo} />
              {/* Row 3 */}
              <Detail label="Engine Number" value={vehicle.engineNumber || ''} />
              <Detail label="Year of Built" value={vehicle.yearOfBuilt} />
              {/* Row 4 */}
              <Detail label="Vehicle Drive" value={vehicle.vehicleDrive} />
              <Detail label="Country of Origin" value={vehicle.countryOfOrigin} />
              {/* Row 5 */}
              <Detail label="Engine Capacity" value={vehicle.engineCapacity || ''} />
              <Detail label="Carriage Capacity" value={vehicle.carriageCapacity || ''} />
              <Detail label="Passenger Capacity" value={vehicle.passengerCapacity || ''} />
              {/* Row 6 */}
              <Detail label="Vehicle Model" value={vehicle.vehicleModel} />
              <Detail label="Vehicle Brand Name" value={vehicle.vehicleBrandName} />
              {/* Row 7 */}
              <Detail label="Vehicle Type" value={vehicle.vehicleType} />
              <Detail label="Vehicle Color" value={vehicle.vehicleColor} />
              {/* Row 8 */}
              <Detail label="Specification Standard Name" value={vehicle.specificationStandardName} />
              <Detail label="Declaration Number" value={vehicle.declarationNumber} />
              {/* Row 9 */}
              <Detail label="Declaration Date" value={formatDateDMY(vehicle.declarationDate)} />
              <Detail label="Owner Code" value={vehicle.ownerCode} />
              {/* Row 10 */}
              <Detail label="Owner Name" value={vehicle.ownerName} />
              <div></div>
              {/* Print Remarks: always last, full width */}
              <div className="md:col-span-2 flex items-start text-[21px] mt-2">
                <span className="min-w-[140px] text-gray-600 font-medium">Print Remarks :</span>
                <span className="ml-2 whitespace-pre-line text-gray-700">{vehicle.printRemarks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Detail({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div className="flex text-[21px]">
      <span className="min-w-[140px] text-gray-600 font-medium">{label} :</span>
      <span className="ml-2 font-bold text-gray-700">{value || ''}</span>
    </div>
  );
}
