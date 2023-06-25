import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RequestHandler, createProxyMiddleware } from "http-proxy-middleware";
import { UserGuard } from "../common/user/user.guard";
import { frontendURL } from "../common/env.const";


@Injectable()
export class ProxyMiddleware implements NestMiddleware {

    private readonly logger = new Logger(ProxyMiddleware.name)
    private readonly userGuard = new UserGuard()
    frontendURI: string
    private proxy: RequestHandler

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.logger.debug('Created')
        this.frontendURI = frontendURL.toString().replace(/\/$/, '')
        this.logger.debug(`CORS frontend URL: ${this.frontendURI}`)
        if (this.frontendURI) {
            this.proxy = createProxyMiddleware({
                target: this.configService.get<string>('FRIGATE_LOCAL_SERVER') || '',
                ws: true,
                changeOrigin: false,
                logLevel: 'debug',
                onProxyRes: (res: any) => {
                    res.headers['Access-Control-Allow-Origin'] = this.frontendURI
                }
            })
        }
    }

    use(req: any, res: any, next: (error?: any) => void) {
        const videoplayerCondition = req.originalUrl.startsWith('/vod/event')
        if (!this.userGuard.isRequestValidUser(req) && !videoplayerCondition) {
            this.logger.log(`Proxy refuse request:`)
            next()
        }
        this.proxy(req, res, next)
    }
}