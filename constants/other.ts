import i18n from '@/plugins/i18n.ts'

export enum ContactObjects {
    // Value are related to translation key
    AskInfo = 'ask_info',
    Bug = 'bug',
    Complaint = 'complaint',
    Suggestion = 'suggestion',
    Review = 'review',
    Other = 'other',
}

const { t } = i18n.global
export const ContactObjectsLabels: Record<ContactObjects, string> = {
    [ContactObjects.AskInfo]: t('views.contact.subjects.ask_info'),
    [ContactObjects.Bug]: t('views.contact.subjects.bug'),
    [ContactObjects.Complaint]: t('views.contact.subjects.complaint'),
    [ContactObjects.Suggestion]: t('views.contact.subjects.suggestion'),
    [ContactObjects.Review]: t('views.contact.subjects.review'),
    [ContactObjects.Other]: t('common.other'),
}
