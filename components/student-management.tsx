'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Loader2, X, AlertCircle } from 'lucide-react';
import {
  getMyStudents,
  removeStudent,
  inviteStudentByEmail,
} from '@/lib/actions/teacher-student/action';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Student {
  user_id: string;
  full_name: string;
  email: string;
  phone_number: string;
}

export function StudentManagement() {
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [myStudents, setMyStudents] = useState<Student[]>([]);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMyStudents = useCallback(async () => {
    try {
      const response = await getMyStudents();
      if ('error' in response && response.error) {
        throw new Error(response.error);
      }
      if ('data' in response && Array.isArray(response.data)) {
        const students = response.data.map((student: unknown) => ({
          user_id: (student as { user_id: string }).user_id || '',
          full_name: (student as { full_name: string }).full_name || '',
          email: (student as { email: string }).email || '',
          phone_number:
            (student as { phone_number: string }).phone_number || '',
        }));
        console.log('students', students);
        setMyStudents(students);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to fetch students:', message);
      toast({
        title: 'Error',
        description: 'Failed to fetch students',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch my students on component mount
  useEffect(() => {
    fetchMyStudents();
  }, [fetchMyStudents]);

  // Reset invite error when dialog opens/closes
  useEffect(() => {
    if (!inviteDialogOpen) {
      setInviteError(null);
      setEmail('');
    }
  }, [inviteDialogOpen]);

  const handleInviteStudent = async () => {
    if (!email) {
      setInviteError('Please enter an email address');
      return;
    }

    try {
      setInviteLoading(true);
      setInviteError(null);
      const result = await inviteStudentByEmail(email);

      if ('error' in result) {
        setInviteError(result.error || 'Unknown error');
        return;
      }

      // Close the dialog on success
      setEmail('');
      setInviteDialogOpen(false);

      // Show appropriate toast message based on whether there's a warning
      if ('warning' in result) {
        toast({
          title: 'Invitation Sent',
          description: String(result.warning),
          variant: 'default',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Invitation sent successfully',
        });
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to send invitation';
      setInviteError(message);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    try {
      setLoading(true);
      const { error } = await removeStudent(studentId);
      if (error) throw new Error(error);

      toast({
        title: 'Success',
        description: 'Student removed successfully',
      });

      // Refresh the list of my students
      await fetchMyStudents();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to remove student:', message);
      toast({
        title: 'Error',
        description: 'Failed to remove student',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Students</h1>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New Student</DialogTitle>
              <DialogDescription>
                Enter the student&apos;s email address to send them an
                invitation. They will receive an email to create their account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {inviteError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{inviteError}</AlertDescription>
                </Alert>
              )}
              <div className="flex items-center gap-4">
                <Input
                  id="email"
                  placeholder="student@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleInviteStudent}
                disabled={inviteLoading || !email}
              >
                {inviteLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  'Send Invitation'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          <p className="mt-2 text-gray-500">Loading students...</p>
        </div>
      ) : myStudents.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No students added yet. Invite students to get started!
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myStudents.map((student) => (
              <TableRow key={student.user_id}>
                <TableCell>{student.full_name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.phone_number}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveStudent(student.user_id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
