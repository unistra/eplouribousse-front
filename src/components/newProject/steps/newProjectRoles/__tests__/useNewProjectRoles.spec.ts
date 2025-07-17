import { describe, test, vi } from 'vitest'

const mock = vi.hoisted(() => {
    return {
        notify: vi.fn(),
        t: vi.fn((key) => key),
        useNewProjectRoles: {
            roles: [],
            isAddUserLoading: false,
            onAddRole: vi.fn(),
            onAddInvitation: vi.fn(),
        },
    }
})

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: mock.t,
    }),
}))

vi.mock('@/composables/useComposableQuasar.ts', () => ({
    useComposableQuasar: () => ({
        notify: mock.notify,
    }),
}))

vi.mock('@/components/newProject/steps/newProjectRoles/useNewProjectRoles.ts', () => ({
    useNewProjectRole: () => ({}),
}))

describe('useNewProjectRoles', () => {
    test('TODO', () => {})
})
