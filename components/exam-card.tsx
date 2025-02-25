'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus, Loader2, Clock, Trash2, Settings2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getMyStudents } from '@/lib/actions/teacher-student/action';
import { registerStudentForExam } from '@/lib/actions/exams/action';
import { useRouter } from 'next/navigation';

interface Student {
  user_id: string | null;
  full_name: string | null;
  email: string;
  phone_number: string | null;
  status?: 'active' | 'pending';
  invitation_id?: string | null;
  created_at?: string | null;
}

interface TeacherStudentResponse {
  data?: Student[];
  error?: string;
}

interface ExamCardProps {
  exam: {
    id: string;
    name: string;
    duration_minutes: number;
    created_at: string;
  };
}

export function ExamCard({ exam }: ExamCardProps) {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = (await getMyStudents()) as TeacherStudentResponse;
        if ('error' in response && response.error) {
          throw new Error(response.error);
        }
        if (response.data) {
          const activeStudents = response.data.filter(
            (student) => student.status === 'active' && student.user_id
          ) as Student[];
          setStudents(activeStudents);
        }
      } catch (error) {
        console.error('Failed to fetch students:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch students',
          variant: 'destructive',
        });
      }
    };

    if (inviteDialogOpen) {
      fetchStudents();
    }
  }, [inviteDialogOpen, toast]);

  const handleInviteStudent = async () => {
    if (!selectedStudentId) {
      toast({
        title: 'Error',
        description: 'Please select a student',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const selectedStudent = students.find(
        (student) => student.user_id === selectedStudentId
      );
      if (!selectedStudent) {
        throw new Error('Selected student not found');
      }

      const studentData = {
        user_id: selectedStudent.user_id as string,
        full_name: selectedStudent.full_name || 'Unknown',
        email: selectedStudent.email,
        phone_number: selectedStudent.phone_number || '',
      };

      const result = await registerStudentForExam(exam.id, studentData);
      if ('error' in result) {
        throw new Error(result.error);
      }

      toast({
        title: 'Success',
        description: 'Student registered for exam successfully',
      });

      setSelectedStudentId('');
      setInviteDialogOpen(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to register student';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async () => {
    try {
      setDeleteLoading(true);
      // TODO: Implement delete exam API call here
      const response = await fetch(`/api/exams/${exam.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete exam');
      }

      toast({
        title: 'Success',
        description: 'Exam deleted successfully',
      });
      setDeleteDialogOpen(false);
      // Optionally trigger a refresh of the exams list
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete exam';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{exam.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <p>Duration: {exam.duration_minutes} minutes</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <div className="flex gap-2">
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Student to {exam.name}</DialogTitle>
                <DialogDescription>
                  Select a student to invite to this exam.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4">
                  <Select
                    value={selectedStudentId}
                    onValueChange={setSelectedStudentId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.length === 0 ? (
                        <SelectItem value="no-students" disabled>
                          No students available
                        </SelectItem>
                      ) : (
                        students.map((student) => (
                          <SelectItem
                            key={student.user_id as string}
                            value={student.user_id as string}
                          >
                            {student.full_name || 'Unknown'} ({student.email})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleInviteStudent}
                  disabled={loading || !selectedStudentId}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    'Send Invitation'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="default"
            size="sm"
            onClick={() => router.push(`/dashboard/exams/${exam.id}/questions`)}
          >
            <Settings2 className="h-4 w-4 mr-2" />
            Manage Questions
          </Button>
        </div>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Exam</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this exam? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteExam}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  'Delete'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
