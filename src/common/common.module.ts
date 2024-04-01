import { Module } from '@nestjs/common';
import { AxiosAdapters } from './adapters/axios.adapter';

@Module({
    providers: [AxiosAdapters],
    exports: [AxiosAdapters]
})
export class CommonModule {}
