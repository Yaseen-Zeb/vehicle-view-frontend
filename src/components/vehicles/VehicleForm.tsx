import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useVehicles } from '../../hooks/useVehicles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateVehicleData, Vehicle } from '@/types/vehicle';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';

const vehicleSchema = z.object({
  vccNo: z.string().min(1, 'VCC No is required'),
  vccGenerationDate: z.string().min(1, 'VCC Generation Date is required'),
  chassisNo: z.string().min(1, 'Chassis No is required'),
  engineNumber: z.string().optional(),
  yearOfBuilt: z.string().min(1, 'Year of Built is required'),
  vehicleDrive: z.string().min(1, 'Vehicle Drive is required'),
  countryOfOrigin: z.string().min(1, 'Country of Origin is required'),
  engineCapacity: z.string(),
  carriageCapacity: z.string(),
  passengerCapacity: z.string(),
  vehicleModel: z.string().min(1, 'Vehicle Model is required'),
  vehicleBrandName: z.string().min(1, 'Vehicle Brand Name is required'),
  vehicleType: z.string().min(1, 'Vehicle Type is required'),
  vehicleColor: z.string().min(1, 'Vehicle Color is required'),
  specificationStandardName: z.string().min(1, 'Specification Standard Name is required'),
  declarationNumber: z.string().min(1, 'Declaration Number is required'),
  declarationDate: z.string().min(1, 'Declaration Date is required'),
  ownerCode: z.string().min(1, 'Owner Code is required'),
  ownerName: z.string().min(1, 'Owner Name is required'),
  printRemarks: z.string()
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSuccess?: () => void;
}

const toDateInputValue = (dateStr: string) => {
  if (!dateStr) return '';
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateStr.slice(0, 10);
};

export const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, onSuccess }) => {
  const { createVehicle, updateVehicle, isCreating, isUpdating, error } = useVehicles();
  const isEditing = !!vehicle;

  // Track previous loading state
  const prevIsLoading = useRef(false);
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    // If previously loading and now not loading, and no error, call onSuccess
    if (prevIsLoading.current && !isLoading && !error) {
      onSuccess?.();
    }
    prevIsLoading.current = isLoading;
  }, [isLoading, error, onSuccess]);

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle
      ? {
        ...vehicle,
        vccGenerationDate: toDateInputValue(vehicle.vccGenerationDate),
        declarationDate: toDateInputValue(vehicle.declarationDate),
      }
      : {
        vccNo: '',
        vccGenerationDate: '',
        chassisNo: '',
        engineNumber: '',
        yearOfBuilt: '',
        vehicleDrive: '',
        countryOfOrigin: '',
        engineCapacity: '',
        carriageCapacity: '',
        passengerCapacity: '',
        vehicleModel: '',
        vehicleBrandName: '',
        vehicleType: '',
        vehicleColor: '',
        specificationStandardName: '',
        declarationNumber: '',
        declarationDate: '',
        ownerCode: '',
        ownerName: '',
        printRemarks: ''
      }
  });

  const onSubmit = (data: VehicleFormData) => {
    if (isEditing && vehicle) {
      updateVehicle({ ...data, id: vehicle.id, createdAt: vehicle.createdAt, updatedAt: vehicle.updatedAt } as Vehicle);
    } else {
      createVehicle(data as Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>);
    }
    // Do not call onSuccess here; it will be called in useEffect after mutation success
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vccNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      VCC No <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter VCC No" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vccGenerationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      VCC Generation Date <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chassisNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Chassis No <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Chassis No" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="engineNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engine Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Engine Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yearOfBuilt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Year of Built <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Year of Built" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleDrive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Vehicle Drive <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Vehicle Drive" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="countryOfOrigin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Country of Origin <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Country of Origin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="engineCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engine Capacity</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Engine Capacity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="carriageCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carriage Capacity</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Carriage Capacity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passengerCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passenger Capacity</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Passenger Capacity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Vehicle Model <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Vehicle Model" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleBrandName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Vehicle Brand Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Vehicle Brand Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Vehicle Type <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Vehicle Type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Vehicle Color <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Vehicle Color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specificationStandardName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Specification Standard Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Specification Standard Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="declarationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Declaration Number <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Declaration Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="declarationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Declaration Date <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Owner Code <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Owner Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Owner Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Owner Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="printRemarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Print Remarks</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Print Remarks" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Vehicle' : 'Create Vehicle')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
