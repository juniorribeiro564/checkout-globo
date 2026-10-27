import { TestBed } from '@angular/core/testing';
import { DeviceType, getDeviceType, ViewportService } from './viewport.service';

function resizeWindow(width: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width });
  window.dispatchEvent(new Event('resize'));
}

describe('getDeviceType', () => {
  it.each<[number, DeviceType]>([
    [320, 'mobile'],
    [749, 'mobile'],
    [750, 'tablet'],
    [1023, 'tablet'],
    [1024, 'desktop'],
    [1440, 'desktop'],
  ])('should return %s px as %s', (viewportWidth, expectedDeviceType) => {
    expect(getDeviceType(viewportWidth)).toBe(expectedDeviceType);
  });
});

describe('ViewportService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resizeWindow(1280);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should emit the device type when the window is resized', () => {
    const viewportService = TestBed.inject(ViewportService);
    const emittedDeviceTypes: DeviceType[] = [];
    viewportService.deviceType$.subscribe((deviceType) => emittedDeviceTypes.push(deviceType));

    resizeWindow(375);
    vi.advanceTimersByTime(100);
    resizeWindow(800);
    vi.advanceTimersByTime(100);

    expect(emittedDeviceTypes).toEqual(['desktop', 'mobile', 'tablet']);
    expect(viewportService.currentDeviceType).toBe('tablet');
  });
});
