interface RegisterMethod {
    name: string;
    method: ((c: Container) => any) | null;
}

export class Container {
    private services = new Map<string, any>();

    register(params: RegisterMethod[]) {
        if (Array.isArray(params)) {
            params.forEach(item => {
                this.services.set(item.name, item.method);
            });
        }
    }

    get(name: string): any {
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