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

export enum Tab {
    Positioning = 'positioning',
    InstructionBound = 'instructionBound',
    InstructionUnbound = 'instructionUnbound',
    Control = 'control',
    Anomalies = 'anomalies',
    Edition = 'edition',
}

export const ResourceStatusToTab: Record<ResourceStatus, Tab> = {
    [ResourceStatus.Positioning]: Tab.Positioning,
    [ResourceStatus.Excluded]: Tab.Positioning,
    [ResourceStatus.InstructionBound]: Tab.InstructionBound,
    [ResourceStatus.InstructionUnbound]: Tab.InstructionUnbound,
    [ResourceStatus.ControlBound]: Tab.Control,
    [ResourceStatus.ControlUnbound]: Tab.Control,
    [ResourceStatus.AnomalyBound]: Tab.Anomalies,
    [ResourceStatus.AnomalyUnbound]: Tab.Anomalies,
    [ResourceStatus.Edition]: Tab.Edition,
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
