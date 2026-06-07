import { createAndEmitNotification } from "../../libs/notificationService.js";
import { SendNotification } from "../notiAutoMation.controller.js";

class UserNoti extends SendNotification {
    private userId; 
    private date;
    constructor({
        date = '',
        userId = 0,
        socketIo = null,
    } = {}) {
        super({ socketIo });
        this.date = date;
        this.userId = userId;
    }
    async updatePasswordNoti() {
        try {
            await createAndEmitNotification(this.prisma, this.socketIo, {
                header: "Alert: your password has changed",
                body: `Your password was changed on ${this.date}`,
                authorId: this.userId
            });
        } catch (error) {
            console.error(`updatePasswordNoti failed for user ${this.userId}:`,error);
        }
    }
    async updateInfoNoti() {
        try {
            await createAndEmitNotification(this.prisma, this.socketIo, {
                header: "Alert: your information was updated",
                body: `Your information was updated on ${this.date}`,
                authorId: this.userId
            });
        } catch (error) {
            console.error(`updateInfoNoti failed for user ${this.userId}:`, error);
        }
    }
}
export default UserNoti;