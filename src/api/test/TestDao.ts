import {RequestContext} from '../../context/RequestContext'
import {TestDto} from './TestDto'

const COLUMNS = `
  t.test_id as "testId",
  t.name,
  t.description,
  t.time_in_minutes as "timeInMinutes",
  t.create_date as "createDate"
`

const TABLES = `
  main.test t
`

export class TestDao {
  constructor(private readonly ctx: RequestContext) {}

  public async findAll(): Promise<TestDto[]> {
    return await this.ctx.db.querySelect(
      `select ${COLUMNS}
         from ${TABLES}
        order by t.create_date desc`,
      [],
    )
  }
}
