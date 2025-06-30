<script lang="ts" setup>
import type { LibraryI } from '#/library'
import { useProjectStore } from '@/stores/projectStore.ts'
import { useI18n } from 'vue-i18n'
import SearchUser from '@/components/utils/searchUser/SearchUser.vue'
import UserItem from '@/components/utils/userItem/UserItem.vue'
import type { UserRoleUser } from '#/project'
import { ref } from 'vue'

defineProps<{
    library: LibraryI
}>()

const { t } = useI18n()
const store = useProjectStore()

const fileInput = ref<HTMLInputElement | null>(null)

function handleFileChange(file: File) {
    // TODO: handle the loaded file
    console.log(file)
}

function onDrop(event: DragEvent) {
    event.preventDefault()
    if (event.dataTransfer?.files?.length) {
        const file = event.dataTransfer.files[0]
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
            handleFileChange(file)
        }
    }
}

function onFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files?.length) {
        const file = target.files[0]
        handleFileChange(file)
    }
}
</script>

<template>
    <QCard
        class="base-card library-card"
        flat
    >
        <QCardSection>
            <p>{{ library.name }}</p>
            <p>{{ library.alias }}</p>
            <p>{{ library.code }}</p>
        </QCardSection>

        <QCardSection>
            <p>{{ t('newProject.steps.libraries.instructors') }}</p>
            <SearchUser
                action="add"
                :allow-invitations="true"
                :invite-function="store.addInvitation"
                :library_id="library.id"
                :role="t('newProject.steps.libraries.instructors')"
                @add-user="({ user }) => store.addInstructor(user.id, library.id)"
            />
            <template v-if="Array.isArray(store.invitations)">
                <QItem
                    v-for="(invitation, index) in store.invitations.filter(
                        (el) => el.role === 'instructor' && el.library === library.id,
                    )"
                    :key="index"
                >
                    <QItemSection>
                        <!--{{ user.email || 'No email' }}-->
                        {{ invitation.email }} (invitation)
                    </QItemSection>
                    <QBtn @click="() => store.removeInvitation(invitation.email, 'instructor', library.id)"> - </QBtn>
                </QItem>
            </template>
            <UserItem
                v-for="(userRole, index) in store.roles.filter(
                    (el) => el.role === 'instructor' && el.library === library.id,
                )"
                :key="index"
                action="remove"
                :user="userRole.user"
                @remove-user="(user: UserRoleUser) => store.removeInstructor(user.id, library.id)"
            />
        </QCardSection>

        <QCardSection>
            <p>{{ t('newProject.steps.libraries.collection') }}</p>
            <div
                class="csv-dropzone"
                @click="fileInput?.click()"
                @dragover.prevent
                @drop="onDrop"
            >
                <input
                    ref="fileInput"
                    accept=".csv,text/csv"
                    style="display: none"
                    type="file"
                    @change="onFileChange"
                />
                <span>Drag & drop a CSV file here, or click to select</span>
            </div>
        </QCardSection>

        <QCardActions align="right">
            <!--TODO: ADD DELETE CONFIRMATION-->
            <QBtn
                flat
                @click="() => store.removeLibrary(library)"
            >
                <QIcon name="mdi-delete" />
            </QBtn>
        </QCardActions>
    </QCard>
</template>

<style scoped>
.q-card {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 4px solid #e4e4e4;
}

.csv-dropzone {
    border: 2px dashed #aaa;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    border-radius: 8px;
    background: #fafafa;
    transition: border-color 0.2s;
}

.csv-dropzone:hover {
    border-color: #1976d2;
}
</style>
