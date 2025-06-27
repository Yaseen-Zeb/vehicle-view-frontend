export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  vin: string;
  userId: number;
  vccNo: string;
  vccStatus: string;
  vccGenerationDate: string;
  chassisNo: string;
  engineNumber: string;
  yearOfBuilt: string;
  vehicleDrive: string;
  countryOfOrigin: string;
  engineCapacity: string;
  carriageCapacity: string;
  passengerCapacity: string;
  vehicleModel: string;
  vehicleBrandName: string;
  vehicleType: string;
  vehicleColor: string;
  specificationStandardName: string;
  declarationNumber: string;
  declarationDate: string;
  ownerCode: string;
  ownerName: string;
  printRemarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleData extends Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'> {}

export interface UpdateVehicleData extends Partial<CreateVehicleData> {
  id: string;
}
