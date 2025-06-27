
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVehicle } from '@/hooks/useVehicles';
import { VehicleDetails } from '@/components/vehicles/VehicleDetails';

export const PublicVehicleView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: vehicle, isLoading, error } = useVehicle(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading vehicle details...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The requested vehicle record could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Clearance Certificate</h1>
          <p className="text-muted-foreground">Public view of vehicle record</p>
        </div>
        <VehicleDetails vehicle={vehicle} />
      </div>
    </div>
  );
};
