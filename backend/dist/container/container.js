export class Container {
    services = new Map();
    register(params) {
        if (Array.isArray(params)) {
            params.forEach(item => {
                this.services.set(item.name, item.method);
            });
        }
    }
    get(name) {
        const serviceEntry = this.services.get(name);
        if (!serviceEntry) {
            throw new Error(`Service "${name}" not found in container. Register it first.`);
        }
        if (typeof serviceEntry === 'function') {
            const instance = serviceEntry(this);
            this.services.set(name, instance);
            return instance;
        }
        return serviceEntry;
    }
}
