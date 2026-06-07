import { Container } from "./container.js";
import { registerController } from "./controller.js";
import { registerServices } from "./services.js";


const container = new Container();

registerServices(container);
registerController(container);
export {container};