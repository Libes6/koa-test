import {TryDto} from "./TryDto";
import {TryDao} from "./TryDao";
import {RequestContext} from "../../../context/RequestContext";

import lodash from "lodash";

export class TryService{
    private readonly tryDao : TryDao

    constructor(ctx : RequestContext) {
        this.tryDao = new TryDao(ctx)
    }

    public async findTryId() : Promise<number>{
        const tryInfo :TryDto = await this.tryDao.findTryId()
        if(lodash.isEmpty(tryInfo)) return null
        return tryInfo.id
    }

    public async findInfoAboutTry(): Promise<Object> {
        const tryInfo : TryDto = await this.tryDao.findOneTry()
        if(lodash.isEmpty(tryInfo)) {
            return null
        }
        var resTryInfoForFront : Object = {
            peopleInTry : false,
            started : false,
            testType : null
        }
        resTryInfoForFront['peopleInTry'] = lodash.isInteger(tryInfo.peopleId)
        resTryInfoForFront['testType'] = tryInfo.testId
        resTryInfoForFront['started'] = !lodash.isNull(tryInfo.startTestingDate)
        return resTryInfoForFront
    }

    public async addStartTestingTime() : Promise<number> {
        const tryInfo : TryDto = await this.tryDao.findOneTry()
        await console.log(tryInfo.startTestingDate)
        if(lodash.isNull(tryInfo.startTestingDate)) {
            await this.tryDao.addStartTestingTime()
            return 202
        }
        else{
            return 208
        }
    }
}