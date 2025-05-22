import { beforeEach, describe, expect, test, vi } from 'vitest'
import { QBtn, QDialog, QInput, Quasar } from 'quasar'
import { mount } from '@vue/test-utils'
import type { I18n } from 'vue-i18n'
import useI18nMock from '~/mocks/i18n.ts'
import { ref } from 'vue'
import LibraryCreateButtonWithDialog from '@/components/library/libraryCreateButtonWithDialog/LibraryCreateButtonWithDialog.vue'

let i18n: I18n
const mock = vi.hoisted(() => {
    return {
        library: {
            name: '',
            alias: '',
            code: '',
        },
        createLibrary: vi.fn(),
        openDialog: vi.fn(),
    }
})

const dialogRef = ref(false)
mock.openDialog.mockImplementation(() => {
    dialogRef.value = true
})

vi.mock('@/components/library/libraryCreateButtonWithDialog/useLibraryCreateButtonWithDialog.ts', () => ({
    useLibraryCreateButtonWithDialog: () => ({
        library: mock.library,
        dialog: dialogRef,
        createLibrary: mock.createLibrary,
        openDialog: mock.openDialog,
    }),
}))

describe('LibraryCreateButtonWithDialog', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        const { i18nMock } = useI18nMock()
        i18n = i18nMock

        mock.library = {
            name: '',
            alias: '',
            code: '',
        }
        dialogRef.value = false

        // Mock scrollTo method which is not implemented in JSDOM
        window.scrollTo = vi.fn()
    })

    test('renders button with default label and icon', () => {
        const wrapper = mount(LibraryCreateButtonWithDialog, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        const button = wrapper.findComponent(QBtn)
        expect(button.exists()).toBe(true)
        expect(button.props('icon')).toBe('mdi-plus')
        expect(wrapper.text()).toContain('Ajouter une bibliothèque')
    })

    test('renders button with custom label and icon', () => {
        const wrapper = mount(LibraryCreateButtonWithDialog, {
            props: {
                buttonLabel: 'Custom Label',
                buttonIcon: 'mdi-custom-icon',
            },
            global: {
                plugins: [i18n, Quasar],
            },
        })

        const button = wrapper.findComponent(QBtn)
        expect(button.exists()).toBe(true)
        expect(button.props('icon')).toBe('mdi-custom-icon')
        expect(wrapper.text()).toContain('Custom Label')
    })

    test('opens dialog when button is clicked', async () => {
        const wrapper = mount(LibraryCreateButtonWithDialog, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        await wrapper.findComponent(QBtn).trigger('click')

        expect(mock.openDialog).toHaveBeenCalledOnce()
        expect(dialogRef.value).toBe(true)

        const dialog = wrapper.findComponent(QDialog)
        expect(dialog.exists()).toBe(true)
        expect(dialog.props('modelValue')).toBe(true)
    })

    test('dialog contains three input fields', async () => {
        const wrapper = mount(LibraryCreateButtonWithDialog, {
            global: {
                plugins: [i18n, Quasar],
            },
        })

        await wrapper.findComponent(QBtn).trigger('click')

        const inputs = wrapper.findAllComponents(QInput)

        expect(inputs).toHaveLength(3)
        expect(inputs[0].props('label')).toContain('Nom')
        expect(inputs[1].props('label')).toContain('Alias')
        expect(inputs[2].props('label')).toContain('Code ou identifiant')

        inputs.forEach((input) => {
            const rules = input.props('rules')
            expect(rules).toBeTruthy()
            expect(rules?.length).toBeGreaterThanOrEqual(1)
        })
    })
})
