import { LitElement, html } from 'lit-element';
import _ from 'lodash';

import { renderFonts, ensureFonts } from './lib/typography.js';
import { renderContents } from './lib/contents.js';

import fonts__suedtirol_next_woff from './fonts/SuedtirolNextTT.woff';
import fonts__suedtirol_next_woff2 from './fonts/SuedtirolNextTT.woff2';
import fonts__kievit_regular_woff from './fonts/Kievit.woff';
import fonts__kievit_bold_woff from './fonts/Kievit-Bold.woff';

import styles__normalize from 'normalize.css/normalize.css';
import styles from './directions.scss';

import assets__dot_icon from './images/dot.svg';
import assets__transport_bike_icon from './images/transport-bike.svg';
import assets__transport_bus_icon from './images/transport-bus.svg';
import assets__transport_car_icon from './images/transport-car.svg';
import assets__transport_plane_icon from './images/transport-plane.svg';
import assets__transport_train_icon from './images/transport-train.svg';

const fonts = [
  {
    name: 'pages-suedtirol-next',
    woff: fonts__suedtirol_next_woff,
    woff2: fonts__suedtirol_next_woff2,
    weight: 400
  },
  {
    name: 'pages-kievit',
    woff: fonts__kievit_regular_woff,
    weight: 400
  },
  {
    name: 'pages-kievit',
    woff: fonts__kievit_bold_woff,
    weight: 700
  }
];

class DirectionsElement extends LitElement {

  constructor() {
    super();

    this.srcUrl = '';
  }

  static get properties() {
    return {
      srcUrl: { attribute: 'src', type: String }
    };
  }

  renderItem(item) {
    return `
      <div class="item">
        <div class="contains-bullet" style="background-image: url(data:image/svg+xml;base64,${btoa(assets__dot_icon)});">
          ${!!item.icon && item.icon === 'bike' ? assets__transport_bike_icon : ''}
          ${!!item.icon && item.icon === 'bus' ? assets__transport_bus_icon : ''}
          ${!!item.icon && item.icon === 'car' ? assets__transport_car_icon : ''}
          ${!!item.icon && item.icon === 'plane' ? assets__transport_plane_icon : ''}
          ${!!item.icon && item.icon === 'train' ? assets__transport_train_icon : ''}
        </div>
        <div class="contains-content">
          ${renderContents(item.contents || '')}
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <style>
        ${renderFonts(fonts)}
        ${styles__normalize}
        ${styles}
      </style>
      <div id="root">
        <div id="container">
          <div id="contains-contents">
            <div id="title"></div>
            <div id="subtitle"></div>
          </div>
          <div id="wrapper">
            <div id="contains-image">
              <div id="image"></div>
            </div>
            <div id="contains-items">
              <div id="items"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async firstUpdated() {
    let self = this;
    let root = self.shadowRoot;

    ensureFonts(fonts);

    if (!!self.srcUrl) {
      fetch(self.srcUrl).then((response) => {
        return response.json();
      }).then((data) => {
        let titleElement = root.getElementById('title');
        titleElement.textContent = data.title || '';

        let subtitleElement = root.getElementById('subtitle');
        subtitleElement.textContent = data.subtitle || '';

        let imageElement = root.getElementById('image');

        if (!!data.image) {
          imageElement.style.backgroundImage = 'url(' + data.image.src + ')';
          // TODO render copyrights/credits
        }

        if (!!data.items) {
          let itemsList = root.getElementById('items');
          itemsList.innerHTML = '';

          _.each(data.items, (item) => {
            itemsList.insertAdjacentHTML('beforeend', self.renderItem(item));
          });
        }
      });
    }
  }

}

if (!customElements.get('pages-directions')) {
  customElements.define('pages-directions', DirectionsElement);
}