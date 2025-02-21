-- Drop existing foreign key constraint from questions table
ALTER TABLE questions DROP CONSTRAINT questions_exam_id_fkey;
ALTER TABLE questions DROP COLUMN exam_id;

-- Create intermediate table for exam-question many-to-many relationship
CREATE TABLE exam_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exam_id, question_id)
);

-- Create indexes for the new table
CREATE INDEX idx_exam_questions_exam_id ON exam_questions(exam_id);
CREATE INDEX idx_exam_questions_question_id ON exam_questions(question_id);

-- Create trigger for updating timestamps on exam_questions
CREATE TRIGGER update_exam_questions_updated_at
    BEFORE UPDATE ON exam_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions for the new table
GRANT ALL ON public.exam_questions TO postgres, authenticated, anon, service_role;
