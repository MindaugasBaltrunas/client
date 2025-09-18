
export const createQueryKeys = <T extends string>(entity: T) => {
    return {
        all: [entity] as const,

        lists: (filters?: Record<string, unknown>) =>
            filters
                ? [...createQueryKeys(entity).all, 'list', filters] as const
                : [...createQueryKeys(entity).all, 'list'] as const,

        details: () => [...createQueryKeys(entity).all, 'detail'] as const,

        detail: (id: string) => [...createQueryKeys(entity).details(), id] as const,

        history: (id: string) => [...createQueryKeys(entity).all, 'history', id] as const,

        search: (params: { trackingId?: string; status?: number }) =>
            [...createQueryKeys(entity).all, 'search', params] as const,

        status: (status: string | number) => [...createQueryKeys(entity).all, 'status', status] as const,
    };
};