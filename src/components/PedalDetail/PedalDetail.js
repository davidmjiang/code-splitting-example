import regeneratorRuntime from "regenerator-runtime";
import Heading from "../Heading/Heading";
import BackLink from "../BackLink/BackLink";
import PedalImage from "../PedalImage/PedalImage";
import { PedalImageContainer, ToggleFavorite, PedalInfo } from "./PedalDetail.css";
import { h, render, Component } from "preact";
import isFavorite from "../../utils/isFavorite";
import toggleFavorite from "../../utils/toggleFavorite";

require('./../../js/paypal');

export default class PedalDetail extends Component {
  constructor(props) {
    super(props);

    this.setState({
      id: null,
      manufacturer: "",
      model: "",
      type: "",
      youtube: "",
      copy: "",
      isFavorite: false
    });

    this.handleToggleFavorite = this.handleToggleFavorite.bind(this);
  }

  async componentDidMount() {
    let response = await fetch(`/api/pedal/${this.props.id}`);
    let pedal = await response.json();

    this.setState({
      id: pedal.id,
      manufacturer: pedal.manufacturer,
      model: pedal.model,
      type: pedal.type,
      youtube: `https://www.youtube.com/embed/${pedal.youtube}`,
      copy: pedal.copy,
      isFavorite: isFavorite(pedal.id)
    });

    paypal.Button.render({
      env: 'sandbox',
      style: {
        layout: 'vertical',
        size: 'medium',
        shape: 'rect',
        color: 'gold'
      },
      funding: {
        allowed: [
          paypal.FUNDING.CARD,
          paypal.FUNDING.CREDIT
        ],
        disallowed: []
      },
      commit: true,
      client: {
        sandbox: 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R'
      },
      payment: function (data, actions) {
        return actions.payment.create({
          payment: {
            transactions: [
              {
                amount: {
                  total: '0.01',
                  currency: 'USD'
                }
              }
            ]
          }
        })
      },
      onAuthorize: function(data, actions) {
        return actions.payment.execute()
        .then(function() {
          window.alert("Payment Complete!");
        });
      }
    }, '#paypal-button-container');
  }

  handleToggleFavorite() {
    toggleFavorite(this.state.id, this.state.manufacturer, this.state.model, this.state.type);

    this.setState({
      isFavorite: isFavorite(this.state.id)
    });
  }

  render() {
    return (
      <section>
        <Heading>
          <BackLink href="/">←</BackLink>
          <h1>{this.state.manufacturer} {this.state.model}</h1>
        </Heading>
        <PedalInfo>
          <PedalImageContainer>
            <ToggleFavorite onClick={this.handleToggleFavorite}>{this.state.isFavorite === true ? "-" : "+"}</ToggleFavorite>
            <PedalImage id={this.state.id} manufacturer={this.state.manufacturer} model={this.state.model}/>
          </PedalImageContainer>
          <div id="paypal-button-container"></div>
          <h2>Type</h2>
          <p>{this.state.type}</p>
          <h2>Description</h2>
          <p>{this.state.copy}</p>
          <h2>Demo Video</h2>
          <iframe
            id="ytplayer"
            type="text/html"
            width="640"
            height="360"
            src={this.state.youtube}
            frameborder="0">
          </iframe>
        </PedalInfo>
      </section>
    );
  }
}
