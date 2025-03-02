-- Create exam_answers table to store student answers
CREATE TABLE exam_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_exam UNIQUE (user_id, exam_id)
);

-- Create indexes
CREATE INDEX idx_exam_answers_exam_id ON exam_answers(exam_id);
CREATE INDEX idx_exam_answers_user_id ON exam_answers(user_id);

-- Add trigger for updating timestamps
CREATE TRIGGER update_exam_answers_updated_at
    BEFORE UPDATE ON exam_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();