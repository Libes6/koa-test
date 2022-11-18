import Router from 'koa-router'
import {CustomKoaContext} from '../../context/CustomKoaContext'
import {StartTestingService} from './StartTestingService'
import {TryService} from "./try/TryService";

import testOca from "./testOca";

const router = new Router<any, CustomKoaContext>()

router.use('/oca', testOca.routes(), testOca.allowedMethods())

router.get('/', async (koaCtx) => {
  const service = new TryService(koaCtx.ctx)
  koaCtx.body = await service.findInfoAboutTry()
})

router.post('/', async (koaCtx) => {
  const service = new StartTestingService(koaCtx.ctx)
  await service.addPeopleToTry(koaCtx.request.body)
  koaCtx.status = 201
})

router.get('/info', async (koaCtx) =>{
  const service = new StartTestingService(koaCtx.ctx)
  koaCtx.body = await service.findTestInfo()
})

router.post('/start', async (koaCtx) =>{
  const service = new TryService(koaCtx.ctx)
  koaCtx.status = await service.addStartTestingTime()
})

router.use('/(.*)', async (koaCtx) => {
  koaCtx.throw(404)
})

export default router