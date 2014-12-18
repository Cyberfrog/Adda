pragma foreign_keys = 'ON';
insert into users(email,name) 
	values ('dolly@ex.com','dolly'), ("ankur@ex.com",'ankur');
insert into login(email,password)
	values ('dolly@ex.com','dolly12345'), ("ankur@ex.com",'ankur12345');
insert into topics(name,description,start_time,email)
	values ("cricket","sachin tendulkar",123454,"dolly@ex.com");
insert into comments(content,topic_id,time,email)
	values ("hiiii",1,12345,"dolly@ex.com"),("hello",1,12345,"ankur@ex.com");
update users set start_topic_ids ="[1]" where email ='dolly@ex.com';
update users set join_topic_ids ="[1]" where email ='ankur@ex.com'; 
