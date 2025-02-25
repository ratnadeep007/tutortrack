-- Create exam invitations table
create table if not exists public.exam_invitations (
  id uuid default gen_random_uuid() primary key,
  exam_id uuid references public.exams(id) on delete cascade not null,
  email text not null,
  invited_by uuid references auth.users(id) on delete cascade not null,
  status text not null check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(exam_id, email)
);

-- Create or update the handle_updated_at function if it doesn't exist
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Create trigger for updated_at
drop trigger if exists handle_exam_invitations_updated_at on public.exam_invitations;
create trigger handle_exam_invitations_updated_at
  before update on public.exam_invitations
  for each row
  execute function public.handle_updated_at();

-- Add indexes for better performance
create index if not exists idx_exam_invitations_exam_id on public.exam_invitations(exam_id);
create index if not exists idx_exam_invitations_email on public.exam_invitations(email);
create index if not exists idx_exam_invitations_invited_by on public.exam_invitations(invited_by);
create index if not exists idx_exam_invitations_status on public.exam_invitations(status);
