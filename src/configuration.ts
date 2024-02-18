import {Configuration, App} from '@midwayjs/core';
import {join} from 'path';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as orm from '@midwayjs/orm';
import * as redis from '@midwayjs/redis';
import * as i18n from '@midwayjs/i18n';
import * as crossDomain from '@midwayjs/cross-domain';
import * as jwt from '@midwayjs/jwt';
import * as upload from '@midwayjs/upload';
import {ReportMiddleware} from './middleware/report.middleware';
import {ValidationFilter} from './filter/ValidationFilter';
import {BusinessFilter} from "@/filter/BusinessFilter";
import {NotfoundFilter} from "@/filter/NotfoundFilter";
import {DefaultFilter} from "@/filter/DefaultFilter";

@Configuration({
  imports: [
    koa,
    validate,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
    orm,
    redis,
    i18n,
    crossDomain,
    jwt,
    upload,
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    this.app.useFilter([BusinessFilter, ValidationFilter, NotfoundFilter, DefaultFilter]);
  }
}
