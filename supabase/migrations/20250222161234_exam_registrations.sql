-- Create exam_registrations table
CREATE TABLE exam_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id),
    student_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT,
    status TEXT NOT NULL DEFAULT 'registered',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_exam_email UNIQUE (exam_id, email)
);

-- Create indexes for better query performance
CREATE INDEX idx_exam_registrations_exam_id ON exam_registrations(exam_id);
CREATE INDEX idx_exam_registrations_user_id ON exam_registrations(user_id);
CREATE INDEX idx_exam_registrations_status ON exam_registrations(status);
CREATE INDEX idx_exam_registrations_email ON exam_registrations(email);

-- Create trigger for updating timestamps
CREATE TRIGGER update_exam_registrations_updated_at
    BEFORE UPDATE ON exam_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE exam_registrations ENABLE ROW LEVEL SECURITY;

-- Allow insert for anyone (students registering)
CREATE POLICY "Allow insert for anyone"
    ON exam_registrations
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

-- Allow select for exam creators and registered students
CREATE POLICY "Allow select for exam creators and registered students"
    ON exam_registrations
    FOR SELECT
    TO authenticated, anon
    USING (
        EXISTS (
            SELECT 1 FROM exams e
            WHERE e.id = exam_registrations.exam_id
            AND e.created_by = auth.uid()
        )
        OR
        user_id = (
            SELECT user_id FROM users WHERE auth_user_id = auth.uid()
        )
        OR
        email = current_setting('request.jwt.claims', true)::json->>'email'
    );

-- Allow update for registered students
CREATE POLICY "Allow update for registered students"
    ON exam_registrations
    FOR UPDATE
    TO authenticated, anon
    USING (
        user_id = (
            SELECT user_id FROM users WHERE auth_user_id = auth.uid()
        )
        OR
        email = current_setting('request.jwt.claims', true)::json->>'email'
    )
    WITH CHECK (
        (
            user_id = (
                SELECT user_id FROM users WHERE auth_user_id = auth.uid()
            )
            OR
            email = current_setting('request.jwt.claims', true)::json->>'email'
        )
        AND (
            NEW.status IN ('in_progress', 'completed')
            AND OLD.status != 'completed'
        )
    );

-- Grant necessary permissions
GRANT ALL ON exam_registrations TO authenticated, anon;

-- Create function to check if student is registered
CREATE OR REPLACE FUNCTION is_student_registered(exam_uuid UUID, student_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM exam_registrations
        WHERE exam_id = exam_uuid
        AND email = student_email
    );
END;
$$ language 'plpgsql'; 