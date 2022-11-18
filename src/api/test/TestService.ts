import {TestDto} from './TestDto'
import {TestDao} from './TestDao'
import {RequestContext} from '../../context/RequestContext'

export class TestService {
  private readonly testDao: TestDao
  constructor(ctx: RequestContext) {
    this.testDao = new TestDao(ctx)
  }

  public async findAll(): Promise<TestDto[]> {
    return await this.testDao.findAll()
  }
}
