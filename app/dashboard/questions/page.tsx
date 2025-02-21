'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState, useMemo } from 'react';
import useSupabaseClient from '@/lib/supabase/client';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
  RowSelectionState,
} from '@tanstack/react-table';
import { ArrowUpDown, Trash2, Plus, Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useExamStore } from '@/lib/store';
import { getExams } from '@/lib/actions/exams/action';

interface Question {
  id: string;
  question_text: string;
  score: number;
  is_multiple_choice: boolean;
  created_at: string;
  created_by: string;
  answers: { id: string; text: string; is_correct: boolean }[];
}

const truncateText = (text: string, maxLength: number = 100) => {
  // For HTML content, strip tags before truncating
  const strippedText = text.replace(/<[^>]*>/g, '');
  if (strippedText.length <= maxLength) return strippedText;
  return strippedText.substring(0, maxLength) + '...';
};

const columns: ColumnDef<Question>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
  },
  {
    id: 'question',
    accessorFn: (row) => truncateText(row.question_text),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-left font-medium"
        >
          Question
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="max-w-[400px] py-2">
        {truncateText(row.original.question_text)}
      </div>
    ),
  },
  {
    accessorKey: 'score',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-center font-medium"
        >
          Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-center">{row.original.score}</div>,
  },
  {
    id: 'options',
    accessorFn: (row) => row.answers?.length || 0,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-center font-medium"
        >
          Options
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.original.answers?.length || 0}</div>
    ),
  },
  {
    accessorKey: 'is_multiple_choice',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-right font-medium"
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-right">
        {row.original.is_multiple_choice
          ? 'Multiple correct'
          : 'Single correct'}
      </div>
    ),
  },
];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [showExamDialog, setShowExamDialog] = useState(false);
  const [selectedExams, setSelectedExams] = useState<Set<string>>(new Set());
  const [examSearchQuery, setExamSearchQuery] = useState('');
  const supabase = useSupabaseClient();
  const exams = useExamStore((state) => state.exams);

  const filteredExams = useMemo(() => {
    if (!examSearchQuery.trim()) return exams;
    return exams?.filter((exam) =>
      exam.name.toLowerCase().includes(examSearchQuery.toLowerCase())
    );
  }, [exams, examSearchQuery]);

  const table = useReactTable({
    data: questions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return (
        value?.toString().toLowerCase().includes(filterValue.toLowerCase()) ??
        false
      );
    },
  });

  const handleDelete = async () => {
    try {
      const selectedRows = table.getSelectedRowModel().rows;
      const selectedIds = selectedRows.map((row) => row.original.id);

      const { error } = await supabase
        .from('questions')
        .delete()
        .in('id', selectedIds);

      if (error) throw error;

      // Remove deleted questions from state
      setQuestions((prev) => prev.filter((q) => !selectedIds.includes(q.id)));
      // Clear selection
      setRowSelection({});
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete questions'
      );
    }
  };

  const handleAddToExam = () => {
    setShowExamDialog(true);
  };

  const handleExamSelection = async () => {
    try {
      const selectedRows = table.getSelectedRowModel().rows;
      const selectedQuestionIds = selectedRows.map((row) => row.original.id);

      // Create exam_questions entries for each selected exam and question
      const examQuestionPairs = Array.from(selectedExams).flatMap((examId) =>
        selectedQuestionIds.map((questionId) => ({
          exam_id: examId,
          question_id: questionId,
        }))
      );

      const { error } = await supabase
        .from('exam_questions')
        .insert(examQuestionPairs);

      if (error) throw error;

      // Clear selections and close dialog
      setSelectedExams(new Set());
      setRowSelection({});
      setShowExamDialog(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to add questions to exams'
      );
    }
  };

  const toggleExam = (examId: string) => {
    const newSelection = new Set(selectedExams);
    if (newSelection.has(examId)) {
      newSelection.delete(examId);
    } else {
      newSelection.add(examId);
    }
    setSelectedExams(newSelection);
  };

  useEffect(() => {
    // Fetch exams if not in Zustand store
    const fetchExams = async () => {
      try {
        const { data: examsData, error: examsErr } = await getExams();
        if (examsErr) {
          throw examsErr;
        }
        useExamStore.getState().setExams(examsData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch exams');
      }
    };

    if (!exams || exams.length === 0) {
      fetchExams();
    }
  }, [exams]);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        // Fetch questions with their options
        const { data, error } = await supabase
          .from('questions')
          .select(
            `
            *,
            answers (
              id,
              answer_text,
              is_correct
            )
          `
          )
          .order('created_at', { ascending: false });

        if (error) throw error;

        setQuestions(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch questions'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [supabase]);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Questions</h1>
          <Button disabled>Add Question</Button>
        </div>
        <div className="text-center py-10">Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Questions</h1>
          <Button disabled>Add Question</Button>
        </div>
        <div className="text-center py-10 text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Questions</h1>
        <Link href="/dashboard/questions/new">
          <Button>Add Question</Button>
        </Link>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-10">
          No questions found. Create your first question!
        </div>
      ) : (
        <>
          {/* Search input */}
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search questions..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Action buttons */}
          {Object.keys(rowSelection).length > 0 && (
            <div className="flex gap-4 mb-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAddToExam}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add to Exam
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected ({Object.keys(rowSelection).length})
              </Button>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <Dialog
        open={showExamDialog}
        onOpenChange={(open) => {
          setShowExamDialog(open);
          if (!open) {
            setExamSearchQuery('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Questions to Exams</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search exams..."
                value={examSearchQuery}
                onChange={(e) => setExamSearchQuery(e.target.value)}
                className="max-w-full"
              />
            </div>
            {!exams || exams.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No exams found. Create an exam first.
              </div>
            ) : filteredExams.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No exams match your search.
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {filteredExams.map((exam) => (
                  <div key={exam.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedExams.has(exam.id)}
                      onCheckedChange={() => toggleExam(exam.id)}
                      id={`exam-${exam.id}`}
                    />
                    <label
                      htmlFor={`exam-${exam.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {exam.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowExamDialog(false);
                setExamSearchQuery('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExamSelection}
              disabled={selectedExams.size === 0}
            >
              Add to Selected Exams
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
