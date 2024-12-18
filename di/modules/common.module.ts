import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '@/di/types';
import { CommonService } from '@/src/infrastructure/services/common.service';

export function createCommonModule() {
  const commonModule = createModule();

  if (process.env.NODE_ENV === 'test') {
  } else {
    commonModule
      .bind(DI_SYMBOLS.ICommonService)
      .toClass(CommonService, [DI_SYMBOLS.ICommonService]);
  }

  return commonModule;
}
