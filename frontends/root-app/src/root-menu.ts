const template = document.createElement('template');

template.innerHTML = `
  <style>
      :host {
        font-family: sans-serif;
      }
  </style>

  <div>
  </div>
`;

type RouteItem = { path: string, label: '', name: string };
type Routes = [RouteItem];

type RootMenuRouteClickEvent = string;

class RootMenu extends HTMLElement {

  private _shadowRoot: ShadowRoot;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ 'mode': 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    const container = this._shadowRoot.querySelector('div');
    container.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const href = (e.target as Element).getAttribute('href');
      if (href != null) {
        this.dispatchEvent(new CustomEvent('routeClick', { detail: href, bubbles: true }));
      }
      return false;
    });
  }

  connectedCallback() {
    this.draw();
  }

  draw() {
    const container = this._shadowRoot.querySelector('div');
    const items = JSON.parse(this.routes) as Routes;
    container.innerHTML = '';

    if (!Array.isArray(items)) {
      return;
    }

    const node = this.drawNode(items);
    container.appendChild(node);
  }

  drawNode(items: Routes) {
    const container = document.createElement('ul');
    const children = items.map(item => this.drawChildNode(item).outerHTML);
    container.innerHTML = children.join('');
    return container;
  }

  drawChildNode(item: RouteItem) {
    const container = document.createElement('li');
    const link = document.createElement('a');
    link.setAttribute('href', item.path);
    link.setAttribute('name', item.name);
    link.appendChild(document.createTextNode(item.label));
    container.appendChild(link);
    return container;
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (name === 'routes') {
      this.draw();
    }
  }

  static get observedAttributes() {
    return ['routes'];
  }

  get routes() {
    return this.getAttribute('routes');
  }
}

export { RootMenuRouteClickEvent };

window.customElements.define('root-menu', RootMenu);