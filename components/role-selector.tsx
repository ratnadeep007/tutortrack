import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import useSupabaseClient from '@/lib/supabase/client';

interface RoleSelectorProps {
  userId: string;
  currentRole: string;
  onRoleChange: (newRole: string) => void;
}

export function RoleSelector({
  userId,
  currentRole,
  onRoleChange,
}: RoleSelectorProps) {
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRoleChange = async (newRole: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      onRoleChange(newRole);
      toast({
        title: 'Role updated',
        description: `User role has been updated to ${newRole}`,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Select
      defaultValue={currentRole}
      onValueChange={handleRoleChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[110px] capitalize">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="student">Student</SelectItem>
        <SelectItem value="teacher">Teacher</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}
