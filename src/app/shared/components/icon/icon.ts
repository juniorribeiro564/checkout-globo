import { Component, computed, input } from '@angular/core';

const CIRCLE_PATH = 'M22 12a10 10 0 1 1-20 0a10 10 0 0 1 20 0z';

const ICON_PATHS = {
  'arrow-right': 'M5 12h14M12 5l7 7-7 7',
  check: 'M20 6 9 17l-5-5',
  'circle-alert': `${CIRCLE_PATH}M12 8v4M12 16h.01`,
  'circle-check': `${CIRCLE_PATH}M9 12l2 2 4-4`,
  'circle-help': `${CIRCLE_PATH}M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01`,
  copy: 'M10 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2zM4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2',
  'credit-card': 'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM2 10h20',
  'file-text':
    'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zM14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8M10 9H8',
  info: `${CIRCLE_PATH}M12 16v-4M12 8h.01`,
  lock: 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM7 11V7a5 5 0 0 1 10 0v4',
  'message-circle': 'M7.9 20A9 9 0 1 0 4 16.1L2 22z',
  pix: 'M12 2 22 12 12 22 2 12z',
  refresh: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5',
  'shield-check':
    'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1zM9 12l2 2 4-4',
} as const;

export type IconName = keyof typeof ICON_PATHS;

@Component({
  selector: 'app-icon',
  host: { class: 'inline-flex shrink-0', 'aria-hidden': 'true' },
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.width]="size()"
      [attr.height]="size()"
    >
      <path [attr.d]="path()" />
    </svg>
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(16);

  protected readonly path = computed(() => ICON_PATHS[this.name()]);
}
