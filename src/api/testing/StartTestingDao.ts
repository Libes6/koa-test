import {TestInfoDto} from "./TestInfoDto";
import {PeopleDto} from "./PeopleDto";
import {RequestContext} from "../../context/RequestContext";

const TryTable = `main.test_try`

const PeopleColums =`t.people_id as "peopleId"`

const PeopleTable =`auth.people`

export class StartTestingDao{
    constructor(private readonly ctx: RequestContext) {}

    public async findPeople(FirstName : string, MiddleName : string, LastName : string,
                            BirthDate : string, Sex : string): Promise<PeopleDto>{
        return await this.ctx.db.querySelectOne(
            `select ${PeopleColums}
            from ${PeopleTable} t
            WHERE first_name='${FirstName}' AND 
            middle_name='${MiddleName}' AND
            last_name='${LastName}' AND
            birth_date='${BirthDate}' AND
            sex='${Sex}'`
        )
    }

    public async editTry(peopleId : number) : Promise<void> {
        await this.ctx.db.queryOne(`
        update ${TryTable} t
        set people_id = ${peopleId}
        where try_url = '${this.ctx.tryUrl}'`)
    }

    public async addPeople(FirstName : string, MiddleName : string, LastName : string,
                           BirthDate : string, Sex : string) : Promise<void> {
        await this.ctx.db.queryOne(`
        insert into ${PeopleTable}
        (first_name, middle_name, last_name, birth_date, sex)
        values ('${FirstName}', '${MiddleName}', '${LastName}', '${BirthDate}', '${Sex}')`)
    }

    public async findTestInfo() : Promise<TestInfoDto> {
        return await this.ctx.db.querySelectOne(`
            select info.name as name, 
            info.description as description, 
            info.time_in_minutes as timeInMinutes, 
            info.number_of_questions as numberOfQuestions
            from ${TryTable} try
            join main.test info on try.test_id = info.test_id
            where try_url = '${this.ctx.tryUrl}'`)
    }
}