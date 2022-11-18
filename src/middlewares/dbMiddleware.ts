import {PgClientFactory} from '../db/PgClientFactory'
import {RequestContext} from '../context/RequestContext'

async function dbMiddleware(koaCtx: any, next: () => Promise<void>) {
  const ctx: RequestContext = {
    db: new PgClientFactory(),
  }
  //koaCtx.ctx.tryUrl = koaCtx.request.headers['authorization']
  koaCtx.ctx = ctx
  try {
    await next()
    await ctx.db.commit()
    await koaCtx.hea
  } catch (err) {
    await ctx.db.rollback()
    throw err
  }
}

export {dbMiddleware}
