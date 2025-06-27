import { useState } from 'react';
import { Eye, Edit, Trash2, Download, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useVehicles } from '@/hooks/useVehicles';
import { Vehicle } from '@/types/vehicle';
import { VehicleForm } from './VehicleForm';
import { VehicleDetails } from './VehicleDetails';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import VehiclePDF from './VehiclePDF';
import { useToast } from '@/hooks/use-toast';

export const VehicleTable = () => {
  const { vehicles, isLoading, deleteVehicle } = useVehicles();
  const { toast } = useToast();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleDelete = (vehicle: Vehicle) => {
    if (confirm(`Are you sure you want to delete vehicle ${vehicle.vccNo}?`)) {
      deleteVehicle(vehicle.id);
    }
  };

  const handleShowQR = (vehicle: Vehicle) => {
    const publicUrl = `${window.location.origin}/public/vehicle/${vehicle.id}`;
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: 'Public URL Copied',
      description: 'The public URL has been copied to your clipboard.',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading vehicles...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='py-1'>
      {/* <PDFViewer width="100%" height={600}>
        <VehiclePDF vehicle={vehicles[0]} />
      </PDFViewer> */}
      <CardContent className='p-0'>
        {vehicles.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No vehicles found. Add your first vehicle record.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='whitespace-nowrap'>VCC No</TableHead>
                  <TableHead className='whitespace-nowrap'>Brand</TableHead>
                  <TableHead className='whitespace-nowrap'>Model</TableHead>
                  <TableHead className='whitespace-nowrap'>Year</TableHead>
                  <TableHead className='whitespace-nowrap'>Color</TableHead>
                  <TableHead className='whitespace-nowrap'>Owner</TableHead>
                  <TableHead className='whitespace-nowrap'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.vccNo}</TableCell>
                    <TableCell>{vehicle.vehicleBrandName}</TableCell>
                    <TableCell>{vehicle.vehicleModel}</TableCell>
                    <TableCell>{vehicle.yearOfBuilt}</TableCell>
                    <TableCell>{vehicle.vehicleColor}</TableCell>
                    <TableCell>{vehicle.ownerName}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedVehicle(vehicle)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Vehicle Details</DialogTitle>
                            </DialogHeader>
                            {selectedVehicle && <VehicleDetails vehicle={selectedVehicle} />}
                          </DialogContent>
                        </Dialog>

                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedVehicle(vehicle)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Vehicle</DialogTitle>
                            </DialogHeader>
                            {selectedVehicle && (
                              <VehicleForm
                                vehicle={selectedVehicle}
                                onSuccess={() => setIsEditDialogOpen(false)}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        <PDFDownloadLink
                          document={<VehiclePDF vehicle={vehicle} />}
                          fileName={`VCC_${vehicle.vccNo}.pdf`}
                        >
                          {({ loading }) => (
                            <Button variant="outline" size="sm" disabled={loading}>
                              <Download className="h-4 w-4" />
                              {loading ? 'Generating...' : ''}
                            </Button>
                          )}
                        </PDFDownloadLink>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShowQR(vehicle)}
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(vehicle)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
