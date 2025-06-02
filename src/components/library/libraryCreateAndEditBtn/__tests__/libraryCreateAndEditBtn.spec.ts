import { beforeEach, describe, expect, test, vi } from 'vitest'
import { QBtn, QInput, Quasar } from 'quasar'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { I18n } from 'vue-i18n'
import useI18nMock from '~/mocks/i18n.ts'
import LibraryCreateAndEditBtn from '@/components/library/libraryCreateAndEditBtn/LibraryCreateAndEditBtn.vue'
import type { Library } from '#/library.ts'

let i18n: I18n

const mock = vi.hoisted(() => {
    return {
        dialog: {
            isOpen: { value: false },
            open: vi.fn(),
            close: vi.fn(),
        },
        library: {
            id: 1,
            name: '',
            alias: '',
            code: '',
        },
        errors: {
            name: '',
            alias: '',
            code: '',
        },
        onSubmit: vi.fn(() => console.log('Form submittedddddddddddddddd')),
    }
})

vi.mock('@/components/library/libraryCreateAndEditBtn/useLibraryCreateAndEditBtn.ts', () => ({
    useLibraryCreateAndEditBtn: () => mock,
}))

describe('LibraryCreateAndEditBtn.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        const { i18nMock } = useI18nMock()
        i18n = i18nMock

        mock.library.name = ''
        mock.library.alias = ''
        mock.library.code = ''

        mock.dialog.isOpen.value = false
    })

    test('renders button with default label and icon', () => {
        const wrapper = mount(LibraryCreateAndEditBtn, {
            global: { plugins: [i18n, Quasar] },
        })

        const button = wrapper.findComponent(QBtn)
        expect(button.exists()).toBe(true)
        expect(button.props('icon')).toBe('mdi-plus')
        expect(wrapper.text()).toContain('Ajouter')
    })

    test('renders button with custom label and icon', () => {
        const wrapper = mount(LibraryCreateAndEditBtn, {
            props: {
                buttonLabel: 'Custom Label',
                buttonIcon: 'mdi-custom-icon',
            },
            global: { plugins: [i18n, Quasar] },
        })

        const button = wrapper.findComponent(QBtn)
        expect(button.props('icon')).toBe('mdi-custom-icon')
        expect(wrapper.text()).toContain('Custom Label')
    })

    test('opens dialog when button is clicked', async () => {
        const wrapper = mount(LibraryCreateAndEditBtn, {
            global: { plugins: [i18n, Quasar] },
        })

        await wrapper.findComponent(QBtn).trigger('click')

        await flushPromises()

        expect(mock.dialog.open).toHaveBeenCalled()
    })

    test('dialog renders with input fields and validation rules', async () => {
        mock.dialog.isOpen.value = true
        const wrapper = mount(LibraryCreateAndEditBtn, {
            global: { plugins: [i18n, Quasar] },
        })
        await nextTick()

        const inputs = wrapper.findAllComponents(QInput)
        expect(inputs).toHaveLength(3)

        inputs.forEach((input) => {
            expect(input.props('rules')).toBeTruthy()
        })

        expect(inputs[0].props('label')).toContain('Nom')
        expect(inputs[1].props('label')).toContain('Alias')
        expect(inputs[2].props('label')).toContain('Code')
    })

    test('pre-fills form when libraryToEdit is provided', async () => {
        const libraryToEdit: Library = {
            id: 'id',
            name: 'Lib A',
            alias: 'lib-a',
            code: '001',
        }

        mount(LibraryCreateAndEditBtn, {
            props: { libraryToEdit },
            global: { plugins: [i18n, Quasar] },
        })

        expect(mock.library.id).toBe('id')
        expect(mock.library.name).toBe('Lib A')
        expect(mock.library.alias).toBe('lib-a')
        expect(mock.library.code).toBe('001')
    })
})
