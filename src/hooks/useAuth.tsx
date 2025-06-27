
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/auth';
import { LoginCredentials } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: authService.getCurrentUser,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], data.user);
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const logout = () => {
    authService.logout();
    queryClient.setQueryData(['auth'], null);
    queryClient.clear();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    logout,
    isAuthenticated: !!user,
  };
};
