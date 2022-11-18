import Router from 'koa-router'
import {CustomKoaContext} from '../../context/CustomKoaContext'
import {TestService} from './TestService'

const router = new Router<any, CustomKoaContext>()

router.get('/', async (koaCtx) => {
  const service = new TestService(koaCtx.ctx)
  koaCtx.body = await service.findAll()
})

router.use('/(.*)', async (koaCtx) => {
  koaCtx.throw(404)
})

export default router