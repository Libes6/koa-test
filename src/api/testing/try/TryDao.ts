import {TryDto} from "./TryDto";
import {RequestContext} from "../../../context/RequestContext";

const tryColums = `
    t.test_try_id as id,
    t.people_id as "peopleId",
    t.test_id as "testId",
    t.create_date as "createDate",
    t.start_testing_time as "startTestingDate",
    t.end_testing_time`

const tryTable = `main.test_try`

export class TryDao{
    constructor(private readonly ctx: RequestContext) {}

    public async findTryId() : Promise<TryDto> {
        return  await this.ctx.db.querySelectOne(`
        select
        t.test_try_id as id
        from main.test_try t
        where try_url = '${this.ctx.tryUrl}'`)
    }

    public async findOneTry(): Promise<TryDto> {
        return await this.ctx.db.querySelectOne(
            `select ${tryColums}
            from ${tryTable} t
            where test_try_id = ${this.ctx.tryId}`
        )
    }

    public async addStartTestingTime() : Promise<void> {
        await this.ctx.db.queryOne(`
        update main.test_try
        set start_testing_time = current_timestamp
        where test_try_id = ${this.ctx.tryId}`)
    }

    public async addEndTestingTIme() : Promise<void> {
        await this.ctx.db.queryOne(`
        update main.test_try
        set end_testing_time = current_timestamp
        where test_try_id = ${this.ctx.tryId}`)
    }
}