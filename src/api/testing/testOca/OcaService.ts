import {OcaDto} from "./OcaDto";
import {OcaDao} from "./OcaDao";
import {SavedAnswer} from "./OcaDto";
import {PeopleDto} from "../PeopleDto";
import {RequestContext} from "../../../context/RequestContext";

import lodash from 'lodash'

export class OcaService{
    private readonly ocaDao : OcaDao

    constructor( ctx : RequestContext) {
        this.ocaDao = new OcaDao(ctx)
    }

    public async giveOneQuestions() : Promise<OcaDto>{
        let oneQuest : OcaDto = await this.ocaDao.selectOneQuest()
        if(lodash.isEmpty(oneQuest)) await this.checkTheResult()
        return oneQuest
    }

    public async addAnsverToTry(requestBody : object) : Promise<void> {
        await this.ocaDao.insertPeopleAnsver(requestBody['Ansver'])
    }

    private async checkTheResult() : Promise<void>
    {
        let allPeopleAnswers : SavedAnswer[] = await this.ocaDao.selectAllPeopleAnsvers()

        let allBalls : Object = {
            A : 0,
            B : 0,
            C : 0,
            D : 0,
            E : 0,
            F : 0,
            G : 0,
            H : 0,
            I : 0,
            J : 0
        }

        for(var oneAnswer of allPeopleAnswers){
            allBalls[oneAnswer.type] += oneAnswer[oneAnswer.answer]
        }

        let peopleInfo : PeopleDto = await this.ocaDao.selectPeopleInfo()
        let old : boolean = await this.PeopleIsOld(new Date(peopleInfo.birthDate))

        let peopleType : string

        if(peopleInfo.sex == 'M' && old) peopleType = 'M'
        if(peopleInfo.sex == 'M' && !old) peopleType = 'B'
        if(peopleInfo.sex == 'W' && old) peopleType = 'W'
        if(peopleInfo.sex == 'W' && !old) peopleType = 'G'

        let conversion : object[] = await this.ocaDao.selectConversionTable(peopleType)

        for(var key in allBalls){
            try {
                let indexConvTable = conversion.findIndex((obj =>
                    obj['input_' + key.toLowerCase()] === allBalls[key]))
                allBalls[key] = conversion[indexConvTable]['output_'+key.toLowerCase()]
            }
            catch {
                allBalls[key] = -10
            }
        }

        await this.ocaDao.updateTryRes(allBalls)
    }

    private async PeopleIsOld(birthDate : Date) : Promise<boolean> {
        let nowDate : Date = new Date()
        let age : number = nowDate.getFullYear() - birthDate.getFullYear()
        birthDate.setFullYear(0)
        nowDate.setFullYear(0)
        if(birthDate > nowDate){
            age--
        }
        return age >= 18
    }
}