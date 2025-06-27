import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useVehicles } from '../../hooks/useVehicles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateVehicleData, Vehicle } from '@/types/vehicle';

const vehicleSchema = z.object({
  make: z.string(),
  model: z.string(),
  year: z.number(),
  vin: z.string(),
  userId: z.number(),
  vccNo: z.string().min(1, 'VCC No is required'),
  vccStatus: z.string().min(1, 'VCC Status is required'),
  vccGenerationDate: z.string().min(1, 'VCC Generation Date is required'),
  chassisNo: z.string().min(1, 'Chassis No is required'),
  engineNumber: z.string().min(1, 'Engine Number is required'),
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

  const { register, handleSubmit, formState: { errors } } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle
      ? {
          ...vehicle,
          vccGenerationDate: toDateInputValue(vehicle.vccGenerationDate),
          declarationDate: toDateInputValue(vehicle.declarationDate),
        }
      : undefined
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="make">Make</Label>
              <Input id="make" {...register('make')} />
              {errors.make && <p className="text-red-500">{errors.make.message}</p>}
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input id="model" {...register('model')} />
              {errors.model && <p className="text-red-500">{errors.model.message}</p>}
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Input id="year" type="number" {...register('year', { valueAsNumber: true })} />
              {errors.year && <p className="text-red-500">{errors.year.message}</p>}
            </div>
            <div>
              <Label htmlFor="vin">VIN</Label>
              <Input id="vin" {...register('vin')} />
              {errors.vin && <p className="text-red-500">{errors.vin.message}</p>}
            </div>
            <div>
              <Label htmlFor="userId">User ID</Label>
              <Input id="userId" type="number" {...register('userId', { valueAsNumber: true })} />
              {errors.userId && <p className="text-red-500">{errors.userId.message}</p>}
            </div>
            <div>
              <Label htmlFor="vccNo">VCC No</Label>
              <Input id="vccNo" {...register('vccNo')} />
              {errors.vccNo && <p className="text-red-500">{errors.vccNo.message}</p>}
            </div>
            <div>
              <Label htmlFor="vccStatus">VCC Status</Label>
              <Input id="vccStatus" {...register('vccStatus')} />
              {errors.vccStatus && <p className="text-red-500">{errors.vccStatus.message}</p>}
            </div>
            <div>
              <Label htmlFor="vccGenerationDate">VCC Generation Date</Label>
              <Input id="vccGenerationDate" type="date" {...register('vccGenerationDate')} />
              {errors.vccGenerationDate && <p className="text-red-500">{errors.vccGenerationDate.message}</p>}
            </div>
            <div>
              <Label htmlFor="chassisNo">Chassis No</Label>
              <Input id="chassisNo" {...register('chassisNo')} />
              {errors.chassisNo && <p className="text-red-500">{errors.chassisNo.message}</p>}
            </div>
            <div>
              <Label htmlFor="engineNumber">Engine Number</Label>
              <Input id="engineNumber" {...register('engineNumber')} />
              {errors.engineNumber && <p className="text-red-500">{errors.engineNumber.message}</p>}
            </div>
            <div>
              <Label htmlFor="yearOfBuilt">Year of Built</Label>
              <Input id="yearOfBuilt" {...register('yearOfBuilt')} />
              {errors.yearOfBuilt && <p className="text-red-500">{errors.yearOfBuilt.message}</p>}
            </div>
            <div>
              <Label htmlFor="vehicleDrive">Vehicle Drive</Label>
              <Input id="vehicleDrive" {...register('vehicleDrive')} />
              {errors.vehicleDrive && <p className="text-red-500">{errors.vehicleDrive.message}</p>}
            </div>
            <div>
              <Label htmlFor="countryOfOrigin">Country of Origin</Label>
              <Input id="countryOfOrigin" {...register('countryOfOrigin')} />
              {errors.countryOfOrigin && <p className="text-red-500">{errors.countryOfOrigin.message}</p>}
            </div>
            <div>
              <Label htmlFor="engineCapacity">Engine Capacity</Label>
              <Input id="engineCapacity" {...register('engineCapacity')} />
              {errors.engineCapacity && <p className="text-red-500">{errors.engineCapacity.message}</p>}
            </div>
            <div>
              <Label htmlFor="carriageCapacity">Carriage Capacity</Label>
              <Input id="carriageCapacity" {...register('carriageCapacity')} />
              {errors.carriageCapacity && <p className="text-red-500">{errors.carriageCapacity.message}</p>}
            </div>
            <div>
              <Label htmlFor="passengerCapacity">Passenger Capacity</Label>
              <Input id="passengerCapacity" {...register('passengerCapacity')} />
              {errors.passengerCapacity && <p className="text-red-500">{errors.passengerCapacity.message}</p>}
            </div>
            <div>
              <Label htmlFor="vehicleModel">Vehicle Model</Label>
              <Input id="vehicleModel" {...register('vehicleModel')} />
              {errors.vehicleModel && <p className="text-red-500">{errors.vehicleModel.message}</p>}
            </div>
            <div>
              <Label htmlFor="vehicleBrandName">Vehicle Brand Name</Label>
              <Input id="vehicleBrandName" {...register('vehicleBrandName')} />
              {errors.vehicleBrandName && <p className="text-red-500">{errors.vehicleBrandName.message}</p>}
            </div>
            <div>
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Input id="vehicleType" {...register('vehicleType')} />
              {errors.vehicleType && <p className="text-red-500">{errors.vehicleType.message}</p>}
            </div>
            <div>
              <Label htmlFor="vehicleColor">Vehicle Color</Label>
              <Input id="vehicleColor" {...register('vehicleColor')} />
              {errors.vehicleColor && <p className="text-red-500">{errors.vehicleColor.message}</p>}
            </div>
            <div>
              <Label htmlFor="specificationStandardName">Specification Standard Name</Label>
              <Input id="specificationStandardName" {...register('specificationStandardName')} />
              {errors.specificationStandardName && <p className="text-red-500">{errors.specificationStandardName.message}</p>}
            </div>
            <div>
              <Label htmlFor="declarationNumber">Declaration Number</Label>
              <Input id="declarationNumber" {...register('declarationNumber')} />
              {errors.declarationNumber && <p className="text-red-500">{errors.declarationNumber.message}</p>}
            </div>
            <div>
              <Label htmlFor="declarationDate">Declaration Date</Label>
              <Input id="declarationDate" type="date" {...register('declarationDate')} />
              {errors.declarationDate && <p className="text-red-500">{errors.declarationDate.message}</p>}
            </div>
            <div>
              <Label htmlFor="ownerCode">Owner Code</Label>
              <Input id="ownerCode" {...register('ownerCode')} />
              {errors.ownerCode && <p className="text-red-500">{errors.ownerCode.message}</p>}
            </div>
            <div>
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input id="ownerName" {...register('ownerName')} />
              {errors.ownerName && <p className="text-red-500">{errors.ownerName.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="printRemarks">Print Remarks</Label>
            <Input id="printRemarks" {...register('printRemarks')} />
            {errors.printRemarks && <p className="text-red-500">{errors.printRemarks.message}</p>}
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Vehicle' : 'Create Vehicle')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
