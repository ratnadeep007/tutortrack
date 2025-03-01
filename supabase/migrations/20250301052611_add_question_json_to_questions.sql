-- Add question_json column to questions table
ALTER TABLE questions
ADD COLUMN question_json JSONB;
