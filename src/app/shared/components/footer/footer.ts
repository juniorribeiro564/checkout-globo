import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="page-container footer-content">
      <p>© 2026 Nexo. Todos os direitos reservados.</p>
      <nav class="footer-links" aria-label="Links do rodapé">
        <a href="#" class="text-primary">Precisa de ajuda?</a>
        <a href="#">Privacidade</a>
        <a href="#">Termos</a>
      </nav>
    </footer>
  `,
  styleUrl: './footer.scss',
})
export class Footer {}
