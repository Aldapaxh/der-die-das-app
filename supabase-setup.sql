-- Tabla de perfiles: una fila por usuario registrado
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  is_premium boolean default false,
  created_at timestamp with time zone default now()
);

-- Activar seguridad por fila (cada usuario solo ve su propia fila)
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Función que crea automáticamente un perfil cuando alguien se registra
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger que ejecuta la función anterior en cada registro nuevo
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
