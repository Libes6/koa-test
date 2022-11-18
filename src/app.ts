import dotenv from 'dotenv'
dotenv.config()

import {dbMiddleware} from './middlewares/dbMiddleware'
const Koa = require('koa') // ядро
const Router = require('koa-router') // маршрутизация
const bodyParser = require('koa-bodyparser') // парсер для POST запросов
const serve = require('koa-static') // модуль, который отдает статические файлы типа index.html из заданной директории
const logger = require('koa-logger') // опциональный модуль для логов сетевых запросов. Полезен при разработке.
const cors = require('@koa/cors')
const app = new Koa()
const router = new Router()
import api from './api'

import {peopleInfoMiddleware} from "./middlewares/peopleInfoMiddleware";

app.use(serve('public'))
app.use(logger())
app.use(bodyParser())
app.use(dbMiddleware)
app.use(cors())
app.use(peopleInfoMiddleware)
router.use('/api', api.routes(), api.allowedMethods())
app.use(router.routes()) // потом маршруты

export {app}
