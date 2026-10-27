import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Icon],
  template: `
    <header class="border-b border-line bg-surface">
      <div class="header-content">
        <a routerLink="/payment" class="brand" aria-label="Nexo, voltar ao pagamento">
          <span class="brand-mark" aria-hidden="true">n</span>
          <span class="text-lg font-bold">nexo</span>
        </a>
        <span class="flex items-center gap-1.5 text-xs text-muted">
          <app-icon name="lock" [size]="14" />
          Checkout seguro
        </span>
      </div>
    </header>
  `,
  styleUrl: './header.scss',
})
export class Header {}
