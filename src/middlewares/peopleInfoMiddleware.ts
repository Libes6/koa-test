import {TryService} from "../api/testing/try/TryService";

import lodash from "lodash";

async function peopleInfoMiddleware(koaCtx : any, next : () => Promise<void>) {
    koaCtx.ctx.tryUrl = koaCtx.get('Authorization')
    const service = new TryService(koaCtx.ctx)
    const tryId = await service.findTryId()
    if(!lodash.isNull(tryId)) {
        koaCtx.ctx.tryId = tryId
    }
    else
    {
        koaCtx.throw(401)
    }
    await next()
}

export {peopleInfoMiddleware}