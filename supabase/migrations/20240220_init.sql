-- Создаем таблицу для сообщений
create table public.messages (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    input_text text not null,
    style text not null,
    responses text [] not null,
    is_favorite boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Создаем таблицу для лимитов пользователей
create table public.user_limits (
    user_id uuid references auth.users primary key,
    daily_generations integer default 5 not null,
    premium boolean default false not null,
    last_reset timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Включаем Row Level Security
alter table public.messages enable row level security;
alter table public.user_limits enable row level security;
-- Создаем политики для messages
create policy "Users can view own messages" on public.messages for
select using (auth.uid() = user_id);
create policy "Users can insert own messages" on public.messages for
insert with check (auth.uid() = user_id);
create policy "Users can delete own messages" on public.messages for delete using (auth.uid() = user_id);
create policy "Users can update own messages" on public.messages for
update using (auth.uid() = user_id);
-- Создаем политики для user_limits
create policy "Users can view own limits" on public.user_limits for
select using (auth.uid() = user_id);
create policy "Users can update own limits" on public.user_limits for
update using (auth.uid() = user_id);
-- Создаем индексы для messages
create index messages_user_id_idx on public.messages(user_id);
create index messages_created_at_idx on public.messages(created_at desc);
create index messages_is_favorite_idx on public.messages(is_favorite);
-- Создаем индексы для user_limits
create index user_limits_last_reset_idx on public.user_limits(last_reset);
-- Функция для сброса дневных лимитов
create or replace function reset_daily_limits() returns void language plpgsql security definer as $$ begin
update public.user_limits
set daily_generations = case
        when premium then 50
        else 5
    end,
    last_reset = timezone('utc'::text, now())
where last_reset < date_trunc('day', timezone('utc'::text, now()));
end;
$$;
-- Функция для очистки старых сообщений
create or replace function cleanup_old_messages() returns void language plpgsql security definer as $$ begin
delete from public.messages
where created_at < now() - interval '30 days';
end;
$$;
-- Триггер для автоматического создания записи лимитов при регистрации
create or replace function create_user_limits() returns trigger language plpgsql security definer as $$ begin
insert into public.user_limits (user_id)
values (new.id);
return new;
end;
$$;
create trigger on_auth_user_created
after
insert on auth.users for each row execute function create_user_limits();