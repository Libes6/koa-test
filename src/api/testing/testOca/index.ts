import Router from 'koa-router'
import {CustomKoaContext} from '../../../context/CustomKoaContext'
import {OcaService} from "./OcaService";

const router = new Router<any, CustomKoaContext>()

router.get('/', async (koaCtx) => {
    const service = new OcaService(koaCtx.ctx)
    koaCtx.body = await service.giveOneQuestions()
})

router.post('/', async (koaCtx) => {
    const service = new OcaService(koaCtx.ctx)
    await service.addAnsverToTry(koaCtx.request.body)
    koaCtx.status = 201
})

router.use('/(.*)', async (koaCtx) => {
    koaCtx.throw(404)
})

export default router