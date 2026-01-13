<script lang="ts" setup>
import { type SearchUserEmitActions, type SearchUserProps, useSearchUser } from './useSearchUser'
import { useI18n } from 'vue-i18n'
import ProjectLibraryCardUserList from '@/components/project/libraries/card/ProjectLibraryCardUserList.vue'

const props = defineProps<SearchUserProps>()
const { t } = useI18n()
const emit = defineEmits<SearchUserEmitActions>()
const { model, input, options, sendAction, userListLoading, selectFilterFn, clear, onOptionSelected } = useSearchUser(
    props,
    emit,
)
</script>

<template>
    <div class="search-user">
        <p v-if="label">{{ label }}</p>
        <div v-if="!summaryMode">
            <!--- @input-value is used to to keep track of what is in the input field (the one used to filter) --->
            <QSelect
                ref="select"
                v-model="model"
                color="primary"
                dense
                hide-dropdown-icon
                hide-selected
                :input-debounce="500"
                :label="t('views.searchUser.inputPlaceholder')"
                :loading="userListLoading"
                multiple
                :options="Array.from(options.values())"
                outlined
                rounded
                use-input
                @add="onOptionSelected"
                @filter="selectFilterFn"
                @input-value="(val) => (input = val)"
            >
                <QTooltip :delay="1000">{{ t('views.searchUser.inputPlaceholder') }}</QTooltip>
                <template #prepend>
                    <QIcon name="mdi-magnify" />
                </template>
                <template #append>
                    <button
                        v-if="input.length"
                        :aria-label="t('views.searchUser.clearField')"
                        class="clear-icon"
                        @click="clear"
                    >
                        <QIcon name="mdi-close-circle" />
                    </button>
                </template>
                <template #option="scope">
                    <QItem
                        v-if="scope.opt.displayName"
                        v-bind="scope.itemProps"
                        :aria-label="t('views.searchUser.user.add', { user: scope.opt.displayName })"
                    >
                        <QItemSection avatar>
                            <QIcon name="mdi-account" />
                        </QItemSection>
                        <QItemSection>
                            <QItemLabel>{{ scope.opt.displayName }}</QItemLabel>
                        </QItemSection>
                    </QItem>
                    <QItem
                        v-if="scope.opt.moreUsers"
                        v-bind="scope.itemProps"
                    >
                        <QItemSection>
                            {{ t('views.searchUser.user.more') }}
                        </QItemSection>
                        <QItemSection avatar>
                            <QIcon name="mdi-plus" />
                        </QItemSection>
                    </QItem>
                    <QItem
                        v-else-if="scope.opt.invite"
                        v-bind="scope.itemProps"
                    >
                        <QItemSection avatar>
                            <QIcon name="mdi-email-fast-outline" />
                        </QItemSection>
                        <QItemSection
                            >{{ t('views.searchUser.sendInvite') }}: <span>{{ scope.opt.string }}</span>
                        </QItemSection>
                    </QItem>
                </template>
                <template #no-option>
                    <QItem>
                        <QItemSection v-if="userListLoading">
                            <QItemSection>
                                <QSkeleton type="text" />
                            </QItemSection>
                        </QItemSection>
                        <QItemSection v-else>
                            <QItemLabel>{{ t('views.searchUser.user.notFound') }}</QItemLabel>
                            <QItemLabel
                                v-if="!disableInvitations"
                                caption
                                >{{ t('views.searchUser.insertEmailForInvite') }}</QItemLabel
                            >
                        </QItemSection>
                    </QItem>
                </template>
            </QSelect>
        </div>

        <QInnerLoading
            v-if="!summaryMode"
            :showing="isAddUserLoading"
        />
        <ProjectLibraryCardUserList
            :invitations-selected
            :prevent-delete-current-user
            :send-action="sendAction"
            :summary-mode
            :users-selected
        />
    </div>
</template>

<style lang="sass" scoped>
.search-user
    position: relative
    display: flex
    flex-direction: column
    gap: 0.5rem

    .clear-icon
        opacity: 0.75
        display: flex
        align-items: center
        justify-content: center
        &:hover
            opacity: 1

    .q-item-label>span
        font-weight: bold

.q-skeleton
    width: 16rem
</style>
