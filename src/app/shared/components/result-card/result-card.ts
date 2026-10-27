import { Component, computed, input } from '@angular/core';
import { Icon, IconName } from '../icon/icon';

export type ResultStatus = 'success' | 'error' | 'processing' | 'empty';

const STATUS_ICONS: Record<Exclude<ResultStatus, 'processing'>, IconName> = {
  success: 'circle-check',
  error: 'circle-alert',
  empty: 'info',
};

@Component({
  selector: 'app-result-card',
  imports: [Icon],
  template: `
    <section class="surface-card result-card" [attr.aria-busy]="status() === 'processing'">
      <div class="result-icon" [class]="'result-icon--' + status()">
        @if (iconName(); as iconName) {
          <app-icon [name]="iconName" [size]="24" />
        } @else {
          <span class="spinner" aria-hidden="true"></span>
        }
      </div>

      @if (headingLevel() === 1) {
        <h1 class="result-title">{{ title() }}</h1>
      } @else {
        <h2 class="result-title">{{ title() }}</h2>
      }
      <p class="result-description">{{ description() }}</p>

      <div class="result-content">
        <ng-content />
      </div>
    </section>
  `,
  styleUrl: './result-card.scss',
})
export class ResultCard {
  readonly status = input.required<ResultStatus>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly headingLevel = input<1 | 2>(1);

  protected readonly iconName = computed(() => {
    const status = this.status();
    return status === 'processing' ? null : STATUS_ICONS[status];
  });
}
