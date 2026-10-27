import { Component, computed, input } from '@angular/core';
import { Icon } from '../icon/icon';

type StepStatus = 'completed' | 'current' | 'upcoming';

const STEP_LABELS = ['Pedido', 'Pagamento', 'Confirmação'];

@Component({
  selector: 'app-checkout-steps',
  imports: [Icon],
  template: `
    <nav aria-label="Etapas do checkout">
      <ol class="steps">
        @for (step of steps(); track step.label) {
          <li
            class="step"
            [class]="'step--' + step.status"
            [attr.aria-current]="step.status === 'current' ? 'step' : null"
          >
            <span class="step-marker">
              @if (step.status === 'completed') {
                <app-icon name="check" [size]="14" />
              } @else {
                {{ step.number }}
              }
            </span>
            <span>{{ step.label }}</span>
          </li>
        }
      </ol>
    </nav>
  `,
  styleUrl: './checkout-steps.scss',
})
export class CheckoutSteps {
  readonly currentStep = input.required<number>();

  protected readonly steps = computed(() =>
    STEP_LABELS.map((label, index) => {
      const number = index + 1;
      const status: StepStatus =
        number < this.currentStep()
          ? 'completed'
          : number === this.currentStep()
            ? 'current'
            : 'upcoming';
      return { label, number, status };
    }),
  );
}
