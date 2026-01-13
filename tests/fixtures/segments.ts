import type { Segment } from '#/project.ts'
import { faker } from '@faker-js/faker'

export const createMockSegment = (): Segment => ({
    id: faker.string.uuid(),
    content: faker.lorem.paragraph(),
    improvableElements: faker.lorem.sentence(),
    exception: faker.lorem.sentence(),
    improvedSegment: faker.datatype.boolean() ? faker.lorem.paragraph() : undefined,
    collection: faker.string.uuid(),
    segmentType: faker.helpers.arrayElement(['bound', 'unbound'] as const),
    order: faker.number.int({ min: 1, max: 100 }),
    retained: faker.datatype.boolean(),
    createdBy: faker.datatype.boolean() ? faker.string.uuid() : null,
    createdAt: new Date().toISOString(),
    acl: {},
    anomalies: {
        fixed: faker.number.int({ min: 0, max: 5 }),
        unfixed: faker.number.int({ min: 0, max: 5 }),
    },
})
