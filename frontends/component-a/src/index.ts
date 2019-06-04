
import { LitElement, html, property } from 'lit-element';

class ComponentA extends LitElement {

  @property()
  items = [];

  @property()
  name = '';

  render() {
    return html`
      <div>
        <h3>Polymer WebComponent dentro do: ${this.name}</h3>
        <ul>
      ${
      this.items.map(i => `<li>${i}</li>`)
      }
        </ul>
      </div>
    `;
  }
}

const elementTag = 'component-a';

if (document.createElement(elementTag).constructor === HTMLElement) {
  customElements.define(elementTag, ComponentA);
}
