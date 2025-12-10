import i18n from '@/plugins/i18n.ts'

const { t } = i18n.global

export enum ProjectStatus {
    Draft = 10,
    Review = 20,
    Ready = 30,
    Launched = 40,
    Archived = 100,
}

export enum Roles {
    TenantSuperUser = 'tenant_super_user',
    ProjectCreator = 'project_creator',
    ProjectAdmin = 'project_admin',
    ProjectManager = 'project_manager',
    Instructor = 'instructor',
    Controller = 'controller',
    Guest = 'guest',
}

export const RolesLabels = {
    [Roles.TenantSuperUser]: t('fn.roles.superUser'),
    [Roles.ProjectCreator]: t('fn.roles.projectCreator'),
    [Roles.ProjectAdmin]: t('fn.roles.projectAdmin'),
    [Roles.ProjectManager]: t('fn.roles.projectManager'),
    [Roles.Instructor]: t('fn.roles.instructor'),
    [Roles.Controller]: t('fn.roles.controller'),
    [Roles.Guest]: t('fn.roles.guest'),
}
export enum Arbitration {
    NoPosition1 = 0,
    MultiplePosition1 = 1,
    NoArbitration = 2,
}

export enum ResourceStatus {
    Positioning = 10,
    Excluded = 15,
    InstructionBound = 20,
    AnomalyBound = 25,
    ControlBound = 30,
    InstructionUnbound = 40,
    AnomalyUnbound = 45,
    ControlUnbound = 50,
    Edition = 60,
}

export const CollectionPosition = {
    Excluded: 0,
    Position1: 1,
    Position2: 2,
    Position3: 3,
    Position4: 4,
    Undefined: null,
}

export type CollectionPosition = (typeof CollectionPosition)[keyof typeof CollectionPosition]

export enum AnomalyType {
    PubPeriodPassed = 'pub_period_passed',
    Discontinuous = 'discontinuous_segment',
    ExcpImprovable = 'excp_improvable',
    ChronologicalError = 'chronological_error',
    SegmentOverlap = 'segment_overlap',
    MisuseOfRemediatedLib = 'misuse_of_remediated_library',
    ConfusingWording = 'confusing_wording',
    Other = 'other',
}

export const AnomalyTypeLabels: Record<AnomalyType, string> = {
    [AnomalyType.PubPeriodPassed]: t('fn.anomaly.type.pubPeriodPassed'),
    [AnomalyType.Discontinuous]: t('fn.anomaly.type.discontinuousSegment'),
    [AnomalyType.ExcpImprovable]: t('fn.anomaly.type.excpImprovable'),
    [AnomalyType.ChronologicalError]: t('fn.anomaly.type.chronologicalError'),
    [AnomalyType.SegmentOverlap]: t('fn.anomaly.type.segmentOverlap'),
    [AnomalyType.MisuseOfRemediatedLib]: t('fn.anomaly.type.misuseOfRemediatedLibrary'),
    [AnomalyType.ConfusingWording]: t('fn.anomaly.type.confusingWording'),
    [AnomalyType.Other]: t('common.other'),
}

export enum Tab {
    Positioning = 'positioning',
    InstructionBound = 'instructionBound',
    InstructionUnbound = 'instructionUnbound',
    Control = 'control',
    Anomalies = 'anomalies',
    Edition = 'edition',
}

export enum AlertType {
    Positioning = 'positioning',
    Arbitration = 'arbitration',
    Instruction = 'instruction',
    Control = 'control',
    Edition = 'edition',
    Preservation = 'preservation',
    Transfer = 'transfer',
    Anomaly = 'anomaly',
}

export enum PositioningFilter {
    All = 0,
    PositioningOnly = 10,
    Excluded = 15,
    InstructionNotStarted = 20,
    Arbitation = 30,
}

export const ProjectSettingsAlertsLabel: Record<AlertType, string> = {
    [AlertType.Positioning]: t('views.project.settings.emailAlert.positioning'),
    [AlertType.Arbitration]: t('views.project.settings.emailAlert.arbitration'),
    [AlertType.Instruction]: t('views.project.settings.emailAlert.instruction'),
    [AlertType.Control]: t('views.project.settings.emailAlert.control'),
    [AlertType.Edition]: t('views.project.settings.emailAlert.edition'),
    [AlertType.Preservation]: t('views.project.settings.emailAlert.preservation'),
    [AlertType.Transfer]: t('views.project.settings.emailAlert.transfer'),
    [AlertType.Anomaly]: t('fn.anomaly.i'),
}
