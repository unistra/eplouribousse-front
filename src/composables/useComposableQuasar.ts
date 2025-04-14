import { useQuasar } from 'quasar'

export function useComposableQuasar() {
    const quasar = useQuasar()

    const { dark, iconSet, lang, loading, notify } = quasar
    return {
        dark,
        iconSet,
        lang,
        loading,
        notify,
    }
}
