-- Smart Classroom v2 schema for Supabase. Run once in SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '',
 email text,
 role text not null default 'student' check(role in ('teacher','student')),
 grade smallint not null default 1 check(grade between 0 and 6),
 created_at timestamptz not null default now()
);
create table if not exists public.lessons (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 grade smallint not null default 0 check(grade between 0 and 6),
 content text not null default '',
 resource_url text,
 created_by uuid references public.profiles(id) on delete set null,
 created_at timestamptz not null default now()
);
create table if not exists public.assignments (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 grade smallint not null default 0 check(grade between 0 and 6),
 due_date date,
 description text not null default '',
 created_by uuid references public.profiles(id) on delete set null,
 created_at timestamptz not null default now()
);
create table if not exists public.attendance (
 id uuid primary key default gen_random_uuid(),
 student_id uuid not null references public.profiles(id) on delete cascade,
 date date not null default current_date,
 status text not null check(status in ('present','absent','late')),
 created_by uuid references public.profiles(id) on delete set null,
 created_at timestamptz not null default now()
);
create table if not exists public.submissions (
 id uuid primary key default gen_random_uuid(),
 assignment_id uuid not null references public.assignments(id) on delete cascade,
 student_id uuid not null references public.profiles(id) on delete cascade,
 answer text not null default '',
 mark numeric check(mark between 0 and 100),
 created_at timestamptz not null default now()
);
create table if not exists public.quizzes (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 grade smallint not null default 0 check(grade between 0 and 6),
 question text not null,
 options jsonb not null default '[]'::jsonb,
 correct_index integer not null check(correct_index > 0),
 created_by uuid references public.profiles(id) on delete set null,
 created_at timestamptz not null default now()
);
create table if not exists public.grades (
 id uuid primary key default gen_random_uuid(),
 quiz_id uuid not null references public.quizzes(id) on delete cascade,
 student_id uuid not null references public.profiles(id) on delete cascade,
 selected_index integer not null,
 score numeric not null check(score between 0 and 100),
 created_at timestamptz not null default now(),
 unique(quiz_id, student_id)
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into public.profiles(id,display_name,email,role,grade)
 values(new.id,coalesce(new.raw_user_meta_data->>'display_name',split_part(coalesce(new.email,''),'@',1)),new.email,'student',coalesce((new.raw_user_meta_data->>'grade')::smallint,1))
 on conflict(id) do nothing;
 return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_teacher()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.profiles where id=auth.uid() and role='teacher'); $$;

alter table public.profiles enable row level security;
alter table public.lessons enable row level security;
alter table public.assignments enable row level security;
alter table public.attendance enable row level security;
alter table public.submissions enable row level security;
alter table public.quizzes enable row level security;
alter table public.grades enable row level security;

drop policy if exists "profile read self or teacher" on public.profiles;
create policy "profile read self or teacher" on public.profiles for select to authenticated using(id=auth.uid() or public.is_teacher());
drop policy if exists "teacher update profiles" on public.profiles;
create policy "teacher update profiles" on public.profiles for update to authenticated using(public.is_teacher()) with check(public.is_teacher());

drop policy if exists "read matching lessons" on public.lessons;
create policy "read matching lessons" on public.lessons for select to authenticated using(public.is_teacher() or grade=0 or grade=(select grade from public.profiles where id=auth.uid()));
drop policy if exists "teacher insert lessons" on public.lessons;
create policy "teacher insert lessons" on public.lessons for insert to authenticated with check(public.is_teacher());
drop policy if exists "teacher update lessons" on public.lessons;
create policy "teacher update lessons" on public.lessons for update to authenticated using(public.is_teacher()) with check(public.is_teacher());
drop policy if exists "teacher delete lessons" on public.lessons;
create policy "teacher delete lessons" on public.lessons for delete to authenticated using(public.is_teacher());

drop policy if exists "read matching assignments" on public.assignments;
create policy "read matching assignments" on public.assignments for select to authenticated using(public.is_teacher() or grade=0 or grade=(select grade from public.profiles where id=auth.uid()));
drop policy if exists "teacher insert assignments" on public.assignments;
create policy "teacher insert assignments" on public.assignments for insert to authenticated with check(public.is_teacher());
drop policy if exists "teacher update assignments" on public.assignments;
create policy "teacher update assignments" on public.assignments for update to authenticated using(public.is_teacher()) with check(public.is_teacher());
drop policy if exists "teacher delete assignments" on public.assignments;
create policy "teacher delete assignments" on public.assignments for delete to authenticated using(public.is_teacher());

drop policy if exists "attendance read self or teacher" on public.attendance;
create policy "attendance read self or teacher" on public.attendance for select to authenticated using(public.is_teacher() or student_id=auth.uid());
drop policy if exists "teacher manage attendance" on public.attendance;
create policy "teacher manage attendance" on public.attendance for all to authenticated using(public.is_teacher()) with check(public.is_teacher());

drop policy if exists "submissions read self or teacher" on public.submissions;
create policy "submissions read self or teacher" on public.submissions for select to authenticated using(public.is_teacher() or student_id=auth.uid());
drop policy if exists "student submit own work" on public.submissions;
create policy "student submit own work" on public.submissions for insert to authenticated with check(student_id=auth.uid() and not public.is_teacher());
drop policy if exists "teacher grade submissions" on public.submissions;
create policy "teacher grade submissions" on public.submissions for update to authenticated using(public.is_teacher()) with check(public.is_teacher());
drop policy if exists "student delete own submission" on public.submissions;
create policy "student delete own submission" on public.submissions for delete to authenticated using(student_id=auth.uid() and mark is null);

drop policy if exists "read matching quizzes" on public.quizzes;
create policy "read matching quizzes" on public.quizzes for select to authenticated using(public.is_teacher() or grade=0 or grade=(select grade from public.profiles where id=auth.uid()));
drop policy if exists "teacher manage quizzes" on public.quizzes;
create policy "teacher manage quizzes" on public.quizzes for all to authenticated using(public.is_teacher()) with check(public.is_teacher());

drop policy if exists "grades read self or teacher" on public.grades;
create policy "grades read self or teacher" on public.grades for select to authenticated using(public.is_teacher() or student_id=auth.uid());
drop policy if exists "student insert own grade" on public.grades;
create policy "student insert own grade" on public.grades for insert to authenticated with check(student_id=auth.uid() and not public.is_teacher());
-- Promote your teacher account manually after creating it:
-- update public.profiles set role='teacher', grade=0, display_name='Teacher Name' where email='YOUR_EMAIL';
