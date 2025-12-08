import type { Resource } from '#/project.ts'
import { faker } from '@faker-js/faker'
import { ResourceStatus } from '&/project.ts'

export const createMockResource = (): Resource => ({
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    code: faker.string.alphanumeric(8).toUpperCase(),
    count: faker.number.int({ min: 0, max: 100 }),
    callNumbers: faker.string.alphanumeric(10),
    shouldInstruct: faker.datatype.boolean(),
    shouldPosition: faker.datatype.boolean(),
    status: faker.helpers.enumValue(ResourceStatus),
    arbitration: faker.number.int({ min: 0, max: 10 }),
    acl: {},
    instructionTurns: undefined,
    issn: faker.string.numeric(8),
    publicationHistory: faker.lorem.sentence(),
    validations: {
        controlBound: new Date().toISOString(),
        controlUnbound: new Date().toISOString(),
    },
})
