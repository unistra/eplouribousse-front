import type { Anomaly } from '#/project.ts'
import { AnomalyType } from '&/project.ts'
import { faker } from '@faker-js/faker'
import { createMockUserSummarized } from '~/fixtures/users.ts'

export const createMockAnomaly = (): Anomaly => ({
    id: faker.string.uuid(),
    segment: {
        id: faker.string.uuid(),
        order: faker.number.int({ min: 1, max: 100 }),
        segmentType: faker.helpers.arrayElement(['bound', 'unbound'] as const),
        content: faker.lorem.paragraph(),
    },
    type: faker.helpers.enumValue(AnomalyType),
    description: faker.lorem.sentence(),
    fixed: faker.datatype.boolean(),
    fixedAt: new Date().toISOString(),
    fixedBy: createMockUserSummarized(),
    createdAt: new Date().toISOString(),
    createdBy: createMockUserSummarized(),
})
