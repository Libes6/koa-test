import {RequestContext} from '../../context/RequestContext'
import {StartTestingDao} from "./StartTestingDao"
import {TestInfoDto} from "./TestInfoDto"
import {PeopleDto} from "./PeopleDto"

import lodash from 'lodash'

export class StartTestingService{

    private readonly starTestingDao : StartTestingDao

    constructor( ctx : RequestContext) {
        this.starTestingDao = new StartTestingDao(ctx)
    }

    public async addPeopleToTry(peopleInfo : object) : Promise<void> {
        let People : PeopleDto = await this.starTestingDao.findPeople(peopleInfo['FirstName'], peopleInfo['MiddleName'],
            peopleInfo['LastName'], peopleInfo['BirthDate'], peopleInfo['Sex'])
        if(lodash.isEmpty(People)) {
            await this.starTestingDao.addPeople(peopleInfo['FirstName'], peopleInfo['MiddleName'],
                peopleInfo['LastName'], peopleInfo['BirthDate'], peopleInfo['Sex'])
            People = await this.starTestingDao.findPeople(peopleInfo['FirstName'], peopleInfo['MiddleName'],
                peopleInfo['LastName'], peopleInfo['BirthDate'], peopleInfo['Sex'])
        }
        await this.starTestingDao.editTry(People.peopleId)
    }

    public async findTestInfo() : Promise<TestInfoDto> {
        return await this.starTestingDao.findTestInfo()
    }
}