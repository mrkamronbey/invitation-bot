-- 'parallax' shablonini template_id chekloviga qo'shish.
alter table public.invitations drop constraint if exists invitations_template_check;
alter table public.invitations
  add constraint invitations_template_check
  check (template_id in ('classic', 'modern', 'minimal', 'floral', 'parallax'));
