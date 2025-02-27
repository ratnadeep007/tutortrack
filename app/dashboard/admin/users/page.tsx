'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useSupabaseClient from '@/lib/supabase/client';
import { Loader2, Trash2, Pencil } from 'lucide-react';
import { RoleSelector } from '@/components/role-selector';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface User {
  user_id: string;
  full_name: string;
  role: string;
  phone_number: string;
  created_at: string;
  email: string;
}

export default function UsersPage() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone_number: '',
  });
  const { toast } = useToast();

  const handleRoleChange = async (userId: string, newRole: string) => {
    const updatedUsers = users.map((user) =>
      user.user_id === userId ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('user_id', userToDelete.user_id);

      if (error) {
        throw error;
      }

      setUsers(users.filter((user) => user.user_id !== userToDelete.user_id));
      toast({
        title: 'User deleted',
        description: `${userToDelete.full_name} has been deleted successfully.`,
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUserToDelete(null);
    }
  };

  const handleEditUser = async () => {
    if (!userToEdit) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: editForm.full_name,
          phone_number: editForm.phone_number,
        })
        .eq('user_id', userToEdit.user_id);

      if (error) {
        throw error;
      }

      setUsers(
        users.map((user) =>
          user.user_id === userToEdit.user_id
            ? {
                ...user,
                full_name: editForm.full_name,
                phone_number: editForm.phone_number,
              }
            : user
        )
      );

      toast({
        title: 'User updated',
        description: 'User information has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUserToEdit(null);
    }
  };

  useEffect(() => {
    async function checkAdminAndLoadUsers() {
      try {
        // Check if user is admin
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push('/dashboard');
          return;
        }

        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('auth_user_id', user.id)
          .single();

        if (userData?.role !== 'admin') {
          router.push('/dashboard');
          return;
        }

        setIsAdmin(true);

        // Fetch users
        const { data: usersData, error } = await supabase
          .from('users')
          .select(
            `
            user_id,
            full_name,
            role,
            phone_number,
            email,
            created_at
          `
          )
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching users:', error);
          return;
        }

        setUsers(usersData || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    checkAdminAndLoadUsers();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell className="font-medium">{user.full_name}</TableCell>
                <TableCell>
                  <RoleSelector
                    userId={user.user_id}
                    currentRole={user.role}
                    onRoleChange={(newRole) =>
                      handleRoleChange(user.user_id, newRole)
                    }
                  />
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone_number}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setUserToEdit(user);
                        setEditForm({
                          full_name: user.full_name,
                          phone_number: user.phone_number,
                        });
                      }}
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setUserToDelete(user)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {userToDelete?.full_name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!userToEdit}
        onOpenChange={(open) => {
          if (!open) setUserToEdit(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user&apos;s name and phone number.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editForm.full_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, full_name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={editForm.phone_number}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone_number: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToEdit(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
