export default {
    name: 'MyButton',
    props: {
      text: {
        type: String,
        default: 'button',
      },
    },

    template: `
      <button>{{text}}</button>
      `
  }
  