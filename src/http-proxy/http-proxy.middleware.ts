import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RequestHandler, createProxyMiddleware } from "http-proxy-middleware";


@Injectable()
export class ProxyMiddleware implements NestMiddleware {

    private readonly logger = new Logger(ProxyMiddleware.name)
    frontendURI: string
    private proxy: RequestHandler

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.logger.debug('Created')
        this.frontendURI = this.configService.get<string>('FRIGATE_FROTEND_SERVER') || ''
        this.logger.debug(this.frontendURI)
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
        if (req.session.user === undefined) {
            next
        }
        this.proxy(req, res, next)
    }
}