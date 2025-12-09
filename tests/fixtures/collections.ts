import type { CollectionsInResource } from '#/project.ts'
import { faker } from '@faker-js/faker'
import { CollectionPosition } from '&/project.ts'

export const createMockCollectionsInResource = (): CollectionsInResource => ({
    id: faker.string.uuid(),
    library: faker.string.uuid(),
    callNumber: faker.string.alphanumeric(10).toUpperCase(),
    holdStatement: faker.lorem.sentence(),
    position: faker.helpers.objectValue(CollectionPosition),
    isExcluded: faker.datatype.boolean(),
    exclusionReason: faker.lorem.sentence(),
    commentPositioning: null,
    acl: {
        position: faker.datatype.boolean(),
    },
})
