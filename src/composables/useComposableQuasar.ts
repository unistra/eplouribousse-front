import { type QNotifyCreateOptions, useQuasar } from 'quasar'

export function useComposableQuasar() {
    const quasar = useQuasar()

    const { dark, iconSet, lang, loading } = quasar

    const notify = (options: QNotifyCreateOptions | string) => {
        if (typeof options !== 'string' && options.type === 'negative' && !options.timeout) {
            options.timeout = 10000
        }
        return quasar.notify(options)
    }

    return {
        dark,
        iconSet,
        lang,
        loading,
        notify,
    }
}
