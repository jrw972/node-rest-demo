drop table if exists people;
create table people (
  id serial primary key,
  age int not null, -- non-negative
  enabled bool not null,
  firstname text not null, -- must begin upper
  lastname text not null -- must begin upper
);

insert into people (age, enabled, firstname, lastname) values
  (10, true, 'Abe', 'Arnold'),
  (11, false, 'Ben', 'Bowser'),
  (12, true, 'Calvin', 'Cool'),
  (13, false, 'Dan', 'Dudley'),
  (14, true, 'Ewen', 'Elder'),
  (15, false, 'Fred', 'Flinstone');
