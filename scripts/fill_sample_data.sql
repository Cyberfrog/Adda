pragma foreign_keys = 'ON';
insert into users(email,name) 
	values ('dolly@ex.com','dolly'), ("ankur@ex.com",'ankur'),("dino@ex.com",'dino');
insert into login(email,password)
	values ('dolly@ex.com','dolly12345'), ("ankur@ex.com",'ankur12345'),("dino@ex.com","12345");
insert into topics(name,description,start_time,email)
	values("cricket","sachin tendulkar",123454,"dolly@ex.com"),
		("music","ar raheman",45555,"dolly@ex.com"),
	 ("racing","mikha singh",124342,"dolly@ex.com"),
	 ("boxing","merry com",12454,"dolly@ex.com"),
	 ("chess"," v.anad",14343,"dolly@ex.com"),
	 ("commedy","kapil sharma",55555,"dino@ex.com");
insert into comments(content,topic_id,time,email)
	values("hiiii",1,12345,"dolly@ex.com"),("hello",1,12346,"ankur@ex.com"),
	("hello",2,12347,"dolly@ex.com"),("hello",3,12355,"dolly@ex.com")
	,("hello",4,125555,"dolly@ex.com"),("hello",5,123565,"dolly@ex.com")
	,("hello",5,123556,"ankur@ex.com"),("hello",6,12356,"dino@ex.com");
update users set start_topic_ids ="[1]" where email ='dolly@ex.com';
update users set join_topic_ids ="[1]" where email ='ankur@ex.com'; 
update users set start_topic_ids ="[2]" where email ='dino@ex.com';
