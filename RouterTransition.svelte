<script>
  import CssTransitionService from './dist/services/CssTransitionService/index'

  export let name;

  const transitionService = new CssTransitionService();
  let transition = name;
  let durations;
  let _classes = [];

  if (transition) {
    durations = transitionService.propTransitionDuration(transition);
  }

  const delay = (ms) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      },ms)
    })
  }

  let outlet = document.createElement('div');

  async function transitionOut () {
    outlet.classList.add(`${transition}-leave-active`);
    outlet.classList.add(`${transition}-leave`);
    _classes = [...outlet.classList]
    await delay(100);
    outlet.classList.remove(`${transition}-leave`);
    outlet.classList.add(`${transition}-leave-to`);
    _classes = [...outlet.classList]
    await delay(durations.leavingDuration);
    outlet.classList.remove(`${transition}-leave-active`);
    outlet.classList.remove(`${transition}-leave-to`);
    _classes = [...outlet.classList]
  }

  async function transitionIn () {
    outlet.classList.add(`${transition}-enter-active`);
    outlet.classList.add(`${transition}-enter`);
    _classes = [...outlet.classList]
    await delay(100);
    outlet.classList.remove(`${transition}-enter`);
    outlet.classList.add(`${transition}-enter-to`);
    _classes = [...outlet.classList]
    await delay(durations.leavingDuration);
    outlet.classList.remove(`${transition}-enter-active`);
    outlet.classList.remove(`${transition}-enter-to`);
    _classes = [...outlet.classList]
  }

  async function fireTransition (mode) {
    if (mode === 'out') {
      await transitionOut()
    } else if (mode === 'in') {
      await transitionIn()
    }
  }

  $: classes = _classes.join(' ');
</script>

<div class="{classes}">
  <slot callback={fireTransition}>
  </slot>
</div>

