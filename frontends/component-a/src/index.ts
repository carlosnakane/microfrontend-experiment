
import { LitElement, html, property, css } from 'lit-element';

class ComponentA extends LitElement {

  @property()
  items = '';

  @property()
  name = '';

  render() {
    return html`
      <style>
        .content {
          width: 400px;
          background-color: #FFF;
          border-radius: 5px;
          padding: 3px;
          margin: 40px auto 10px auto;
        } 
        .title {
          margin: -3px;
          padding: 5px;
          background-color: #009688;
          border-radius: 5px;
          color: #FFF;
          font-size: 16px;
        }   
      </style>
      <div class="content">
        <h3 class="title">Polymer WebComponent dentro do: ${this.name}</h3>
        <ul>
      ${
      this.items.split(',').map(i => html`<li>${i}</li>`)
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
