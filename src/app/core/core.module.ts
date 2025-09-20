import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateHttpLoader,
        useClass: TranslateHttpLoader // sin factory, usa config por defecto
      }
    })
  ],
  exports: [TranslateModule]
})
export class CoreModule {}
