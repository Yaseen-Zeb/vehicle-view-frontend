import { useParams } from 'react-router-dom';
import { useVehicle } from '@/hooks/useVehicles';

// Utility to format date as DD/MM/YYYY
const formatDateDMY = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
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
    <div className="max-w-6xl mx-auto min-h-screen  md:mt-7   m-1 font-[Poppins, sans-serif]">
      <div className="  border-2 border-gray-300 p-1">
        <div className="bg-gray-100">
        {/* Header Bar */}
        <div className="bg-[#797979] text-white px-3 py-3 text-lg font-[700] border border-b-0 border-gray-300 text-[16px]">View VCC Details</div>
        {/* Section Bar */}
        <div className="bg-white  border-gray-300 px-3 py-2 text-[15px] font-[700] text-[#ab4848] border-b-0">VCC Vehicle Details</div>
        {/* Details Card */}
        <div className="bg-white border border-gray-300 rounded-b-md">
          <div className="bg-gray-100 py-3 px-3">
            {/* Responsive paired two-column layout on md+, single column on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5">
              {/* Row 1 */}
              <Detail label="VCC No" value={vehicle.vccNo} />
              <div className="flex text-[13px] md:space-x-32 space-x-20">
                <span className="min-w-[140px] font-medium">Status :</span>
                <span className="ml-2 font-semibold text-[#ff1e1e]">Printed/Downloaded</span>
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
              {/* Row 6 */}
              <Detail label="Vehicle Model" value={vehicle.vehicleModel} />
              <Detail label="Vehicle Brand Name" value={vehicle.vehicleBrandName} />
              {/* Row 7 */}
              <Detail label="Vehicle Type" value={vehicle.vehicleType} />
              <Detail label="Color" value={vehicle.vehicleColor} />
              {/* Row 8 */}
              <Detail label="Specification Standard Name" value={vehicle.specificationStandardName} />
              <Detail label="Declaration Number" value={vehicle.declarationNumber} />
              {/* Row 9 */}
              <Detail label="Declaration Date" value={formatDateDMY(vehicle.declarationDate)} />
              <Detail label="Owner Code" value={vehicle.ownerCode} />
              {/* Row 10 */}
              <Detail label="Owner Name" value={vehicle.ownerName} />
              <Detail label="Print Remarks" value={vehicle.printRemarks} />
             
              <div></div>
              {/* Print Remarks: always last, full width */}
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
    <div className="flex text-[13px] md:space-x-32 space-x-20 ">
      <span className="min-w-[140px] font-medium">{label} :</span>
      <span className="ml-2 font-semibold">{value || ''}</span>
    </div>
  );
}
