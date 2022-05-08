function html(strings, ...values) {
  let str = '';
  strings.forEach((string, i) => {
      str += string + (values[i] || '');
  });
  return str;
}

export default {
  props: {
    id: null,
    title: "",
    description: "",
    image: null
  },
  render() {
    const template = document.createElement('div');
    template.innerHTML = html`
      <section class="card">
        <header>
          <figure>
            <div class="placeholder" style="background-image: url(http://localhost:9000/image/24/${this.props.image})"></div>
            <img src="" alt="${this.props.title}" data-src="${this.props.image}">
          </figure>
        </header>
        <main>
          <h1>${this.props.title}</h1>
          <p>${this.props.description}</p>
        </main>
      </section>
    `;
      const card = template.querySelector('.card');
      return card;
  }
};