import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { MonitorController } from './monitor.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 1
  }),
  ],
  controllers: [MonitorController],
  providers: [MonitorService]
})
export class MonitorModule {}
