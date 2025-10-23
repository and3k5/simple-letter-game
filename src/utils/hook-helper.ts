export function createHookHelper() {
    const hooks = [];
    let current: string | undefined;
    return {
        set(v: string) {
            hooks.push(v);
            current = v;
        },
        getHistory() {
            return hooks.concat();
        },
    };
}

export type HookHelper = ReturnType<typeof createHookHelper>;
