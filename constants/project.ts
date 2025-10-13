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

export enum Arbitration {
    NoPosition1 = 0,
    MultiplePosition1 = 1,
    NoArbitration = 2,
}

export enum ResourceStatus {
    Positioning = 10,
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

export enum Tab {
    Positioning = 'positioning',
    InstructionBound = 'instructionBound',
    InstructionUnbound = 'instructionUnbound',
    Control = 'control',
    Anomalies = 'anomalies',
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

export const AlertTypeLabels: Record<AlertType, string> = {
    [AlertType.Positioning]: t('project.settings.emailAlert.positioning'),
    [AlertType.Arbitration]: t('project.settings.emailAlert.arbitration'),
    [AlertType.Instruction]: t('project.settings.emailAlert.instructions'),
    [AlertType.Control]: t('project.settings.emailAlert.control'),
    [AlertType.Edition]: t('project.settings.emailAlert.edition'),
    [AlertType.Preservation]: t('project.settings.emailAlert.preservation'),
    [AlertType.Transfer]: t('project.settings.emailAlert.transfer'),
    [AlertType.Anomaly]: t('project.settings.emailAlert.anomalies'),
}
