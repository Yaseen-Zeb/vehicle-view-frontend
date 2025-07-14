import { useState, useEffect } from "react";
import { Eye, Edit, Trash2, Download, QrCode, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useVehicles } from "@/hooks/useVehicles";
import { Vehicle } from "@/types/vehicle";
import { VehicleForm } from "./VehicleForm";
import { VehicleDetails } from "./VehicleDetails";
import { generateVehiclePDF, generateVehiclePDFBlob } from "./VehiclePDF";
import { useToast } from "@/hooks/use-toast";

export const VehicleTable = () => {
  const { vehicles = [], isLoading, deleteVehicle, error } = useVehicles();
  const { toast } = useToast();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [duplicateVehicle, setDuplicateVehicle] = useState<Vehicle | null>(null);

  // Generate PDF preview for the first vehicle
  useEffect(() => {
    const generatePreview = async () => {
      if (vehicles.length > 0) {
        try {
          const blob = await generateVehiclePDFBlob(vehicles[0]);
          if (blob) {
            const url = URL.createObjectURL(blob);
            setPdfUrl((prevUrl) => {
              // Clean up previous URL
              if (prevUrl) {
                URL.revokeObjectURL(prevUrl);
              }
              return url;
            });
          }
        } catch (error) {
          console.error('Error generating PDF preview:', error);
        }
      } else {
        setPdfUrl((prevUrl) => {
          // Clean up if no vehicles
          if (prevUrl) {
            URL.revokeObjectURL(prevUrl);
          }
          return null;
        });
      }
    };

    generatePreview();
  }, [vehicles]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleDelete = (vehicle: Vehicle) => {
    if (confirm(`Are you sure you want to delete vehicle ${vehicle.vccNo}?`)) {
      deleteVehicle(vehicle.id);
    }
  };

  const handleShowQR = (vehicle: Vehicle) => {
    const publicUrl = `${window.location.origin}/public/vehicle/${vehicle.id}`;
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: "Public URL Copied",
      description: "The public URL has been copied to your clipboard.",
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

  if (error) {
    return <p>{error.message}</p>
  }

  return (
    <Card className="py-1">
      {/* {pdfUrl ? (
          <div className="mb-4">
            <div className="text-lg font-semibold mb-2 px-4">PDF Preview - {vehicles[0]?.vccNo}</div>
            <iframe 
              src={pdfUrl} 
              width="100%" 
              height="600" 
              style={{ border: '1px solid #ccc' }}
              title="PDF Preview"
            />
          </div>
        ) : vehicles.length > 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Generating PDF preview...
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No vehicles available to preview.
          </div>
        )}  */}
     

      <CardContent className="p-0">
        {vehicles.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No vehicles found. Add your first vehicle record.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap max-w-[120px] truncate">VCC No</TableHead>
                  <TableHead className="whitespace-nowrap max-w-[150px] truncate">Brand</TableHead>
                  <TableHead className="whitespace-nowrap max-w-[200px] truncate">Model</TableHead>
                  <TableHead className="whitespace-nowrap max-w-[120px] truncate">Year</TableHead>
                  <TableHead className="whitespace-nowrap max-w-[120px] truncate">Color</TableHead>
                  <TableHead className="whitespace-nowrap max-w-[200px] truncate">Owner</TableHead>
                  <TableHead className="whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium max-w-[120px] truncate">
                      {vehicle.vccNo}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {vehicle.vehicleBrandName}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {vehicle.vehicleModel}
                    </TableCell>
                    <TableCell className="max-w-[120px] truncate">
                      {vehicle.yearOfBuilt}
                    </TableCell>
                    <TableCell className="max-w-[120px] truncate">
                      {vehicle.vehicleColor}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {vehicle.ownerName}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Dialog
                          open={isViewDialogOpen}
                          onOpenChange={setIsViewDialogOpen}
                        >
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
                            {selectedVehicle && (
                              <VehicleDetails vehicle={selectedVehicle} />
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateVehiclePDF(vehicle)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShowQR(vehicle)}
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const { id, createdAt, updatedAt, ...rest } = vehicle;
                            setDuplicateVehicle(rest as Vehicle);
                            setIsDuplicateDialogOpen(true);
                          }}
                        >
                          <Copy />
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



      <Dialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      >

        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Vehicle</DialogTitle>
          </DialogHeader>
          {selectedVehicle && (
            <VehicleForm
              action="edit"
              vehicle={selectedVehicle}
            />
          )}
        </DialogContent>
      </Dialog>











      {/* Duplicate Vehicle Dialog */}
      <Dialog open={isDuplicateDialogOpen} onOpenChange={setIsDuplicateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Duplicate Vehicle</DialogTitle>
          </DialogHeader>
          {duplicateVehicle && (
            <VehicleForm
              action="duplicate"
              vehicle={duplicateVehicle}
              onSuccess={() => {
                setIsDuplicateDialogOpen(false);
                setDuplicateVehicle(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
