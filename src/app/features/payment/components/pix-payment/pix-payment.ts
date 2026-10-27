import { Component, computed, input, output, signal } from '@angular/core';
import { Icon } from '../../../../shared/components/icon/icon';
import { createSimulatedQrCodePath } from '../../utils/pix.utils';

@Component({
  selector: 'app-pix-payment',
  imports: [Icon],
  templateUrl: './pix-payment.html',
  styleUrl: './pix-payment.scss',
})
export class PixPayment {
  readonly pixCode = input.required<string>();
  readonly completePayment = output<void>();

  protected readonly isCodeCopied = signal(false);
  protected readonly qrCodePath = computed(() => createSimulatedQrCodePath(this.pixCode()));

  protected copyPixCode(): void {
    navigator.clipboard
      .writeText(this.pixCode())
      .then(() => this.isCodeCopied.set(true))
      .catch(() => this.isCodeCopied.set(false));
  }
}
