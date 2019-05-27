
import { LitElement, html } from 'lit-element';

class ComponentA extends LitElement {
  render() {
    return html`
      <div>Component A</div>
    `;
  }
}

customElements.define('component-a', ComponentA);
