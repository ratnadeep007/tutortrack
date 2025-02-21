'use client';

import React, { useState } from 'react';
import { Clock, MoreVertical, Trash2, FileQuestion } from 'lucide-react';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useExamStore } from '@/lib/store';
import { deleteExam } from '@/lib/actions/exams/action';

interface ExamDetailsCardProps {
  id: string;
  title: string;
  duration_minutes: string;
}

export function ExamDetailCard({
  id,
  title,
  duration_minutes,
}: ExamDetailsCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteExamFromStore = useExamStore((state) => state.deleteExam);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const { error } = await deleteExam(id);
      if (error) {
        throw new Error(error);
      }
      deleteExamFromStore(id);
    } catch (error) {
      console.error('Error deleting exam:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full max-w-md transition-all duration-300 hover:shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center w-full">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-grey-100 flex flex-row items-center gap-2">
              <Clock className="h-4 w-4" />
              {duration_minutes} mins
            </div>
          </div>
        </div>
      </CardHeader>

      {/* <CardContent>
        <div className="space-y-4">
          <div className="overflow-hidden" >
              <div className="space-y-4 pt-2" >
                <div className="flex flex-col items-start justify-start text-sm text-gray-600">
                  <div>Questions: 10</div>
                  <div>Students: 20</div>
                </div>
              </div>
            </div>
        </div>
      </CardContent> */}

      <CardFooter>
        <div className="flex items-center justify-between w-full text-sm gap-3 text-gray-600 flex-wrap">
          <Button variant="default">View Results</Button>
          <Button variant="outline">Invite Student</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link
                  href={`/dashboard/exams/${id}/questions`}
                  className="flex items-center"
                >
                  <FileQuestion className="h-4 w-4 mr-2" />
                  Manage Questions
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Exam
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
}
