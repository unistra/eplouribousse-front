import { axiosI } from '@/plugins/axios/axios'
import { ref, useTemplateRef } from 'vue'
import type { ProjectInvitation } from '#/project.ts'
import type { Pagination } from '#/pagination.ts'
import type { UserSummarized } from '#/user.ts'
import type { QSelect, QSelectProps } from 'quasar'
import type { Roles } from '&/project.ts'
import { useUtils } from '@/composables/useUtils.ts'
import { emailRegex } from '@/utils/string.ts'

export type SearchUserProps = {
    role?: Roles
    usersSelected: UserSummarized[]
    invitationsSelected: ProjectInvitation[]
    isAddUserLoading?: boolean
    preventDeleteCurrentUser?: boolean
    disableInvitations?: boolean
    label?: string
    summaryMode?: boolean
}

export type SearchUserEmitActions = {
    (e: 'addInvitation', email: string): void
    (e: 'removeInvitation', invitation: ProjectInvitation): void
    (e: 'addUser', user: UserSummarized): void
    (e: 'removeUser', user: UserSummarized): void
}

export type SearchUserSendAction = (
    action: 'addInvitation' | 'removeInvitation' | 'addUser' | 'removeUser',
    payload?: { invitation?: ProjectInvitation; user?: UserSummarized; email?: string },
) => void

type MoreUsersOption = {
    moreUsers: boolean
    string: string
}
type InviteOption = {
    invite: boolean
    string: string
}

type UserSummarizeUniqueSetValues = UserSummarized | MoreUsersOption | InviteOption

export class UserSummarizeUniqueSet extends Set<UserSummarizeUniqueSetValues> {
    constructor(from?: UserSummarizeUniqueSetValues[]) {
        super(from)
    }

    has(item: UserSummarizeUniqueSetValues): boolean {
        for (const existing of this) {
            if (
                ('id' in item && 'id' in existing && existing.id === item.id) ||
                ('moreUsers' in item && 'moreUsers' in existing)
            ) {
                return true
            }
        }
        return false
    }

    add(value: UserSummarizeUniqueSetValues | UserSummarized[]): this {
        if (Array.isArray(value)) {
            value.forEach((item) => !this.has(item) && super.add(item))
            return this
        } else {
            return super.add(value)
        }
    }
}

export const useSearchUser = (props: SearchUserProps, emit: SearchUserEmitActions) => {
    const { useHandleError } = useUtils()

    const model = ref<UserSummarizeUniqueSetValues[]>([])
    const input = ref<string>('') // Value in the input field (the one used to filter)
    const selectRef = useTemplateRef<QSelect>('select')
    const options = ref<UserSummarizeUniqueSet>(new UserSummarizeUniqueSet())
    const userListLoading = ref<boolean>(false)

    const moreUsersOption = { moreUsers: true, string: '' }
    const inviteOption = { invite: true, string: '' }
    const removeUtilOptions = () => {
        options.value.delete(moreUsersOption)
        options.value.delete(inviteOption)
    }

    const pageSize: number = 5
    const nextPage = ref<number | null>(1)
    const addingMoreUsersHelper = ref<boolean>(false) // used to help the function to know we are adding a user

    const fetchUsers = async () => {
        userListLoading.value = true
        try {
            const response = await axiosI.get<Pagination<UserSummarized>>(`/users/`, {
                params: {
                    search: input.value,
                    exclude: props.usersSelected.map((user) => user.id),
                    page_size: pageSize,
                    page: addingMoreUsersHelper.value ? nextPage.value : 1,
                },
            })
            removeUtilOptions() // Clean the set to only have UserSummarized objects
            if (!addingMoreUsersHelper.value) {
                options.value.clear() // If we are NOT adding more user to the set, this means the fetchUsers is triggered by the filterFn
            }

            if (response.data.results.length) {
                options.value.add(response.data.results)
                if (response.data.results.length === pageSize && response.data.next) {
                    moreUsersOption.string = input.value
                    options.value.add(moreUsersOption) // Add "Add more user" option at the end of the options to append next users if needed
                    nextPage.value = response.data.next // Store nextPage to reuse it if the user press on moreUserOption
                }
            } else {
                if (emailRegex.test(input.value)) {
                    inviteOption.string = input.value
                    options.value.add(inviteOption)
                }
            }
        } catch (e) {
            options.value.clear()
            useHandleError(e)
        } finally {
            userListLoading.value = false
            addingMoreUsersHelper.value = false
        }
    }

    const selectFilterFn: QSelectProps['onFilter'] = (_, update, abort) => {
        if (!input.value) {
            clear()
            return abort()
        }
        update(() => fetchUsers())
    }

    const sendAction: SearchUserSendAction = (action, payload) => {
        if (action === 'addInvitation') emit('addInvitation', payload?.email || '')
        else if (payload?.invitation && action === 'removeInvitation') emit('removeInvitation', payload.invitation)
        else if (payload?.user && action === 'addUser') emit('addUser', payload.user)
        else if (payload?.user && action === 'removeUser') emit('removeUser', payload.user)
    }

    const onOptionSelected: QSelect['onAdd'] = async ({ value }) => {
        if ('displayName' in value) sendAction('addUser', { user: value })

        if ('moreUsers' in value) {
            addingMoreUsersHelper.value = true
            selectRef.value?.updateInputValue(value.string) // When user click on moreUsersOption, the input is reset to '', so we refill it with the value and trigger the filter
            return
        }
        if ('invite' in value) sendAction('addInvitation', { email: value.string })

        clear()
        selectRef.value?.hidePopup()
    }

    const clear = () => {
        options.value.clear()
        input.value = ''
        nextPage.value = 1
        selectRef.value?.updateInputValue('', true)
    }

    return {
        model,
        selectRef,
        input,
        userListLoading,
        nextPage,
        sendAction,
        options,
        selectFilterFn,
        clear,
        onOptionSelected,
    }
}
