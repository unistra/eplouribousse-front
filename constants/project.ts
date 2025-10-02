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
    ControlBound = 30,
    InstructionUnbound = 40,
    ControlUnbound = 50,
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
