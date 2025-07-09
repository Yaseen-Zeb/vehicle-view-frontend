import { env } from '@/config/env';
import { Vehicle } from '../types/vehicle';

const API_URL = env.VITE_APP_BASE_URL

export const vehicleService = {
  async getAll(): Promise<Vehicle[]> {
    const response = await fetch(`${API_URL}/vehicles`);
    if (!response.ok) {
      const errorData = await response.json()

      const message = errorData?.error || "Something went wrong";

      const error = new Error(message);
      // @ts-ignore (Optional: attach more data if needed)
      error.details = errorData;

      throw error;
    }
    return response.json();
  },

  async getById(id: number): Promise<Vehicle> {
    const response = await fetch(`${API_URL}/vehicles/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch vehicle');
    }
    return response.json();
  },

  async create(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
    const response = await fetch(`${API_URL}/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicle),
    });

    if (!response.ok) {
      const errorData = await response.json()

      const message = errorData?.error || "Something went wrong";

      const error = new Error(message);
      // @ts-ignore (Optional: attach more data if needed)
      error.details = errorData;

      throw error;
    }

    return response.json();
  },

  async update(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle> {
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicle),
    });
    if (!response.ok) {
      const errorData = await response.json()

      const message = errorData?.error || "Something went wrong";

      const error = new Error(message);
      // @ts-ignore (Optional: attach more data if needed)
      error.details = errorData;

      throw error;
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json()

      const message = errorData?.error || "Something went wrong";

      const error = new Error(message);
      // @ts-ignore (Optional: attach more data if needed)
      error.details = errorData;

      throw error;
    }
  }
};
