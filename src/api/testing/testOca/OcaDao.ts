import {OcaDto} from "./OcaDto"
import {SavedAnswer} from "./OcaDto";
import {RequestContext} from "../../../context/RequestContext";
import {PeopleDto} from "../PeopleDto";
import {QuestIdDto} from "./QuestIdDto";

const ocaColums = `
t.oca_id as questId,
t.question_text as questText`

const ocaTable = `tests.oca`

const answersColums = `
answer.oca_quest_id as answerQuestId,
answer.answer as answer,
key.yes as yes,
key.no as no,
key.maybe as maybe,
key.type as type
`

const answersTable = `tests.oca_answers_try`

const keyTable = `tests.oca`

const tryTable = `main.test_try`

const resTable = `main.oca_result`

export class OcaDao{
    constructor(private readonly ctx: RequestContext) {}

    public async selectOneQuest() : Promise<OcaDto> {
        return await this.ctx.db.querySelectOne(`
            select ${ocaColums}
            from ${ocaTable} t
            where oca_id = ${await this.selectQuestId()}`)
    }

    public async selectAllPeopleAnsvers() : Promise<SavedAnswer[]> {
        return await this.ctx.db.querySelect(`
        select ${answersColums}
        from ${answersTable} answer
        join ${keyTable} key
        on answer.oca_quest_id = key.oca_id
        join main.test_try try
        on answer.test_try_id = try.test_try_id
        where try_url = '${this.ctx.tryUrl}'`)
    }

    public async insertPeopleAnsver(answer : string) : Promise<void> {
        await this.ctx.db.queryOne(`insert into ${answersTable}
                                    ( test_try_id, answer, oca_quest_id)
                                    select test_try_id, '${answer}', 
                                    ${await this.selectQuestId()}
                                    from main.test_try
                                    where try_url = '${this.ctx.tryUrl}'`)
    }

    public async selectPeopleInfo() : Promise<PeopleDto> {
        return await this.ctx.db.querySelectOne(`select
        people.birth_date as "birthDate",
        people.sex as sex
        from auth.people people
        join main.test_try try
        on people.people_id = try.people_id
        where try.try_url = '${this.ctx.tryUrl}'`)
    }

    public async selectConversionTable(peopleType : string) : Promise<object[]> {
        return this.ctx.db.querySelect(`
        select *
        from tests.oca_conversion
        where people_type = '${peopleType}'`)
    }

    public async updateTryRes(peopleRes : object) : Promise<void> {
        try {
            await this.ctx.db.query(`
            insert into ${resTable} 
            (test_try_id, res_a, 
            res_b, res_c, res_d, 
            res_e, res_f, res_g, 
            res_h, res_i, res_j)
            select test_try_id, ${peopleRes['A']},
            ${peopleRes['B']}, ${peopleRes['C']}, ${peopleRes['D']},
            ${peopleRes['E']}, ${peopleRes['F']}, ${peopleRes['G']},
            ${peopleRes['H']}, ${peopleRes['I']}, ${peopleRes['J']}
            from main.test_try
            where try_url = 'try';
            update ${tryTable}
            set try_url = null 
            where try_url = '${this.ctx.tryUrl}'`)
            await this.ctx.db.commit()
        }
        catch {
            await this.ctx.db.rollback()
        }
    }

    private async selectQuestId() : Promise<number> {
        let quest : QuestIdDto = await this.ctx.db.querySelectOne(`
            select count(*) + 1 as id
            from ${answersTable}
            where test_try_id = (select test_try_id
            from main.test_try
            where try_url = '${this.ctx.tryUrl}')`)
        return quest.id
    }
}