
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function (exports) {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty) {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return lets;
        }
        return $$scope.dirty;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            $$.fragment && $$.fragment.p($$.ctx, $$.dirty);
            $$.dirty = [-1];
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined' ? window : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* Users/alexeysolovjov/Desktop/work/svelte-easyroute/RouterLink.svelte generated by Svelte v3.16.4 */

    const file = "Users/alexeysolovjov/Desktop/work/svelte-easyroute/RouterLink.svelte";

    function create_fragment(ctx) {
    	let a;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			attr_dev(a, "href", /*link*/ ctx[0]);
    			add_location(a, file, 12, 0, 177);
    			dispose = listen_dev(a, "click", /*navigate*/ ctx[1], false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot && default_slot.p && dirty[0] & /*$$scope*/ 8) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[3], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { to } = $$props;
    	const link = "#" + to;

    	function navigate(evt) {
    		evt.preventDefault();
    		evt.stopPropagation();
    		window.location.hash = link;
    	}

    	const writable_props = ["to"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RouterLink> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("to" in $$props) $$invalidate(2, to = $$props.to);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { to };
    	};

    	$$self.$inject_state = $$props => {
    		if ("to" in $$props) $$invalidate(2, to = $$props.to);
    	};

    	return [link, navigate, to, $$scope, $$slots];
    }

    class RouterLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { to: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RouterLink",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*to*/ ctx[2] === undefined && !("to" in props)) {
    			console.warn("<RouterLink> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<RouterLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<RouterLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* Users/alexeysolovjov/Desktop/work/svelte-easyroute/RouterOutlet.svelte generated by Svelte v3.16.4 */
    const file$1 = "Users/alexeysolovjov/Desktop/work/svelte-easyroute/RouterOutlet.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let current;
    	var switch_value = /*routeComponent*/ ctx[2];

    	function switch_props(ctx) {
    		return {
    			props: {
    				router: /*passingRouter*/ ctx[0],
    				currentRoute: /*routeInfo*/ ctx[3]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", /*className*/ ctx[1]);
    			add_location(div, file$1, 49, 0, 1340);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty[0] & /*passingRouter*/ 1) switch_instance_changes.router = /*passingRouter*/ ctx[0];
    			if (dirty[0] & /*routeInfo*/ 8) switch_instance_changes.currentRoute = /*routeInfo*/ ctx[3];

    			if (switch_value !== (switch_value = /*routeComponent*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if (!current || dirty[0] & /*className*/ 2) {
    				attr_dev(div, "class", /*className*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { router } = $$props;
    	let { callback } = $$props;
    	let { transition } = $$props;
    	const newTransitionMode = transition !== undefined;
    	router.newTransitionMode = newTransitionMode;
    	let _routeComponent = false;
    	let _routeInfo = {};
    	let passingRouter;
    	let durations;
    	let className = "svelte-easyroute-outlet";
    	let selector = className;
    	let id;

    	const delay = ms => {
    		return new Promise(resolve => {
    				setTimeout(
    					() => {
    						resolve();
    					},
    					ms
    				);
    			});
    	};

    	if (newTransitionMode) {
    		durations = router.transitionService.propTransitionDuration(transition);
    		id = Math.random().toString(36).substring(7);
    		className = `${className} router-${id} ${transition}-enter`;
    		selector = `.${selector}.router-${id}`;
    	}

    	router.afterUpdate = async () => {
    		window.dispatchEvent(new Event("RouterUpdate"));
    		if (!router.currentRoute.routeObject.nested) await callback("out");
    		if (!router.currentRoute.routeObject.nested) $$invalidate(7, _routeComponent = false);
    		await tick();
    		await delay(2);
    		$$invalidate(7, _routeComponent = router.currentRoute.routeObject.component);
    		$$invalidate(8, _routeInfo = router.currentRoute.routeInfo);
    		$$invalidate(0, passingRouter = router);
    		if (!router.currentRoute.routeObject.nested) callback("in");
    	};

    	const writable_props = ["router", "callback", "transition"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RouterOutlet> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("router" in $$props) $$invalidate(4, router = $$props.router);
    		if ("callback" in $$props) $$invalidate(5, callback = $$props.callback);
    		if ("transition" in $$props) $$invalidate(6, transition = $$props.transition);
    	};

    	$$self.$capture_state = () => {
    		return {
    			router,
    			callback,
    			transition,
    			_routeComponent,
    			_routeInfo,
    			passingRouter,
    			durations,
    			className,
    			selector,
    			id,
    			routeComponent,
    			routeInfo
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("router" in $$props) $$invalidate(4, router = $$props.router);
    		if ("callback" in $$props) $$invalidate(5, callback = $$props.callback);
    		if ("transition" in $$props) $$invalidate(6, transition = $$props.transition);
    		if ("_routeComponent" in $$props) $$invalidate(7, _routeComponent = $$props._routeComponent);
    		if ("_routeInfo" in $$props) $$invalidate(8, _routeInfo = $$props._routeInfo);
    		if ("passingRouter" in $$props) $$invalidate(0, passingRouter = $$props.passingRouter);
    		if ("durations" in $$props) durations = $$props.durations;
    		if ("className" in $$props) $$invalidate(1, className = $$props.className);
    		if ("selector" in $$props) selector = $$props.selector;
    		if ("id" in $$props) id = $$props.id;
    		if ("routeComponent" in $$props) $$invalidate(2, routeComponent = $$props.routeComponent);
    		if ("routeInfo" in $$props) $$invalidate(3, routeInfo = $$props.routeInfo);
    	};

    	let routeComponent;
    	let routeInfo;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*_routeComponent*/ 128) {
    			 $$invalidate(2, routeComponent = _routeComponent);
    		}

    		if ($$self.$$.dirty[0] & /*_routeInfo*/ 256) {
    			 $$invalidate(3, routeInfo = _routeInfo);
    		}
    	};

    	return [
    		passingRouter,
    		className,
    		routeComponent,
    		routeInfo,
    		router,
    		callback,
    		transition
    	];
    }

    class RouterOutlet extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { router: 4, callback: 5, transition: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RouterOutlet",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*router*/ ctx[4] === undefined && !("router" in props)) {
    			console.warn("<RouterOutlet> was created without expected prop 'router'");
    		}

    		if (/*callback*/ ctx[5] === undefined && !("callback" in props)) {
    			console.warn("<RouterOutlet> was created without expected prop 'callback'");
    		}

    		if (/*transition*/ ctx[6] === undefined && !("transition" in props)) {
    			console.warn("<RouterOutlet> was created without expected prop 'transition'");
    		}
    	}

    	get router() {
    		throw new Error("<RouterOutlet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set router(value) {
    		throw new Error("<RouterOutlet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get callback() {
    		throw new Error("<RouterOutlet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set callback(value) {
    		throw new Error("<RouterOutlet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<RouterOutlet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<RouterOutlet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var CssTransitionService_1 = createCommonjsModule(function (module, exports) {
    var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var CssTransitionService = /** @class */ (function () {
        function CssTransitionService(transitionName) {
            this.transition = "";
            this.enteringDuration = 0;
            this.leavingDuration = 0;
            this.transition = transitionName;
            this.rule = new RegExp(".(" + this.transition + ")-(enter-active|leave-active)", "g");
            this.enterRule = new RegExp(".(" + this.transition + ")-enter-active", "g");
            this.leaveRule = new RegExp(".(" + this.transition + ")-leave-active", "g");
            var durations = this.getTransitionDurations(this.transition);
            this.enteringDuration = durations.enteringDuration;
            this.leavingDuration = durations.leavingDuration;
        }
        CssTransitionService.prototype.getDurationFromRule = function (styleRule) {
            var getMaxFromCSSString = function (key) {
                if (key !== "transitionDuration" && key !== "transitionDelay")
                    return 0;
                var durations = styleRule.style[key];
                var durationsArrayString = durations.split(",");
                var durationsArray = durationsArrayString.map(function (duration) {
                    var number = parseFloat(duration.replace(/a-zA-Z/g, "").trim());
                    var measure = duration.replace(/[0-9](\.[0-9])?/g, "").trim();
                    if (measure === "s")
                        number = number * 1000;
                    return number;
                });
                return Math.max.apply(Math, durationsArray);
            };
            var duration = getMaxFromCSSString("transitionDuration");
            var delay = getMaxFromCSSString("transitionDelay");
            return duration + delay;
        };
        CssTransitionService.prototype.getTransitionDurations = function (transition) {
            var transRule = new RegExp(".(" + transition + ")-(enter-active|leave-active)", "g");
            var transEnterRule = new RegExp(".(" + transition + ")-enter-active", "g");
            var transLeaveRule = new RegExp(".(" + transition + ")-leave-active", "g");
            var enteringDuration = 0;
            var leavingDuration = 0;
            var styles = Array.from(document.styleSheets);
            var stylesArray = [];
            for (var _i = 0, styles_1 = styles; _i < styles_1.length; _i++) {
                var style = styles_1[_i];
                var rules = void 0;
                try {
                    rules = style.rules;
                }
                catch (e) {
                    rules = null;
                }
                if (!rules)
                    continue;
                var rulesArray = Object.values(rules);
                var filteredRules = rulesArray.filter(function (rule) {
                    var operateRule = rule;
                    if (!operateRule.selectorText)
                        return false;
                    return operateRule.selectorText.match(transRule);
                });
                stylesArray.push.apply(stylesArray, filteredRules);
            }
            for (var _a = 0, stylesArray_1 = stylesArray; _a < stylesArray_1.length; _a++) {
                var _styleRule = stylesArray_1[_a];
                var styleRule = _styleRule;
                var styleText = styleRule.cssText;
                // Case 1: One rule for both entering and leaving
                if (styleText.match(transRule).length === 2) {
                    enteringDuration = leavingDuration = this.getDurationFromRule(styleRule);
                }
                // Case 2: single rule for enter and leaving
                // Entering
                if (styleText.match(transEnterRule)) {
                    enteringDuration = this.getDurationFromRule(styleRule);
                }
                // Leaving
                if (styleText.match(transLeaveRule)) {
                    leavingDuration = this.getDurationFromRule(styleRule);
                }
            }
            leavingDuration = leavingDuration + 10;
            enteringDuration = enteringDuration + 10;
            return {
                enteringDuration: enteringDuration,
                leavingDuration: leavingDuration
            };
        };
        CssTransitionService.delay = function (time) {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();
                }, time);
            });
        };
        CssTransitionService.prototype.transitionOut = function (depth) {
            return __awaiter(this, void 0, void 0, function () {
                var outlet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (depth === 0)
                                depth = -1;
                            outlet = document.querySelectorAll(".svelte-easyroute-outlet")[depth + 1];
                            if (!outlet) return [3 /*break*/, 3];
                            outlet.classList.add(this.transition + "-leave-active");
                            outlet.classList.add(this.transition + "-leave");
                            return [4 /*yield*/, CssTransitionService.delay(100)];
                        case 1:
                            _a.sent();
                            outlet.classList.remove(this.transition + "-leave");
                            outlet.classList.add(this.transition + "-leave-to");
                            return [4 /*yield*/, CssTransitionService.delay(this.leavingDuration)];
                        case 2:
                            _a.sent();
                            outlet.classList.remove(this.transition + "-leave-active");
                            outlet.classList.remove(this.transition + "-leave-to");
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        CssTransitionService.prototype.transitionIn = function (depth) {
            return __awaiter(this, void 0, void 0, function () {
                var outlet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (depth === 0)
                                depth = -1;
                            outlet = document.querySelectorAll(".svelte-easyroute-outlet")[depth + 1];
                            if (!outlet) return [3 /*break*/, 3];
                            outlet.classList.add(this.transition + "-enter-active");
                            outlet.classList.add(this.transition + "-enter");
                            return [4 /*yield*/, CssTransitionService.delay(100)];
                        case 1:
                            _a.sent();
                            outlet.classList.remove(this.transition + "-enter");
                            outlet.classList.add(this.transition + "-enter-to");
                            return [4 /*yield*/, CssTransitionService.delay(this.enteringDuration)];
                        case 2:
                            _a.sent();
                            outlet.classList.remove(this.transition + "-enter-active");
                            outlet.classList.remove(this.transition + "-enter-to");
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        CssTransitionService.prototype.propTransitionDuration = function (transition) {
            return this.getTransitionDurations(transition);
        };
        CssTransitionService.prototype.propTransitionOut = function (selector, transition, leavingDuration) {
            return __awaiter(this, void 0, void 0, function () {
                var outlet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            outlet = document.querySelector(selector);
                            if (!outlet) return [3 /*break*/, 3];
                            outlet.classList.add(transition + "-leave-active");
                            outlet.classList.add(transition + "-leave");
                            return [4 /*yield*/, CssTransitionService.delay(100)];
                        case 1:
                            _a.sent();
                            outlet.classList.remove(transition + "-leave");
                            outlet.classList.add(transition + "-leave-to");
                            return [4 /*yield*/, CssTransitionService.delay(leavingDuration)];
                        case 2:
                            _a.sent();
                            outlet.classList.remove(transition + "-leave-active");
                            outlet.classList.remove(transition + "-leave-to");
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        CssTransitionService.prototype.propTransitionIn = function (selector, transition, enteringDuration) {
            return __awaiter(this, void 0, void 0, function () {
                var outlet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            outlet = document.querySelector(selector);
                            if (!outlet) return [3 /*break*/, 3];
                            outlet.classList.add(transition + "-enter-active");
                            outlet.classList.add(transition + "-enter");
                            return [4 /*yield*/, CssTransitionService.delay(100)];
                        case 1:
                            _a.sent();
                            outlet.classList.remove(transition + "-enter");
                            outlet.classList.add(transition + "-enter-to");
                            return [4 /*yield*/, CssTransitionService.delay(enteringDuration)];
                        case 2:
                            _a.sent();
                            outlet.classList.remove(transition + "-enter-active");
                            outlet.classList.remove(transition + "-enter-to");
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return CssTransitionService;
    }());
    exports.default = CssTransitionService;
    });

    var CssTransitionService = unwrapExports(CssTransitionService_1);

    /* Users/alexeysolovjov/Desktop/work/svelte-easyroute/RouterTransition.svelte generated by Svelte v3.16.4 */
    const file$2 = "Users/alexeysolovjov/Desktop/work/svelte-easyroute/RouterTransition.svelte";
    const get_default_slot_changes = dirty => ({});
    const get_default_slot_context = ctx => ({ callback: /*fireTransition*/ ctx[1] });

    function create_fragment$2(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], get_default_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", /*classes*/ ctx[0]);
    			add_location(div, file$2, 63, 0, 1795);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot && default_slot.p && dirty[0] & /*$$scope*/ 2048) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[11], get_default_slot_context), get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, get_default_slot_changes));
    			}

    			if (!current || dirty[0] & /*classes*/ 1) {
    				attr_dev(div, "class", /*classes*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { name } = $$props;
    	const transitionService = new CssTransitionService();
    	let transition = name;
    	let durations;
    	let _classes = [];

    	if (transition) {
    		durations = transitionService.propTransitionDuration(transition);
    	}

    	const delay = ms => {
    		return new Promise(resolve => {
    				setTimeout(
    					() => {
    						resolve();
    					},
    					ms
    				);
    			});
    	};

    	let outlet = document.createElement("div");

    	async function transitionOut() {
    		outlet.classList.add(`${transition}-leave-active`);
    		outlet.classList.add(`${transition}-leave`);
    		$$invalidate(4, _classes = [...outlet.classList]);
    		await delay(100);
    		outlet.classList.remove(`${transition}-leave`);
    		outlet.classList.add(`${transition}-leave-to`);
    		$$invalidate(4, _classes = [...outlet.classList]);
    		await delay(durations.leavingDuration);
    		outlet.classList.remove(`${transition}-leave-active`);
    		outlet.classList.remove(`${transition}-leave-to`);
    		$$invalidate(4, _classes = [...outlet.classList]);
    	}

    	async function transitionIn() {
    		outlet.classList.add(`${transition}-enter-active`);
    		outlet.classList.add(`${transition}-enter`);
    		$$invalidate(4, _classes = [...outlet.classList]);
    		await delay(100);
    		outlet.classList.remove(`${transition}-enter`);
    		outlet.classList.add(`${transition}-enter-to`);
    		$$invalidate(4, _classes = [...outlet.classList]);
    		await delay(durations.leavingDuration);
    		outlet.classList.remove(`${transition}-enter-active`);
    		outlet.classList.remove(`${transition}-enter-to`);
    		$$invalidate(4, _classes = [...outlet.classList]);
    	}

    	async function fireTransition(mode) {
    		if (mode === "out") {
    			await transitionOut();
    		} else if (mode === "in") {
    			await transitionIn();
    		}
    	}

    	const writable_props = ["name"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RouterTransition> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("$$scope" in $$props) $$invalidate(11, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return {
    			name,
    			transition,
    			durations,
    			_classes,
    			outlet,
    			classes
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("transition" in $$props) transition = $$props.transition;
    		if ("durations" in $$props) durations = $$props.durations;
    		if ("_classes" in $$props) $$invalidate(4, _classes = $$props._classes);
    		if ("outlet" in $$props) outlet = $$props.outlet;
    		if ("classes" in $$props) $$invalidate(0, classes = $$props.classes);
    	};

    	let classes;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*_classes*/ 16) {
    			 $$invalidate(0, classes = _classes.join(" "));
    		}
    	};

    	return [
    		classes,
    		fireTransition,
    		name,
    		durations,
    		_classes,
    		transitionService,
    		transition,
    		delay,
    		outlet,
    		transitionOut,
    		transitionIn,
    		$$scope,
    		$$slots
    	];
    }

    class RouterTransition extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { name: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RouterTransition",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*name*/ ctx[2] === undefined && !("name" in props)) {
    			console.warn("<RouterTransition> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<RouterTransition>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<RouterTransition>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.16.4 */
    const file$3 = "src/App.svelte";

    // (24:1) <RouterLink to="/">
    function create_default_slot_6(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Index";
    			attr_dev(button, "type", "button");
    			add_location(button, file$3, 23, 20, 749);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(24:1) <RouterLink to=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (25:1) <RouterLink to="/test">
    function create_default_slot_5(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Test page";
    			attr_dev(button, "type", "button");
    			add_location(button, file$3, 24, 24, 823);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(25:1) <RouterLink to=\\\"/test\\\">",
    		ctx
    	});

    	return block;
    }

    // (26:1) <RouterLink to="/test/nested">
    function create_default_slot_4(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Nested page";
    			attr_dev(button, "type", "button");
    			add_location(button, file$3, 25, 31, 908);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(26:1) <RouterLink to=\\\"/test/nested\\\">",
    		ctx
    	});

    	return block;
    }

    // (27:1) <RouterLink to="/?name=Lyoha&status=plotinka">
    function create_default_slot_3(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Index page with query";
    			attr_dev(button, "type", "button");
    			add_location(button, file$3, 26, 47, 1011);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(27:1) <RouterLink to=\\\"/?name=Lyoha&status=plotinka\\\">",
    		ctx
    	});

    	return block;
    }

    // (28:1) <RouterLink to="/test?name=Alex&age=22">
    function create_default_slot_2(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Test page with query";
    			attr_dev(button, "type", "button");
    			add_location(button, file$3, 27, 41, 1118);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(28:1) <RouterLink to=\\\"/test?name=Alex&age=22\\\">",
    		ctx
    	});

    	return block;
    }

    // (29:1) <RouterLink to="/playground/easy/params/route">
    function create_default_slot_1(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Router params playground";
    			attr_dev(button, "type", "button");
    			add_location(button, file$3, 28, 48, 1231);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(29:1) <RouterLink to=\\\"/playground/easy/params/route\\\">",
    		ctx
    	});

    	return block;
    }

    // (33:1) <RouterTransition name="xfade" let:callback>
    function create_default_slot(ctx) {
    	let current;

    	const routeroutlet = new RouterOutlet({
    			props: {
    				router: /*router*/ ctx[0],
    				callback: /*callback*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(routeroutlet.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(routeroutlet, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const routeroutlet_changes = {};
    			if (dirty[0] & /*router*/ 1) routeroutlet_changes.router = /*router*/ ctx[0];
    			if (dirty[0] & /*callback*/ 2) routeroutlet_changes.callback = /*callback*/ ctx[1];
    			routeroutlet.$set(routeroutlet_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(routeroutlet.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(routeroutlet.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(routeroutlet, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(33:1) <RouterTransition name=\\\"xfade\\\" let:callback>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div0;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let pre;
    	let br0;
    	let t4;
    	let br1;
    	let t5;
    	let br2;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let hr;
    	let t13;
    	let div1;
    	let current;

    	const routerlink0 = new RouterLink({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const routerlink1 = new RouterLink({
    			props: {
    				to: "/test",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const routerlink2 = new RouterLink({
    			props: {
    				to: "/test/nested",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const routerlink3 = new RouterLink({
    			props: {
    				to: "/?name=Lyoha&status=plotinka",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const routerlink4 = new RouterLink({
    			props: {
    				to: "/test?name=Alex&age=22",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const routerlink5 = new RouterLink({
    			props: {
    				to: "/playground/easy/params/route",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const routertransition = new RouterTransition({
    			props: {
    				name: "xfade",
    				$$slots: {
    					default: [
    						create_default_slot,
    						({ callback }) => ({ 1: callback }),
    						({ callback }) => [callback ? 2 : 0]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "svelte easyroute demo";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Check out console for router hooks";
    			t3 = space();
    			pre = element("pre");
    			br0 = element("br");
    			t4 = text("# Try me locally");
    			br1 = element("br");
    			t5 = text("npx degit lyohaplotinka/svelte-easyroute-demo yourapp\n\t");
    			br2 = element("br");
    			t6 = space();
    			create_component(routerlink0.$$.fragment);
    			t7 = space();
    			create_component(routerlink1.$$.fragment);
    			t8 = space();
    			create_component(routerlink2.$$.fragment);
    			t9 = space();
    			create_component(routerlink3.$$.fragment);
    			t10 = space();
    			create_component(routerlink4.$$.fragment);
    			t11 = space();
    			create_component(routerlink5.$$.fragment);
    			t12 = space();
    			hr = element("hr");
    			t13 = space();
    			div1 = element("div");
    			create_component(routertransition.$$.fragment);
    			attr_dev(h1, "class", "svelte-1kgcpkd");
    			add_location(h1, file$3, 19, 1, 467);
    			add_location(p, file$3, 20, 1, 499);
    			add_location(br0, file$3, 21, 98, 639);
    			add_location(br1, file$3, 21, 118, 659);
    			set_style(pre, "max-width", "500px");
    			set_style(pre, "margin", "0 auto");
    			set_style(pre, "text-align", "left");
    			set_style(pre, "background", "#e2e2e2");
    			set_style(pre, "color", "black");
    			add_location(pre, file$3, 21, 1, 542);
    			add_location(br2, file$3, 22, 7, 724);
    			add_location(hr, file$3, 29, 1, 1301);
    			attr_dev(div0, "class", "container-fluid mt-3 mb-3 text-center");
    			add_location(div0, file$3, 18, 0, 414);
    			attr_dev(div1, "class", "container mt-5 shadowbox");
    			add_location(div1, file$3, 31, 0, 1313);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(div0, t3);
    			append_dev(div0, pre);
    			append_dev(pre, br0);
    			append_dev(pre, t4);
    			append_dev(pre, br1);
    			append_dev(pre, t5);
    			append_dev(div0, br2);
    			append_dev(div0, t6);
    			mount_component(routerlink0, div0, null);
    			append_dev(div0, t7);
    			mount_component(routerlink1, div0, null);
    			append_dev(div0, t8);
    			mount_component(routerlink2, div0, null);
    			append_dev(div0, t9);
    			mount_component(routerlink3, div0, null);
    			append_dev(div0, t10);
    			mount_component(routerlink4, div0, null);
    			append_dev(div0, t11);
    			mount_component(routerlink5, div0, null);
    			append_dev(div0, t12);
    			append_dev(div0, hr);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(routertransition, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const routerlink0_changes = {};

    			if (dirty[0] & /*$$scope*/ 4) {
    				routerlink0_changes.$$scope = { dirty, ctx };
    			}

    			routerlink0.$set(routerlink0_changes);
    			const routerlink1_changes = {};

    			if (dirty[0] & /*$$scope*/ 4) {
    				routerlink1_changes.$$scope = { dirty, ctx };
    			}

    			routerlink1.$set(routerlink1_changes);
    			const routerlink2_changes = {};

    			if (dirty[0] & /*$$scope*/ 4) {
    				routerlink2_changes.$$scope = { dirty, ctx };
    			}

    			routerlink2.$set(routerlink2_changes);
    			const routerlink3_changes = {};

    			if (dirty[0] & /*$$scope*/ 4) {
    				routerlink3_changes.$$scope = { dirty, ctx };
    			}

    			routerlink3.$set(routerlink3_changes);
    			const routerlink4_changes = {};

    			if (dirty[0] & /*$$scope*/ 4) {
    				routerlink4_changes.$$scope = { dirty, ctx };
    			}

    			routerlink4.$set(routerlink4_changes);
    			const routerlink5_changes = {};

    			if (dirty[0] & /*$$scope*/ 4) {
    				routerlink5_changes.$$scope = { dirty, ctx };
    			}

    			routerlink5.$set(routerlink5_changes);
    			const routertransition_changes = {};

    			if (dirty[0] & /*$$scope, router, callback*/ 7) {
    				routertransition_changes.$$scope = { dirty, ctx };
    			}

    			routertransition.$set(routertransition_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(routerlink0.$$.fragment, local);
    			transition_in(routerlink1.$$.fragment, local);
    			transition_in(routerlink2.$$.fragment, local);
    			transition_in(routerlink3.$$.fragment, local);
    			transition_in(routerlink4.$$.fragment, local);
    			transition_in(routerlink5.$$.fragment, local);
    			transition_in(routertransition.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(routerlink0.$$.fragment, local);
    			transition_out(routerlink1.$$.fragment, local);
    			transition_out(routerlink2.$$.fragment, local);
    			transition_out(routerlink3.$$.fragment, local);
    			transition_out(routerlink4.$$.fragment, local);
    			transition_out(routerlink5.$$.fragment, local);
    			transition_out(routertransition.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(routerlink0);
    			destroy_component(routerlink1);
    			destroy_component(routerlink2);
    			destroy_component(routerlink3);
    			destroy_component(routerlink4);
    			destroy_component(routerlink5);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(div1);
    			destroy_component(routertransition);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { router } = $$props;

    	onMount(() => {
    		
    	});

    	const writable_props = ["router"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("router" in $$props) $$invalidate(0, router = $$props.router);
    	};

    	$$self.$capture_state = () => {
    		return { router };
    	};

    	$$self.$inject_state = $$props => {
    		if ("router" in $$props) $$invalidate(0, router = $$props.router);
    	};

    	return [router];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { router: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*router*/ ctx[0] === undefined && !("router" in props)) {
    			console.warn("<App> was created without expected prop 'router'");
    		}
    	}

    	get router() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set router(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Index.svelte generated by Svelte v3.16.4 */

    const { Object: Object_1 } = globals;
    const file$4 = "src/Index.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (22:20) {#each Object.keys(currentRoute.query) as key}
    function create_each_block(ctx) {
    	let p;
    	let t0_value = /*key*/ ctx[2] + "";
    	let t0;
    	let t1;
    	let t2_value = /*currentRoute*/ ctx[0].query[/*key*/ ctx[2]] + "";
    	let t2;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = text(" ... ");
    			t2 = text(t2_value);
    			add_location(p, file$4, 22, 24, 653);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentRoute*/ 1 && t0_value !== (t0_value = /*key*/ ctx[2] + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*currentRoute*/ 1 && t2_value !== (t2_value = /*currentRoute*/ ctx[0].query[/*key*/ ctx[2]] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(22:20) {#each Object.keys(currentRoute.query) as key}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div5;
    	let h3;
    	let t1;
    	let div4;
    	let div3;
    	let div0;
    	let h50;
    	let t3;
    	let pre0;
    	let t5;
    	let div1;
    	let h51;
    	let t7;
    	let pre1;
    	let t8;
    	let div2;
    	let h52;
    	let t10;
    	let p0;
    	let a0;
    	let t12;
    	let p1;
    	let a1;
    	let each_value = Object.keys(/*currentRoute*/ ctx[0].query);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Index page";
    			t1 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Current path:";
    			t3 = space();
    			pre0 = element("pre");
    			pre0.textContent = `${/*parsedRoute*/ ctx[1]}`;
    			t5 = space();
    			div1 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Query params:";
    			t7 = space();
    			pre1 = element("pre");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			div2 = element("div");
    			h52 = element("h5");
    			h52.textContent = "Links:";
    			t10 = space();
    			p0 = element("p");
    			a0 = element("a");
    			a0.textContent = "GitHub";
    			t12 = space();
    			p1 = element("p");
    			a1 = element("a");
    			a1.textContent = "Home page";
    			attr_dev(h3, "class", "text-center");
    			add_location(h3, file$4, 9, 4, 189);
    			add_location(h50, file$4, 13, 16, 345);
    			add_location(pre0, file$4, 14, 16, 384);
    			attr_dev(div0, "class", "col-md-4");
    			add_location(div0, file$4, 12, 12, 306);
    			add_location(h51, file$4, 19, 16, 517);
    			add_location(pre1, file$4, 20, 16, 556);
    			attr_dev(div1, "class", "col-md-4");
    			add_location(div1, file$4, 18, 12, 478);
    			add_location(h52, file$4, 27, 16, 817);
    			attr_dev(a0, "href", "https://github.com/lyohaplotinka/svelte-easyroute");
    			add_location(a0, file$4, 28, 19, 852);
    			add_location(p0, file$4, 28, 16, 849);
    			attr_dev(a1, "href", "https://lyoha.info/en/projects/svelterouter");
    			add_location(a1, file$4, 29, 19, 946);
    			add_location(p1, file$4, 29, 16, 943);
    			attr_dev(div2, "class", "col-md-4");
    			add_location(div2, file$4, 26, 12, 778);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$4, 11, 8, 276);
    			attr_dev(div4, "class", "container-fluid mt-5");
    			add_location(div4, file$4, 10, 4, 233);
    			attr_dev(div5, "class", "container-fluid index-page");
    			add_location(div5, file$4, 8, 0, 144);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, h3);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h50);
    			append_dev(div0, t3);
    			append_dev(div0, pre0);
    			append_dev(div3, t5);
    			append_dev(div3, div1);
    			append_dev(div1, h51);
    			append_dev(div1, t7);
    			append_dev(div1, pre1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(pre1, null);
    			}

    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div2, h52);
    			append_dev(div2, t10);
    			append_dev(div2, p0);
    			append_dev(p0, a0);
    			append_dev(div2, t12);
    			append_dev(div2, p1);
    			append_dev(p1, a1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentRoute*/ 1) {
    				each_value = Object.keys(/*currentRoute*/ ctx[0].query);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(pre1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { currentRoute } = $$props;
    	let parsedRoute = JSON.stringify(currentRoute, false, 2);
    	const writable_props = ["currentRoute"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Index> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    	};

    	$$self.$capture_state = () => {
    		return { currentRoute, parsedRoute };
    	};

    	$$self.$inject_state = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    		if ("parsedRoute" in $$props) $$invalidate(1, parsedRoute = $$props.parsedRoute);
    	};

    	return [currentRoute, parsedRoute];
    }

    class Index extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { currentRoute: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*currentRoute*/ ctx[0] === undefined && !("currentRoute" in props)) {
    			console.warn("<Index> was created without expected prop 'currentRoute'");
    		}
    	}

    	get currentRoute() {
    		throw new Error("<Index>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentRoute(value) {
    		throw new Error("<Index>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* Users/alexeysolovjov/Desktop/work/svelte-easyroute/RouterNestedOutlet.svelte generated by Svelte v3.16.4 */
    const file$5 = "Users/alexeysolovjov/Desktop/work/svelte-easyroute/RouterNestedOutlet.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let current;
    	var switch_value = /*_comp*/ ctx[2];

    	function switch_props(ctx) {
    		return {
    			props: { router: /*router*/ ctx[0] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", "svelte-easyroute-outlet");
    			add_location(div, file$5, 71, 0, 1616);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			/*div_binding*/ ctx[12](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty[0] & /*router*/ 1) switch_instance_changes.router = /*router*/ ctx[0];

    			if (switch_value !== (switch_value = /*_comp*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    			/*div_binding*/ ctx[12](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getElementIndex(node) {
    	let allOutlets = document.querySelectorAll(".svelte-easyroute-outlet");
    	return [...allOutlets].indexOf(node);
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { router } = $$props;
    	let { callback = () => false } = $$props;
    	let comp;
    	let _router = router;
    	let passingRouter;
    	let element;
    	let component;
    	let index = 0;

    	const delay = ms => {
    		return new Promise(resolve => {
    				setTimeout(
    					() => {
    						resolve();
    					},
    					ms
    				);
    			});
    	};

    	function getComponent() {
    		let route = router.currentRoute.routeObject;

    		for (let i = 0; i < index; i++) {
    			if (!route) break;
    			route = route.nested;
    		}

    		if (route) component = route.component; else component = false;
    	}

    	async function changeComponent(routerUpdate = true) {
    		let nestingTo = router.currentRoute.nestingTo;
    		index = getElementIndex(element);

    		if (index <= nestingTo) {
    			if (router && router.currentRoute.routeObject.nested && router.currentRoute.routeObject.nested.component) {
    				$$invalidate(4, comp = false);
    				await delay(2);
    				await callback("out");
    				getComponent();
    				$$invalidate(4, comp = component);
    				await callback("in");
    				passingRouter = router;
    			}
    		}
    	}

    	window.addEventListener("RouterUpdate", changeComponent);

    	onMount(() => {
    		index = getElementIndex(element);
    		getComponent();
    		changeComponent(false);
    	});

    	onDestroy(() => {
    		return new Promise(resolve => {
    				setTimeout(
    					() => {
    						resolve();
    					},
    					3000
    				);
    			});
    	});

    	const writable_props = ["router", "callback"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RouterNestedOutlet> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(1, element = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("router" in $$props) $$invalidate(0, router = $$props.router);
    		if ("callback" in $$props) $$invalidate(3, callback = $$props.callback);
    	};

    	$$self.$capture_state = () => {
    		return {
    			router,
    			callback,
    			comp,
    			_router,
    			passingRouter,
    			element,
    			component,
    			index,
    			_comp
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("router" in $$props) $$invalidate(0, router = $$props.router);
    		if ("callback" in $$props) $$invalidate(3, callback = $$props.callback);
    		if ("comp" in $$props) $$invalidate(4, comp = $$props.comp);
    		if ("_router" in $$props) _router = $$props._router;
    		if ("passingRouter" in $$props) passingRouter = $$props.passingRouter;
    		if ("element" in $$props) $$invalidate(1, element = $$props.element);
    		if ("component" in $$props) component = $$props.component;
    		if ("index" in $$props) index = $$props.index;
    		if ("_comp" in $$props) $$invalidate(2, _comp = $$props._comp);
    	};

    	let _comp;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*comp*/ 16) {
    			 $$invalidate(2, _comp = comp);
    		}
    	};

    	return [
    		router,
    		element,
    		_comp,
    		callback,
    		comp,
    		passingRouter,
    		component,
    		index,
    		_router,
    		delay,
    		getComponent,
    		changeComponent,
    		div_binding
    	];
    }

    class RouterNestedOutlet extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { router: 0, callback: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RouterNestedOutlet",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*router*/ ctx[0] === undefined && !("router" in props)) {
    			console.warn("<RouterNestedOutlet> was created without expected prop 'router'");
    		}
    	}

    	get router() {
    		throw new Error("<RouterNestedOutlet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set router(value) {
    		throw new Error("<RouterNestedOutlet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get callback() {
    		throw new Error("<RouterNestedOutlet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set callback(value) {
    		throw new Error("<RouterNestedOutlet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Test.svelte generated by Svelte v3.16.4 */

    const { Object: Object_1$1 } = globals;
    const file$6 = "src/Test.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (16:4) <RouterTransition name="xfade" let:callback>
    function create_default_slot$1(ctx) {
    	let current;

    	const nestedoutlet = new RouterNestedOutlet({
    			props: {
    				router: /*router*/ ctx[1],
    				callback: /*callback*/ ctx[7]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(nestedoutlet.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(nestedoutlet, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const nestedoutlet_changes = {};
    			if (dirty[0] & /*router*/ 2) nestedoutlet_changes.router = /*router*/ ctx[1];
    			if (dirty[0] & /*callback*/ 128) nestedoutlet_changes.callback = /*callback*/ ctx[7];
    			nestedoutlet.$set(nestedoutlet_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nestedoutlet.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nestedoutlet.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nestedoutlet, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(16:4) <RouterTransition name=\\\"xfade\\\" let:callback>",
    		ctx
    	});

    	return block;
    }

    // (30:20) {#each Object.keys(currentRoute.query) as key}
    function create_each_block$1(ctx) {
    	let p;
    	let t0_value = /*key*/ ctx[4] + "";
    	let t0;
    	let t1;
    	let t2_value = /*currentRoute*/ ctx[0].query[/*key*/ ctx[4]] + "";
    	let t2;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = text(" ... ");
    			t2 = text(t2_value);
    			add_location(p, file$6, 30, 24, 976);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentRoute*/ 1 && t0_value !== (t0_value = /*key*/ ctx[4] + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*currentRoute*/ 1 && t2_value !== (t2_value = /*currentRoute*/ ctx[0].query[/*key*/ ctx[4]] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(30:20) {#each Object.keys(currentRoute.query) as key}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div5;
    	let h3;
    	let t1;
    	let t2;
    	let div4;
    	let div3;
    	let div0;
    	let h50;
    	let t4;
    	let pre0;
    	let t6;
    	let div1;
    	let h51;
    	let t8;
    	let pre1;
    	let t9;
    	let div2;
    	let h52;
    	let t11;
    	let p0;
    	let a0;
    	let t13;
    	let p1;
    	let a1;
    	let current;

    	const routertransition = new RouterTransition({
    			props: {
    				name: "xfade",
    				$$slots: {
    					default: [
    						create_default_slot$1,
    						({ callback }) => ({ 7: callback }),
    						({ callback }) => [callback ? 128 : 0]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = Object.keys(/*currentRoute*/ ctx[0].query);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			h3 = element("h3");
    			h3.textContent = "TEST page";
    			t1 = space();
    			create_component(routertransition.$$.fragment);
    			t2 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Current path:";
    			t4 = space();
    			pre0 = element("pre");
    			pre0.textContent = `${/*parsedRoute*/ ctx[2]}`;
    			t6 = space();
    			div1 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Query params:";
    			t8 = space();
    			pre1 = element("pre");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t9 = space();
    			div2 = element("div");
    			h52 = element("h5");
    			h52.textContent = "Links:";
    			t11 = space();
    			p0 = element("p");
    			a0 = element("a");
    			a0.textContent = "GitHub";
    			t13 = space();
    			p1 = element("p");
    			a1 = element("a");
    			a1.textContent = "Home page";
    			attr_dev(h3, "class", "text-center");
    			add_location(h3, file$6, 14, 4, 382);
    			add_location(h50, file$6, 21, 16, 668);
    			add_location(pre0, file$6, 22, 16, 707);
    			attr_dev(div0, "class", "col-md-4");
    			add_location(div0, file$6, 20, 12, 629);
    			add_location(h51, file$6, 27, 16, 840);
    			add_location(pre1, file$6, 28, 16, 879);
    			attr_dev(div1, "class", "col-md-4");
    			add_location(div1, file$6, 26, 12, 801);
    			add_location(h52, file$6, 35, 16, 1140);
    			attr_dev(a0, "href", "https://github.com/lyohaplotinka/svelte-easyroute");
    			add_location(a0, file$6, 36, 19, 1175);
    			add_location(p0, file$6, 36, 16, 1172);
    			attr_dev(a1, "href", "https://lyoha.info/en/projects/svelterouter");
    			add_location(a1, file$6, 37, 19, 1269);
    			add_location(p1, file$6, 37, 16, 1266);
    			attr_dev(div2, "class", "col-md-4");
    			add_location(div2, file$6, 34, 12, 1101);
    			attr_dev(div3, "class", "row");
    			add_location(div3, file$6, 19, 8, 599);
    			attr_dev(div4, "class", "container-fluid mt-5");
    			add_location(div4, file$6, 18, 4, 556);
    			attr_dev(div5, "class", "container-fluid index-page mt-3");
    			add_location(div5, file$6, 13, 0, 332);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, h3);
    			append_dev(div5, t1);
    			mount_component(routertransition, div5, null);
    			append_dev(div5, t2);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h50);
    			append_dev(div0, t4);
    			append_dev(div0, pre0);
    			append_dev(div3, t6);
    			append_dev(div3, div1);
    			append_dev(div1, h51);
    			append_dev(div1, t8);
    			append_dev(div1, pre1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(pre1, null);
    			}

    			append_dev(div3, t9);
    			append_dev(div3, div2);
    			append_dev(div2, h52);
    			append_dev(div2, t11);
    			append_dev(div2, p0);
    			append_dev(p0, a0);
    			append_dev(div2, t13);
    			append_dev(div2, p1);
    			append_dev(p1, a1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const routertransition_changes = {};

    			if (dirty[0] & /*$$scope, router, callback*/ 386) {
    				routertransition_changes.$$scope = { dirty, ctx };
    			}

    			routertransition.$set(routertransition_changes);

    			if (dirty[0] & /*currentRoute*/ 1) {
    				each_value = Object.keys(/*currentRoute*/ ctx[0].query);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(pre1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(routertransition.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(routertransition.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(routertransition);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { currentRoute } = $$props;
    	let { router } = $$props;
    	let { nested } = $$props;
    	let parsedRoute = JSON.stringify(currentRoute, false, 2);
    	const writable_props = ["currentRoute", "router", "nested"];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Test> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    		if ("router" in $$props) $$invalidate(1, router = $$props.router);
    		if ("nested" in $$props) $$invalidate(3, nested = $$props.nested);
    	};

    	$$self.$capture_state = () => {
    		return {
    			currentRoute,
    			router,
    			nested,
    			parsedRoute
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    		if ("router" in $$props) $$invalidate(1, router = $$props.router);
    		if ("nested" in $$props) $$invalidate(3, nested = $$props.nested);
    		if ("parsedRoute" in $$props) $$invalidate(2, parsedRoute = $$props.parsedRoute);
    	};

    	return [currentRoute, router, parsedRoute, nested];
    }

    class Test extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { currentRoute: 0, router: 1, nested: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Test",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*currentRoute*/ ctx[0] === undefined && !("currentRoute" in props)) {
    			console.warn("<Test> was created without expected prop 'currentRoute'");
    		}

    		if (/*router*/ ctx[1] === undefined && !("router" in props)) {
    			console.warn("<Test> was created without expected prop 'router'");
    		}

    		if (/*nested*/ ctx[3] === undefined && !("nested" in props)) {
    			console.warn("<Test> was created without expected prop 'nested'");
    		}
    	}

    	get currentRoute() {
    		throw new Error("<Test>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentRoute(value) {
    		throw new Error("<Test>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get router() {
    		throw new Error("<Test>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set router(value) {
    		throw new Error("<Test>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nested() {
    		throw new Error("<Test>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nested(value) {
    		throw new Error("<Test>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ParamsPlayground.svelte generated by Svelte v3.16.4 */

    const { console: console_1 } = globals;
    const file$7 = "src/ParamsPlayground.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let h1;
    	let br0;
    	let t1;
    	let p0;
    	let t3;
    	let pre0;
    	let t5;
    	let p1;
    	let t7;
    	let pre1;
    	let t8_value = JSON.stringify(/*currentRoute*/ ctx[0].params, false, 2) + "";
    	let t8;
    	let t9;
    	let p2;
    	let t11;
    	let br1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Params Playground";
    			br0 = element("br");
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "This is a dynamic route. It's url defined like:";
    			t3 = space();
    			pre0 = element("pre");
    			pre0.textContent = "path: \"/playground/:param1/params/:param2\"";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "And here what we have in currentRoute:";
    			t7 = space();
    			pre1 = element("pre");
    			t8 = text(t8_value);
    			t9 = space();
    			p2 = element("p");
    			p2.textContent = "Feel free to change parameters in URL and see the results.";
    			t11 = space();
    			br1 = element("br");
    			add_location(h1, file$7, 6, 4, 121);
    			add_location(br0, file$7, 6, 30, 147);
    			add_location(p0, file$7, 7, 4, 156);
    			set_style(pre0, "background", "lightgray");
    			set_style(pre0, "color", "black");
    			add_location(pre0, file$7, 8, 4, 215);
    			add_location(p1, file$7, 9, 4, 317);
    			add_location(pre1, file$7, 10, 4, 367);
    			add_location(p2, file$7, 11, 4, 428);
    			add_location(br1, file$7, 12, 4, 498);
    			attr_dev(div, "class", "container-fluid mt-3 text-center");
    			add_location(div, file$7, 5, 0, 70);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, br0);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(div, t3);
    			append_dev(div, pre0);
    			append_dev(div, t5);
    			append_dev(div, p1);
    			append_dev(div, t7);
    			append_dev(div, pre1);
    			append_dev(pre1, t8);
    			append_dev(div, t9);
    			append_dev(div, p2);
    			append_dev(div, t11);
    			append_dev(div, br1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentRoute*/ 1 && t8_value !== (t8_value = JSON.stringify(/*currentRoute*/ ctx[0].params, false, 2) + "")) set_data_dev(t8, t8_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { currentRoute } = $$props;
    	console.log(currentRoute);
    	const writable_props = ["currentRoute"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<ParamsPlayground> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    	};

    	$$self.$capture_state = () => {
    		return { currentRoute };
    	};

    	$$self.$inject_state = $$props => {
    		if ("currentRoute" in $$props) $$invalidate(0, currentRoute = $$props.currentRoute);
    	};

    	return [currentRoute];
    }

    class ParamsPlayground extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { currentRoute: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ParamsPlayground",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*currentRoute*/ ctx[0] === undefined && !("currentRoute" in props)) {
    			console_1.warn("<ParamsPlayground> was created without expected prop 'currentRoute'");
    		}
    	}

    	get currentRoute() {
    		throw new Error("<ParamsPlayground>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentRoute(value) {
    		throw new Error("<ParamsPlayground>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Nested.svelte generated by Svelte v3.16.4 */
    const file$8 = "src/Nested.svelte";

    function create_fragment$8(ctx) {
    	let h1;
    	let t1;
    	let current;

    	const nestedoutlet = new RouterNestedOutlet({
    			props: { router: /*router*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Nested!";
    			t1 = space();
    			create_component(nestedoutlet.$$.fragment);
    			add_location(h1, file$8, 5, 0, 114);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(nestedoutlet, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const nestedoutlet_changes = {};
    			if (dirty[0] & /*router*/ 1) nestedoutlet_changes.router = /*router*/ ctx[0];
    			nestedoutlet.$set(nestedoutlet_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nestedoutlet.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nestedoutlet.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			destroy_component(nestedoutlet, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { router } = $$props;
    	const writable_props = ["router"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nested> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("router" in $$props) $$invalidate(0, router = $$props.router);
    	};

    	$$self.$capture_state = () => {
    		return { router };
    	};

    	$$self.$inject_state = $$props => {
    		if ("router" in $$props) $$invalidate(0, router = $$props.router);
    	};

    	return [router];
    }

    class Nested extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { router: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nested",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*router*/ ctx[0] === undefined && !("router" in props)) {
    			console.warn("<Nested> was created without expected prop 'router'");
    		}
    	}

    	get router() {
    		throw new Error("<Nested>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set router(value) {
    		throw new Error("<Nested>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/NestedDeep.svelte generated by Svelte v3.16.4 */
    const file$9 = "src/NestedDeep.svelte";

    function create_fragment$9(ctx) {
    	let h1;
    	let t1;
    	let current;

    	const nestedoutlet = new RouterNestedOutlet({
    			props: { router: /*router*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Nested Deep!";
    			t1 = space();
    			create_component(nestedoutlet.$$.fragment);
    			add_location(h1, file$9, 5, 0, 114);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(nestedoutlet, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const nestedoutlet_changes = {};
    			if (dirty[0] & /*router*/ 1) nestedoutlet_changes.router = /*router*/ ctx[0];
    			nestedoutlet.$set(nestedoutlet_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nestedoutlet.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nestedoutlet.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			destroy_component(nestedoutlet, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { router } = $$props;
    	const writable_props = ["router"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NestedDeep> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("router" in $$props) $$invalidate(0, router = $$props.router);
    	};

    	$$self.$capture_state = () => {
    		return { router };
    	};

    	$$self.$inject_state = $$props => {
    		if ("router" in $$props) $$invalidate(0, router = $$props.router);
    	};

    	return [router];
    }

    class NestedDeep extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { router: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NestedDeep",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*router*/ ctx[0] === undefined && !("router" in props)) {
    			console.warn("<NestedDeep> was created without expected prop 'router'");
    		}
    	}

    	get router() {
    		throw new Error("<NestedDeep>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set router(value) {
    		throw new Error("<NestedDeep>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var RouterException_1 = createCommonjsModule(function (module, exports) {
    var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    var RouterException = /** @class */ (function (_super) {
        __extends(RouterException, _super);
        function RouterException(message) {
            return _super.call(this, "Easyroute Error :: " + message) || this;
        }
        return RouterException;
    }(Error));
    exports.RouterException = RouterException;
    });

    unwrapExports(RouterException_1);
    var RouterException_2 = RouterException_1.RouterException;

    var isarray = Array.isArray || function (arr) {
      return Object.prototype.toString.call(arr) == '[object Array]';
    };

    /**
     * Expose `pathToRegexp`.
     */
    var pathToRegexp_1 = pathToRegexp;
    var parse_1 = parse;
    var compile_1 = compile;
    var tokensToFunction_1 = tokensToFunction;
    var tokensToRegExp_1 = tokensToRegExp;

    /**
     * The main path matching regexp utility.
     *
     * @type {RegExp}
     */
    var PATH_REGEXP = new RegExp([
      // Match escaped characters that would otherwise appear in future matches.
      // This allows the user to escape special characters that won't transform.
      '(\\\\.)',
      // Match Express-style parameters and un-named parameters with a prefix
      // and optional suffixes. Matches appear as:
      //
      // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
      // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
      // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
      '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
    ].join('|'), 'g');

    /**
     * Parse a string for the raw tokens.
     *
     * @param  {string}  str
     * @param  {Object=} options
     * @return {!Array}
     */
    function parse (str, options) {
      var tokens = [];
      var key = 0;
      var index = 0;
      var path = '';
      var defaultDelimiter = options && options.delimiter || '/';
      var res;

      while ((res = PATH_REGEXP.exec(str)) != null) {
        var m = res[0];
        var escaped = res[1];
        var offset = res.index;
        path += str.slice(index, offset);
        index = offset + m.length;

        // Ignore already escaped sequences.
        if (escaped) {
          path += escaped[1];
          continue
        }

        var next = str[index];
        var prefix = res[2];
        var name = res[3];
        var capture = res[4];
        var group = res[5];
        var modifier = res[6];
        var asterisk = res[7];

        // Push the current path onto the tokens.
        if (path) {
          tokens.push(path);
          path = '';
        }

        var partial = prefix != null && next != null && next !== prefix;
        var repeat = modifier === '+' || modifier === '*';
        var optional = modifier === '?' || modifier === '*';
        var delimiter = res[2] || defaultDelimiter;
        var pattern = capture || group;

        tokens.push({
          name: name || key++,
          prefix: prefix || '',
          delimiter: delimiter,
          optional: optional,
          repeat: repeat,
          partial: partial,
          asterisk: !!asterisk,
          pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
        });
      }

      // Match any characters still remaining.
      if (index < str.length) {
        path += str.substr(index);
      }

      // If the path exists, push it onto the end.
      if (path) {
        tokens.push(path);
      }

      return tokens
    }

    /**
     * Compile a string to a template function for the path.
     *
     * @param  {string}             str
     * @param  {Object=}            options
     * @return {!function(Object=, Object=)}
     */
    function compile (str, options) {
      return tokensToFunction(parse(str, options), options)
    }

    /**
     * Prettier encoding of URI path segments.
     *
     * @param  {string}
     * @return {string}
     */
    function encodeURIComponentPretty (str) {
      return encodeURI(str).replace(/[\/?#]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase()
      })
    }

    /**
     * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
     *
     * @param  {string}
     * @return {string}
     */
    function encodeAsterisk (str) {
      return encodeURI(str).replace(/[?#]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase()
      })
    }

    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction (tokens, options) {
      // Compile all the tokens into regexps.
      var matches = new Array(tokens.length);

      // Compile all the patterns before compilation.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] === 'object') {
          matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$', flags(options));
        }
      }

      return function (obj, opts) {
        var path = '';
        var data = obj || {};
        var options = opts || {};
        var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

        for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i];

          if (typeof token === 'string') {
            path += token;

            continue
          }

          var value = data[token.name];
          var segment;

          if (value == null) {
            if (token.optional) {
              // Prepend partial segment prefixes.
              if (token.partial) {
                path += token.prefix;
              }

              continue
            } else {
              throw new TypeError('Expected "' + token.name + '" to be defined')
            }
          }

          if (isarray(value)) {
            if (!token.repeat) {
              throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
            }

            if (value.length === 0) {
              if (token.optional) {
                continue
              } else {
                throw new TypeError('Expected "' + token.name + '" to not be empty')
              }
            }

            for (var j = 0; j < value.length; j++) {
              segment = encode(value[j]);

              if (!matches[i].test(segment)) {
                throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
              }

              path += (j === 0 ? token.prefix : token.delimiter) + segment;
            }

            continue
          }

          segment = token.asterisk ? encodeAsterisk(value) : encode(value);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }

          path += token.prefix + segment;
        }

        return path
      }
    }

    /**
     * Escape a regular expression string.
     *
     * @param  {string} str
     * @return {string}
     */
    function escapeString (str) {
      return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
    }

    /**
     * Escape the capturing group by escaping special characters and meaning.
     *
     * @param  {string} group
     * @return {string}
     */
    function escapeGroup (group) {
      return group.replace(/([=!:$\/()])/g, '\\$1')
    }

    /**
     * Attach the keys as a property of the regexp.
     *
     * @param  {!RegExp} re
     * @param  {Array}   keys
     * @return {!RegExp}
     */
    function attachKeys (re, keys) {
      re.keys = keys;
      return re
    }

    /**
     * Get the flags for a regexp from the options.
     *
     * @param  {Object} options
     * @return {string}
     */
    function flags (options) {
      return options && options.sensitive ? '' : 'i'
    }

    /**
     * Pull out keys from a regexp.
     *
     * @param  {!RegExp} path
     * @param  {!Array}  keys
     * @return {!RegExp}
     */
    function regexpToRegexp (path, keys) {
      // Use a negative lookahead to match only capturing groups.
      var groups = path.source.match(/\((?!\?)/g);

      if (groups) {
        for (var i = 0; i < groups.length; i++) {
          keys.push({
            name: i,
            prefix: null,
            delimiter: null,
            optional: false,
            repeat: false,
            partial: false,
            asterisk: false,
            pattern: null
          });
        }
      }

      return attachKeys(path, keys)
    }

    /**
     * Transform an array into a regexp.
     *
     * @param  {!Array}  path
     * @param  {Array}   keys
     * @param  {!Object} options
     * @return {!RegExp}
     */
    function arrayToRegexp (path, keys, options) {
      var parts = [];

      for (var i = 0; i < path.length; i++) {
        parts.push(pathToRegexp(path[i], keys, options).source);
      }

      var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

      return attachKeys(regexp, keys)
    }

    /**
     * Create a path regexp from string input.
     *
     * @param  {string}  path
     * @param  {!Array}  keys
     * @param  {!Object} options
     * @return {!RegExp}
     */
    function stringToRegexp (path, keys, options) {
      return tokensToRegExp(parse(path, options), keys, options)
    }

    /**
     * Expose a function for taking tokens and returning a RegExp.
     *
     * @param  {!Array}          tokens
     * @param  {(Array|Object)=} keys
     * @param  {Object=}         options
     * @return {!RegExp}
     */
    function tokensToRegExp (tokens, keys, options) {
      if (!isarray(keys)) {
        options = /** @type {!Object} */ (keys || options);
        keys = [];
      }

      options = options || {};

      var strict = options.strict;
      var end = options.end !== false;
      var route = '';

      // Iterate over the tokens and create our regexp string.
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          route += escapeString(token);
        } else {
          var prefix = escapeString(token.prefix);
          var capture = '(?:' + token.pattern + ')';

          keys.push(token);

          if (token.repeat) {
            capture += '(?:' + prefix + capture + ')*';
          }

          if (token.optional) {
            if (!token.partial) {
              capture = '(?:' + prefix + '(' + capture + '))?';
            } else {
              capture = prefix + '(' + capture + ')?';
            }
          } else {
            capture = prefix + '(' + capture + ')';
          }

          route += capture;
        }
      }

      var delimiter = escapeString(options.delimiter || '/');
      var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

      // In non-strict mode we allow a slash at the end of match. If the path to
      // match already ends with a slash, we remove it for consistency. The slash
      // is valid at the end of a path match, not in the middle. This is important
      // in non-ending mode, where "/test/" shouldn't match "/test//route".
      if (!strict) {
        route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
      }

      if (end) {
        route += '$';
      } else {
        // In non-ending mode, we need the capturing groups to match as much as
        // possible by using a positive lookahead to the end or next path segment.
        route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
      }

      return attachKeys(new RegExp('^' + route, flags(options)), keys)
    }

    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     *
     * @param  {(string|RegExp|Array)} path
     * @param  {(Array|Object)=}       keys
     * @param  {Object=}               options
     * @return {!RegExp}
     */
    function pathToRegexp (path, keys, options) {
      if (!isarray(keys)) {
        options = /** @type {!Object} */ (keys || options);
        keys = [];
      }

      options = options || {};

      if (path instanceof RegExp) {
        return regexpToRegexp(path, /** @type {!Array} */ (keys))
      }

      if (isarray(path)) {
        return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
      }

      return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
    }
    pathToRegexp_1.parse = parse_1;
    pathToRegexp_1.compile = compile_1;
    pathToRegexp_1.tokensToFunction = tokensToFunction_1;
    pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

    var strictUriEncode = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

    var token = '%[a-f0-9]{2}';
    var singleMatcher = new RegExp(token, 'gi');
    var multiMatcher = new RegExp('(' + token + ')+', 'gi');

    function decodeComponents(components, split) {
    	try {
    		// Try to decode the entire string first
    		return decodeURIComponent(components.join(''));
    	} catch (err) {
    		// Do nothing
    	}

    	if (components.length === 1) {
    		return components;
    	}

    	split = split || 1;

    	// Split the array in 2 parts
    	var left = components.slice(0, split);
    	var right = components.slice(split);

    	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
    }

    function decode(input) {
    	try {
    		return decodeURIComponent(input);
    	} catch (err) {
    		var tokens = input.match(singleMatcher);

    		for (var i = 1; i < tokens.length; i++) {
    			input = decodeComponents(tokens, i).join('');

    			tokens = input.match(singleMatcher);
    		}

    		return input;
    	}
    }

    function customDecodeURIComponent(input) {
    	// Keep track of all the replacements and prefill the map with the `BOM`
    	var replaceMap = {
    		'%FE%FF': '\uFFFD\uFFFD',
    		'%FF%FE': '\uFFFD\uFFFD'
    	};

    	var match = multiMatcher.exec(input);
    	while (match) {
    		try {
    			// Decode as big chunks as possible
    			replaceMap[match[0]] = decodeURIComponent(match[0]);
    		} catch (err) {
    			var result = decode(match[0]);

    			if (result !== match[0]) {
    				replaceMap[match[0]] = result;
    			}
    		}

    		match = multiMatcher.exec(input);
    	}

    	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
    	replaceMap['%C2'] = '\uFFFD';

    	var entries = Object.keys(replaceMap);

    	for (var i = 0; i < entries.length; i++) {
    		// Replace all decoded components
    		var key = entries[i];
    		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
    	}

    	return input;
    }

    var decodeUriComponent = function (encodedURI) {
    	if (typeof encodedURI !== 'string') {
    		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
    	}

    	try {
    		encodedURI = encodedURI.replace(/\+/g, ' ');

    		// Try the built in decoder first
    		return decodeURIComponent(encodedURI);
    	} catch (err) {
    		// Fallback to a more advanced decoder
    		return customDecodeURIComponent(encodedURI);
    	}
    };

    var splitOnFirst = (string, separator) => {
    	if (!(typeof string === 'string' && typeof separator === 'string')) {
    		throw new TypeError('Expected the arguments to be of type `string`');
    	}

    	if (separator === '') {
    		return [string];
    	}

    	const separatorIndex = string.indexOf(separator);

    	if (separatorIndex === -1) {
    		return [string];
    	}

    	return [
    		string.slice(0, separatorIndex),
    		string.slice(separatorIndex + separator.length)
    	];
    };

    function encoderForArrayFormat(options) {
    	switch (options.arrayFormat) {
    		case 'index':
    			return key => (result, value) => {
    				const index = result.length;
    				if (value === undefined || (options.skipNull && value === null)) {
    					return result;
    				}

    				if (value === null) {
    					return [...result, [encode(key, options), '[', index, ']'].join('')];
    				}

    				return [
    					...result,
    					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
    				];
    			};

    		case 'bracket':
    			return key => (result, value) => {
    				if (value === undefined || (options.skipNull && value === null)) {
    					return result;
    				}

    				if (value === null) {
    					return [...result, [encode(key, options), '[]'].join('')];
    				}

    				return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
    			};

    		case 'comma':
    			return key => (result, value) => {
    				if (value === null || value === undefined || value.length === 0) {
    					return result;
    				}

    				if (result.length === 0) {
    					return [[encode(key, options), '=', encode(value, options)].join('')];
    				}

    				return [[result, encode(value, options)].join(',')];
    			};

    		default:
    			return key => (result, value) => {
    				if (value === undefined || (options.skipNull && value === null)) {
    					return result;
    				}

    				if (value === null) {
    					return [...result, encode(key, options)];
    				}

    				return [...result, [encode(key, options), '=', encode(value, options)].join('')];
    			};
    	}
    }

    function parserForArrayFormat(options) {
    	let result;

    	switch (options.arrayFormat) {
    		case 'index':
    			return (key, value, accumulator) => {
    				result = /\[(\d*)\]$/.exec(key);

    				key = key.replace(/\[\d*\]$/, '');

    				if (!result) {
    					accumulator[key] = value;
    					return;
    				}

    				if (accumulator[key] === undefined) {
    					accumulator[key] = {};
    				}

    				accumulator[key][result[1]] = value;
    			};

    		case 'bracket':
    			return (key, value, accumulator) => {
    				result = /(\[\])$/.exec(key);
    				key = key.replace(/\[\]$/, '');

    				if (!result) {
    					accumulator[key] = value;
    					return;
    				}

    				if (accumulator[key] === undefined) {
    					accumulator[key] = [value];
    					return;
    				}

    				accumulator[key] = [].concat(accumulator[key], value);
    			};

    		case 'comma':
    			return (key, value, accumulator) => {
    				const isArray = typeof value === 'string' && value.split('').indexOf(',') > -1;
    				const newValue = isArray ? value.split(',') : value;
    				accumulator[key] = newValue;
    			};

    		default:
    			return (key, value, accumulator) => {
    				if (accumulator[key] === undefined) {
    					accumulator[key] = value;
    					return;
    				}

    				accumulator[key] = [].concat(accumulator[key], value);
    			};
    	}
    }

    function encode(value, options) {
    	if (options.encode) {
    		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
    	}

    	return value;
    }

    function decode$1(value, options) {
    	if (options.decode) {
    		return decodeUriComponent(value);
    	}

    	return value;
    }

    function keysSorter(input) {
    	if (Array.isArray(input)) {
    		return input.sort();
    	}

    	if (typeof input === 'object') {
    		return keysSorter(Object.keys(input))
    			.sort((a, b) => Number(a) - Number(b))
    			.map(key => input[key]);
    	}

    	return input;
    }

    function removeHash(input) {
    	const hashStart = input.indexOf('#');
    	if (hashStart !== -1) {
    		input = input.slice(0, hashStart);
    	}

    	return input;
    }

    function extract(input) {
    	input = removeHash(input);
    	const queryStart = input.indexOf('?');
    	if (queryStart === -1) {
    		return '';
    	}

    	return input.slice(queryStart + 1);
    }

    function parseValue(value, options) {
    	if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
    		value = Number(value);
    	} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
    		value = value.toLowerCase() === 'true';
    	}

    	return value;
    }

    function parse$1(input, options) {
    	options = Object.assign({
    		decode: true,
    		sort: true,
    		arrayFormat: 'none',
    		parseNumbers: false,
    		parseBooleans: false
    	}, options);

    	const formatter = parserForArrayFormat(options);

    	// Create an object with no prototype
    	const ret = Object.create(null);

    	if (typeof input !== 'string') {
    		return ret;
    	}

    	input = input.trim().replace(/^[?#&]/, '');

    	if (!input) {
    		return ret;
    	}

    	for (const param of input.split('&')) {
    		let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '=');

    		// Missing `=` should be `null`:
    		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    		value = value === undefined ? null : decode$1(value, options);
    		formatter(decode$1(key, options), value, ret);
    	}

    	for (const key of Object.keys(ret)) {
    		const value = ret[key];
    		if (typeof value === 'object' && value !== null) {
    			for (const k of Object.keys(value)) {
    				value[k] = parseValue(value[k], options);
    			}
    		} else {
    			ret[key] = parseValue(value, options);
    		}
    	}

    	if (options.sort === false) {
    		return ret;
    	}

    	return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
    		const value = ret[key];
    		if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
    			// Sort object keys, not values
    			result[key] = keysSorter(value);
    		} else {
    			result[key] = value;
    		}

    		return result;
    	}, Object.create(null));
    }

    var extract_1 = extract;
    var parse_1$1 = parse$1;

    var stringify = (object, options) => {
    	if (!object) {
    		return '';
    	}

    	options = Object.assign({
    		encode: true,
    		strict: true,
    		arrayFormat: 'none'
    	}, options);

    	const formatter = encoderForArrayFormat(options);

    	const objectCopy = Object.assign({}, object);
    	if (options.skipNull) {
    		for (const key of Object.keys(objectCopy)) {
    			if (objectCopy[key] === undefined || objectCopy[key] === null) {
    				delete objectCopy[key];
    			}
    		}
    	}

    	const keys = Object.keys(objectCopy);

    	if (options.sort !== false) {
    		keys.sort(options.sort);
    	}

    	return keys.map(key => {
    		const value = object[key];

    		if (value === undefined) {
    			return '';
    		}

    		if (value === null) {
    			return encode(key, options);
    		}

    		if (Array.isArray(value)) {
    			return value
    				.reduce(formatter(key), [])
    				.join('&');
    		}

    		return encode(key, options) + '=' + encode(value, options);
    	}).filter(x => x.length > 0).join('&');
    };

    var parseUrl = (input, options) => {
    	return {
    		url: removeHash(input).split('?')[0] || '',
    		query: parse$1(extract(input), options)
    	};
    };

    var queryString = {
    	extract: extract_1,
    	parse: parse_1$1,
    	stringify: stringify,
    	parseUrl: parseUrl
    };

    var PathService_1 = createCommonjsModule(function (module, exports) {
    /**
     *
     * Svelte Easyroute 2
     *
     * Path service
     *
     * uses "path-to-regexp"
     * https://github.com/pillarjs/path-to-regexp
     */
    var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var path_to_regexp_1 = __importDefault(pathToRegexp_1);
    var query_string_1 = __importDefault(queryString);
    var PathService = /** @class */ (function () {
        function PathService() {
            this.pathToRegexp = path_to_regexp_1.default;
            this.queryString = query_string_1.default;
        }
        PathService.prototype.parsePaths = function (routes) {
            var allRoutes = [];
            var recursive = function (routesArray, parentPath, nestingDepth) {
                if (parentPath === void 0) { parentPath = ""; }
                if (nestingDepth === void 0) { nestingDepth = 0; }
                routesArray.forEach(function (el) {
                    if (parentPath.length) {
                        parentPath = parentPath.replace(/\*/g, "");
                        var elPath = el.path;
                        if (elPath[0] !== "/")
                            elPath = "/" + elPath;
                        el.path = parentPath + elPath;
                        el.nestingDepth = nestingDepth;
                    }
                    else {
                        el.nestingDepth = nestingDepth;
                    }
                    allRoutes.push(el);
                    if (el.children && el.children.length) {
                        recursive(el.children, el.path, nestingDepth + 1);
                    }
                });
            };
            recursive(routes);
            return allRoutes;
        };
        PathService.prototype.getPathInformation = function (routes) {
            var _this = this;
            var allRoutes = this.parsePaths(routes);
            console.log(allRoutes);
            return allRoutes.map(function (route) {
                var keysArray = [];
                route.regexpPath = _this.pathToRegexp(route.path, keysArray);
                route.pathKeys = keysArray;
                return route;
            });
        };
        return PathService;
    }());
    exports.default = PathService;
    });

    unwrapExports(PathService_1);

    var HashBasedRouting_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var HashBasedRouting = /** @class */ (function () {
        function HashBasedRouting(routes) {
            this.routes = routes;
        }
        HashBasedRouting.prototype.parse = function (url) {
            this.routes = this.routes.map(function (route) {
                route.nested = undefined;
                return route;
            });
            var matchedRoutes = this.routes
                .reduce(function (total, current) {
                if (url.match(current.regexpPath))
                    total.push(current);
                return total;
            }, []);
            var nestingDepth = 0;
            if (matchedRoutes.length > 1) {
                var matchedParent = matchedRoutes[0];
                for (var i = 0; i < matchedRoutes.length; i++) {
                    matchedParent.nested = matchedRoutes[i];
                    nestingDepth = matchedRoutes[i].nestingDepth;
                    matchedParent = matchedParent.nested;
                }
            }
            return {
                route: matchedRoutes[0],
                transitionDepth: nestingDepth || 0,
            };
        };
        return HashBasedRouting;
    }());
    exports.default = HashBasedRouting;
    });

    unwrapExports(HashBasedRouting_1);

    var UrlParser_1 = createCommonjsModule(function (module, exports) {
    var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var query_string_1 = __importDefault(queryString);
    var UrlParser = /** @class */ (function () {
        function UrlParser() {
            this.qString = query_string_1.default;
        }
        UrlParser.prototype.getQueryParams = function (queryString) {
            return this.qString.parse(queryString);
        };
        UrlParser.prototype.getPathParams = function (matchedRoute, url) {
            var pathValues = matchedRoute.regexpPath.exec(url);
            pathValues = pathValues.slice(1, pathValues.length);
            var urlParams = {};
            for (var pathPart in pathValues) {
                var value = pathValues[pathPart];
                var key = matchedRoute.pathKeys[pathPart].name;
                if (typeof key !== "number")
                    urlParams[key] = value;
            }
            return urlParams;
        };
        UrlParser.prototype.createRouteObject = function (matchedRoute, path, query, fullPath) {
            var pathParams = this.getPathParams(matchedRoute, path);
            var queryParams = this.getQueryParams(query);
            return {
                fullPath: fullPath,
                route: path.split('/'),
                query: JSON.parse(JSON.stringify(queryParams)),
                params: pathParams
            };
        };
        return UrlParser;
    }());
    exports.default = UrlParser;
    });

    unwrapExports(UrlParser_1);

    var dist = createCommonjsModule(function (module, exports) {
    var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });

    var PathService_1$1 = __importDefault(PathService_1);
    var HashBasedRouting_1$1 = __importDefault(HashBasedRouting_1);
    var UrlParser_1$1 = __importDefault(UrlParser_1);
    var CssTransitionService_1$1 = __importDefault(CssTransitionService_1);
    var ROUTER_MODES = [
        "hash",
        "history",
        "silent"
    ];
    var Router = /** @class */ (function () {
        function Router(params) {
            this.pathService = new PathService_1$1.default();
            this.urlParser = new UrlParser_1$1.default();
            this.mode = "hash";
            this.baseUrl = "/";
            this.fullUrl = "/";
            this.newTransitionMode = false;
            Router.validateParameters(params);
            this.mode = params.mode || "hash";
            this.baseUrl = Router.formatBaseUrl(params.base);
            this.routes = this.pathService.getPathInformation(params.routes);
            this.beforeEach = params.beforeEach;
            if (params.transition) {
                this.transitionService = new CssTransitionService_1$1.default(params.transition);
            }
            else {
                this.transitionService = null;
            }
            this.setParser();
        }
        Router.validateParameters = function (params) {
            if (!params || typeof params !== "object") {
                throw new RouterException_1.RouterException("Wrong parameters object format!");
            }
            if (!ROUTER_MODES.includes(params.mode)) {
                console.warn("Easyroute: router \"mode\" is not selected. You should choose one of this: " + ROUTER_MODES.join(", ") + ". Auto-selected: \"hash\".");
                params.mode = "hash";
            }
        };
        Router.formatBaseUrl = function (baseUrl) {
            if (!baseUrl)
                return "/";
            if (baseUrl.length) {
                if (baseUrl[0] !== "/")
                    baseUrl = "/" + baseUrl;
                if (baseUrl[baseUrl.length - 1] !== "/")
                    baseUrl = baseUrl + "/";
            }
            return baseUrl;
        };
        Router.prototype.setParser = function () {
            var _this = this;
            if (this.mode === "hash") {
                this.parser = new HashBasedRouting_1$1.default(this.routes);
                this.parseRoute(window.location.hash.replace("#", ""));
                window.addEventListener("hashchange", function () {
                    _this.parseRoute(window.location.hash.replace("#", ""));
                });
            }
            // if (this.baseUrl) this.parseRoute(this.baseUrl);
        };
        Router.prototype.parseRoute = function (url) {
            var _a;
            var _b = url.split("?"), path = _b[0], query = _b[1];
            var Matched = this.parser.parse(path);
            var matchedRoute = Matched.route;
            var nestingTo = Matched.transitionDepth;
            var nestingFrom = ((_a = this.currentRoute) === null || _a === void 0 ? void 0 : _a.nestingTo) || 0;
            if (!matchedRoute) {
                console.warn("Easyroute :: no routes matched \"" + url + "\"");
                return;
            }
            this.routeInfo = this.urlParser.createRouteObject(matchedRoute, path, query, url);
            this.previousRoute = this.currentRoute ? JSON.parse(JSON.stringify(this.currentRoute)) : undefined;
            this.currentRoute = {
                routeObject: matchedRoute,
                routeInfo: this.routeInfo,
                nestingTo: nestingTo,
                nestingFrom: nestingFrom
            };
            console.log(this.currentRoute);
            this.fireNavigation(nestingTo);
        };
        Router.prototype._beforeEach = function (to, from) {
            var _this = this;
            return new Promise(function (resolve) {
                if (!_this.beforeEach)
                    resolve();
                _this.beforeEach(to, from, resolve);
            });
        };
        Router.prototype._afterEach = function (to, from) {
            if (!this.afterEach)
                return;
            this.afterEach(to, from);
        };
        Router.prototype.fireNavigation = function (transitionDepth) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.transitionService && !this.newTransitionMode)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.transitionService.transitionOut(transitionDepth)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [4 /*yield*/, this._beforeEach(this.currentRoute, this.previousRoute)];
                        case 3:
                            _a.sent();
                            if (this.afterUpdate)
                                this.afterUpdate();
                            if (!(this.transitionService && !this.newTransitionMode)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.transitionService.transitionIn(transitionDepth)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            this._afterEach(this.currentRoute, this.previousRoute);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return Router;
    }());
    exports.default = Router;
    });

    var Router = unwrapExports(dist);

    var router = new Router({
        base: "", // NOT required
        mode: "hash",
        routes: [
            {
                path: "/",
                component: Index,
                name: "Index"
            },
            {
                path: "/test*",
                component: Test,
                name: "Test",
                children: [
                    {
                        path: "nested*",
                        component: Nested,
                        children: [
                            {
                                path: "deep",
                                component: NestedDeep
                            }
                        ]
                    },
                    {
                        path: "nostoddoop",
                        component: NestedDeep
                    }
                ]
            },
            {
                path: "/playground/:param1/params/:param2",
                component: ParamsPlayground,
                name: "ParamsPlayground"
            }
        ]
    });

    const app = new App({
        target: document.body,
        props: {
            name: "world",
            router
        }
    });

    window.app = app;

    exports.default = app;
    exports.router = router;

    return exports;

}({}));
//# sourceMappingURL=bundle.js.map
