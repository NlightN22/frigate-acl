import { Injectable, NestMiddleware } from "@nestjs/common";
import { debug, log } from "console";
import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";


@Injectable()
export class ProxyMiddleware implements NestMiddleware {


    private proxy = createProxyMiddleware({
        target: 'http://frigate.corp.komponent-m.ru:5000/',
        ws: true,
        changeOrigin: true,
        logLevel: 'debug',
    })

    use(req: any, res: any, next: (error?: any) => void) {
        this.proxy(req, res, next)
    }
}