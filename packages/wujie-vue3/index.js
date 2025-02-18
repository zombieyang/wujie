import { bus, preloadApp, startApp, destroyApp } from "wujie";
import { h, defineComponent } from "vue";

const wujieVueOptions = {
  name: "WujieVue",
  props: {
    width: { type: String, default: "" },
    height: { type: String, default: "" },
    name: { type: String, default: "" },
    url: { type: String, default: "" },
    sync: { type: Boolean, default: false },
    prefix: { type: Object, default: undefined },
    alive: { type: Boolean, default: false },
    props: { type: Object, default: undefined },
    attrs: {type: Object, default: undefined},
    replace: { type: Function, default: undefined },
    fetch: { type: Function, default: undefined },
    fiber: { type: Boolean, default: true },
    degrade: { type: Boolean, default: false },
    plugins: { type: Array, default: null },
    beforeLoad: { type: Function, default: null },
    beforeMount: { type: Function, default: null },
    afterMount: { type: Function, default: null },
    beforeUnmount: { type: Function, default: null },
    afterUnmount: { type: Function, default: null },
    activated: { type: Function, default: null },
    deactivated: { type: Function, default: null },
    loadError: { type: Function, default: null },
  },
  data() {
    return {
      destroy: null,
      startAppQueue: Promise.resolve(),
    };
  },
  mounted() {
    bus.$onAll(this.handleEmit);
    this.execStartApp();
    this.$watch(
      () => this.name + this.url,
      () => this.execStartApp()
    );
  },
  methods: {
    handleEmit(event, ...args) {
      this.$emit(event, ...args);
    },
    execStartApp() {
      this.startAppQueue = this.startAppQueue.then(async () => {
        try {
          this.destroy = await startApp({
            name: this.name,
            url: this.url,
            el: this.$refs.wujie,
            alive: this.alive,
            fetch: this.fetch,
            props: this.props,
            attrs: this.attrs,
            replace: this.replace,
            sync: this.sync,
            prefix: this.prefix,
            fiber: this.fiber,
            degrade: this.degrade,
            plugins: this.plugins,
            beforeLoad: this.beforeLoad,
            beforeMount: this.beforeMount,
            afterMount: this.afterMount,
            beforeUnmount: this.beforeUnmount,
            afterUnmount: this.afterUnmount,
            activated: this.activated,
            deactivated: this.deactivated,
            loadError: this.loadError,
          });
        } catch (error) {
          console.log(error);
        }
      });
    },
  },
  beforeDestroy() {
    bus.$offAll(this.handleEmit);
  },
  render() {
    return h("div", {
      style: {
        width: this.width,
        height: this.height,
      },
      ref: "wujie",
    });
  },
};

const WujieVue = defineComponent(wujieVueOptions);

WujieVue.preloadApp = preloadApp;
WujieVue.bus = bus;
WujieVue.destroyApp = destroyApp;
WujieVue.install = function (app) {
  app.component("WujieVue", WujieVue);
};

export default WujieVue;
