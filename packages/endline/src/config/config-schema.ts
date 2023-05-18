import Ajv, { JSONSchemaType } from 'ajv'
import { EndlineConfig } from './index'
import { AggregateAjvError } from '@segment/ajv-human-errors'

const configSchema = {
  type: 'object',
  properties: {
    distDir: {
      type: 'string',
    },
    router: {
      type: 'object',
      properties: {
        routesDirectory: {
          type: 'string',
        },
      },
    },
  },
} as JSONSchemaType<EndlineConfig>

const ajv = new Ajv({
  allErrors: true,
  verbose: true,
})

const validate = ajv.compile(configSchema)

export function validateConfig(config: EndlineConfig): {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: Array<any> | null
} {
  let errors
  validate(config)

  if (validate.errors) {
    const ajvError = new AggregateAjvError(validate.errors)
    errors = []
    for (const error of ajvError) {
      errors.push(error.message)
    }
  }

  return { errors }
}
