import { Service } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// Keep in sync with src/styles/_breakpoints.scss
export const BREAKPOINTS = {
  mobile: 320,
  tablet: 750,
  desktop: 1024,
} as const;

const RESIZE_DEBOUNCE_TIME = 100;

export function getDeviceType(viewportWidth: number): DeviceType {
  if (viewportWidth >= BREAKPOINTS.desktop) {
    return 'desktop';
  }
  if (viewportWidth >= BREAKPOINTS.tablet) {
    return 'tablet';
  }
  return 'mobile';
}

@Service()
export class ViewportService {
  private readonly deviceTypeSubject = new BehaviorSubject<DeviceType>(
    getDeviceType(window.innerWidth),
  );

  readonly deviceType$ = this.deviceTypeSubject.pipe(distinctUntilChanged());
  readonly isMobile$ = this.deviceType$.pipe(map((deviceType) => deviceType === 'mobile'));
  readonly isDesktop$ = this.deviceType$.pipe(map((deviceType) => deviceType === 'desktop'));

  constructor() {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(RESIZE_DEBOUNCE_TIME),
        map(() => getDeviceType(window.innerWidth)),
        takeUntilDestroyed(),
      )
      .subscribe((deviceType) => this.deviceTypeSubject.next(deviceType));
  }

  get currentDeviceType(): DeviceType {
    return this.deviceTypeSubject.value;
  }
}
