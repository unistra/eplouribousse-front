import type { LibraryI } from './library'
import { PositioningFilter, ResourceStatus } from '&/project.ts'
import { type Project } from './project'

export type GetResources = (params: {
    against?: LibraryI['id']
    arbitration?: 0 | 1 | 'all'
    library?: LibraryI['id']
    ordering?: string
    page?: number
    page_size?: number
    positioning_filter?: PositioningFilter
    project?: Project['id']
    search?: string
    status: ResourceStatus[]
}) => Promise<{ count: number } | undefined>
