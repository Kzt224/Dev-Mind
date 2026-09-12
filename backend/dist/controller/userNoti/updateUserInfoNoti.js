import { SendNotification } from "../notiAutoMation.controller.js";
export default class UserNoti extends SendNotification {
    userId;
    date;
    constructor({ date = '', userId = 0, socketIo = null, } = {}) {
        super({ socketIo });
        this.date = date;
        this.userId = userId;
    }
    async updatePasswordNoti() {
        try {
            const data = {
                header: "Alert: your password has changed",
                body: `Your password was changed on ${this.date}`,
                authorId: this.userId
            };
            await this.notiService.createAndEmitNotification(data, io);
        }
        catch (error) {
            console.error(`updatePasswordNoti failed for user ${this.userId}:`, error);
        }
    }
    async updateInfoNoti() {
        try {
            const data = {
                header: "Alert: your information was updated",
                body: `Your information was updated on ${this.date}`,
                authorId: this.userId
            };
            await this.notiService.createAndEmitNotification(data, io);
        }
        catch (error) {
            console.error(`updateInfoNoti failed for user ${this.userId}:`, error);
        }
    }
}
