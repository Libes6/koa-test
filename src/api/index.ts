import Router from 'koa-router'
import {CustomKoaContext} from '../context/CustomKoaContext'

import test from './test'
import  testing from './testing'

const router = new Router<any, CustomKoaContext>()

router.use('/test', test.routes(), test.allowedMethods())
router.use('/testing', testing.routes(), test.allowedMethods())

router.get('/1', async (koaCtx) =>{
  koaCtx.body = '<h1>Ответ</h1>'
})

router.use('/(.*)', async (koaCtx) => {
  koaCtx.throw(404)
})

export default router
