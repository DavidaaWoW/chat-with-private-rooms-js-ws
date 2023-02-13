create table users (id int primary key auto_increment, name varchar(255) unique, status boolean, socket_id varchar(255));
create table chats (id varchar(255) primary key);
create table chat_user (id int primary key auto_increment, user_id int, chat_id varchar(255), foreign key (user_id) references users(id), foreign key (chat_id) references chats(id));
create table messages (id int primary key auto_increment, sender_id int, chat_id varchar(255), message_text text, sent_date datetime default CURRENT_TIMESTAMP, foreign key (sender_id) references users(id), foreign key (chat_id) references chats(id));
