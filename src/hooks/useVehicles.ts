import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../lib/vehicleService';
import { Vehicle } from '../types/vehicle';
import { useToast } from '@/hooks/use-toast';

export const useVehicles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vehicles, isLoading, error } = useQuery<Vehicle[]>({
    queryKey: ['vehicles'],
    queryFn: vehicleService.getAll
  });

  const createMutation = useMutation({
    mutationFn: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => vehicleService.create(vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: 'Vehicle created',
        description: 'Vehicle record has been created successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (vehicle: Vehicle) => vehicleService.update(vehicle.id, vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: 'Vehicle updated',
        description: 'Vehicle record has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => vehicleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: 'Vehicle deleted',
        description: 'Vehicle record has been deleted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    vehicles,
    isLoading,
    error,
    createVehicle: createMutation.mutate,
    updateVehicle: updateMutation.mutate,
    deleteVehicle: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehicleService.getById(id),
    enabled: !!id,
  });
};
