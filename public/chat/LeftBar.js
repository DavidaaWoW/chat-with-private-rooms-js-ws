import hasInterfaceElements from "./hasInterfaceElements.js";

export default class LeftBar extends hasInterfaceElements {
    constructor(interfaceElements, slug, cookies) {
        super(interfaceElements, slug);
        this.cookies = cookies;
    }

    barInit(users, socket, curr_user){
        console.log(users.users);
        const usersBar = this.getInterfaceElementByName(this.slug["left_bar_slug"]);

        users.users.forEach(user => {
           const user_row = document.createElement('li');
           user_row.classList.add('row');
           usersBar.appendChild(user_row);

           const status = document.createElement('div');
           const statusBulb = document.createElement('div');
           status.classList.add('status');
           statusBulb.classList.add(this.slug["left_bar_user_status_slug"]+user.name);
           statusBulb.classList.add(user.status ? 'online-square' : 'offline-square');
           const username = document.createElement('div');
           username.classList.add('name');
           username.classList.add(this.slug["left_bar_username_slug"]+user.name);
           username.innerHTML = user.name;

           const notification = document.createElement('div');
           const not_off = document.createElement('div');
           notification.classList.add('notification');
           not_off.classList.add('not-off');
           not_off.classList.add('notification' + user.name);

           user_row.appendChild(status);
           user_row.appendChild(username);
           user_row.appendChild(notification);
           status.appendChild(statusBulb);
           notification.appendChild(not_off);

           user_row.addEventListener('click', (e) => {
               not_off.classList.remove('not-on');
               not_off.classList.add('not-off');
              socket.emit('getChat', {sender: curr_user, receiver: user.name});
           });
        });
    }

    changeUserStatus(username, status){
        const userStatus = document.querySelector('.'+this.slug["left_bar_user_status_slug"]+username);
        const statusBulb = this.getInterfaceElementByName(this.slug["central_bar_status_bulb_slug"]);
        if(status){
            userStatus.classList.remove('offline-square');
            userStatus.classList.add('online-square');
            statusBulb.style.color = 'green';
        } else {
            userStatus.classList.add('offline-square');
            userStatus.classList.remove('online-square');
            statusBulb.style.color = 'grey';


        }
        this.cookies.setCookie('receiver-status-color', statusBulb.style.color);
    }

    messageNotification(sender, receiver){
        if(receiver !== 'global'){
            const user_row = document.querySelector('.notification'+sender);
            user_row.classList.remove('not-off');
            user_row.classList.add('not-on');
        }
        else{
            const user_row = document.querySelector('.notificationGlobal');
            user_row.classList.remove('not-off');
            user_row.classList.add('not-on');
        }
    }

}