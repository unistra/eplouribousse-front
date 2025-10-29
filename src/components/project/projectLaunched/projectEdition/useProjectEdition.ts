import { reactive, toRefs } from 'vue'

const state = reactive<{ selectCollectionToShowEdition: string }>({
    selectCollectionToShowEdition: '',
})

export const useProjectEdition = () => {
    return {
        ...toRefs(state),
    }
}
