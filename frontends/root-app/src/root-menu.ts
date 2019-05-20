const template = document.createElement('template');

template.innerHTML = `
  <style>
      :host {
        font-family: sans-serif;
      }
      div {
        background: #f96e5b;
        width: auto;
      }
      div ul {
        list-style: none;
        margin: 0;
        padding: 0;
        line-height: 1;
        display: block;
        zoom: 1;
      }
      div ul:after {
        content: " ";
        display: block;
        font-size: 0;
        height: 0;
        clear: both;
        visibility: hidden;
      }
      div ul li {
        display: inline-block;
        padding: 0;
        margin: 0;
      }
      div.align-right ul li {
        float: right;
      }
      div.align-center ul {
        text-align: center;
      }
      div ul li a {
        color: #ffffff;
        text-decoration: none;
        display: block;
        padding: 15px 25px;
        font-family: 'Open Sans', sans-serif;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 14px;
        position: relative;
        -webkit-transition: color .25s;
        -moz-transition: color .25s;
        -ms-transition: color .25s;
        -o-transition: color .25s;
        transition: color .25s;
      }
      div ul li a:hover {
        color: #333333;
      }
      div ul li a:hover:before {
        width: 100%;
      }
      div ul li a:after {
        content: "";
        display: block;
        position: absolute;
        right: -3px;
        top: 19px;
        height: 6px;
        width: 6px;
        background: #ffffff;
        opacity: .5;
      }
      div ul li a:before {
        content: "";
        display: block;
        position: absolute;
        left: 0;
        bottom: 0;
        height: 3px;
        width: 0;
        background: #333333;
        -webkit-transition: width .25s;
        -moz-transition: width .25s;
        -ms-transition: width .25s;
        -o-transition: width .25s;
        transition: width .25s;
      }
      div ul li.last > a:after,
      div ul li:last-child > a:after {
        display: none;
      }
      div ul li.active a {
        color: #333333;
      }
      div ul li.active a:before {
        width: 100%;
      }
      div.align-right li.last > a:after,
      div.align-right li:last-child > a:after {
        display: block;
      }
      div.align-right li:first-child a:after {
        display: none;
      }
      @media screen and (max-width: 768px) {
        div ul li {
          float: none;
          display: block;
        }
        div ul li a {
          width: 100%;
          -moz-box-sizing: border-box;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          border-bottom: 1px solid #fb998c;
        }
        div ul li.last > a,
        div ul li:last-child > a {
          border: 0;
        }
        div ul li a:after {
          display: none;
        }
        div ul li a:before {
          display: none;
        }
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
    if (this.active != null && item.path === this.active) {
      container.className = 'active';
    }
    const link = document.createElement('a');
    link.setAttribute('href', item.path);
    link.setAttribute('name', item.name);
    link.appendChild(document.createTextNode(item.label));
    container.appendChild(link);
    return container;
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (name === 'routes' || name === 'active') {
      this.draw();
    }
  }

  static get observedAttributes() {
    return ['routes', 'active'];
  }

  get routes() {
    return this.getAttribute('routes');
  }

  get active() {
    return this.getAttribute('active');
  }
}

export { RootMenuRouteClickEvent };

window.customElements.define('root-menu', RootMenu);